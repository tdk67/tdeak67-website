// Server-side proxy keeps the Gemini API key off the client.
// The browser only talks to our own backend at /api/chat which:
//   - holds the key in its environment (.env)
//   - applies per-IP rate limiting (nginx + app-level token bucket)
//   - streams the assistant text back to the client
const CHAT_ENDPOINT = '/api/chat';

/**
 * Stream a chat message through the server-side proxy.
 * Yields the assistant text chunks as they arrive.
 */
export const sendMessageToGemini = async function* (message: string) {
  // Bounded conversation window so the proxy keeps context server-side;
  // the client never holds or sends the API key.
  const conversation = getRecentMessages();

  let res: Response;
  try {
    res = await fetch(CHAT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversation }),
    });
  } catch (err) {
    console.error('chat proxy unreachable', err);
    yield '⚠️ I cannot reach the chat service right now. Please try again later.';
    return;
  }

  if (!res.ok) {
    if (res.status === 429) {
      yield '⚠️ You are sending messages too fast. Please wait a moment and try again.';
      return;
    }
    const errText = await res.text();
    console.error('chat proxy error', res.status, errText.slice(0, 300));
    yield '⚠️ Chat service error. Please try again later.';
    return;
  }

  // Stream the text/plain body chunk by chunk.
  if (!res.body) return;
  const reader = res.body.getReader();

  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    // Yield incrementally for a live typing effect.
    if (buffer.length > 0) {
      yield buffer;
      buffer = '';
    }
  }
};

// --- small client-side conversation memory --------------------------------
// Stores the last few turns so the proxy can answer contextually without the
// client ever needing the API key.
const RECENT_KEY = 'tdeak_chat_recent_context';

function getRecentMessages(): { role: 'user' | 'model'; text: string }[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((m) => m && (m.role === 'user' || m.role === 'model') && typeof m.text === 'string')
      .slice(-8);
  } catch {
    return [];
  }
}

export function rememberMessage(role: 'user' | 'model', text: string) {
  try {
    const history = getRecentMessages();
    history.push({ role, text: text.slice(0, 2000) });
    localStorage.setItem(RECENT_KEY, JSON.stringify(history.slice(-12)));
  } catch {
    /* non-fatal */
  }
}