import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

// Initialize the API client
// The API key must be obtained exclusively from the environment variable process.env.API_KEY
const apiKey = process.env.API_KEY;

// Debugging logs for troubleshooting
if (!apiKey) {
  console.error("❌ Gemini API Key is missing. The app was built without 'API_KEY' or 'GEMINI_API_KEY' set.");
} else {
  // Log first 4 chars to confirm it's loaded without leaking the full key
  console.log(`✅ Gemini API Key loaded (starts with: ${apiKey.substring(0, 4)}...)`);
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'DUMMY_KEY_FOR_INIT' });

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async function* (message: string) {
  if (!apiKey) {
    yield "I am currently offline because my API key is missing. Please contact the administrator.";
    return;
  }

  const chat = getChatSession();
  
  try {
    const result = await chat.sendMessageStream({ message });
    
    for await (const chunk of result) {
      const responseChunk = chunk as GenerateContentResponse;
      if (responseChunk.text) {
        yield responseChunk.text;
      }
    }
  } catch (error: any) {
    console.error("Error communicating with Gemini:", error);
    
    // Improved error handling for common issues
    if (error.message?.includes("API key not valid")) {
      yield "Configuration Error: The API key provided is invalid.";
    } else if (error.message?.includes("403")) {
      yield "Access Denied: The API key cannot be used from this domain. Please check the API key restrictions in Google AI Studio.";
    } else {
      yield "I'm sorry, I encountered an issue connecting to the knowledge base. Please try again later.";
    }
  }
};