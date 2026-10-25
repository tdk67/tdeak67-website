import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sendMessageToGemini, rememberMessage } from '../services/geminiService';
import { ChatMessage } from '../types';
import Captcha from './Captcha';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm Tamas's AI assistant. Ask me about his experience with Agentic AI, his work at Ericsson, or his technical skills." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Load CAPTCHA verification state (lasts 24 hours)
  const [isVerified, setIsVerified] = useState<boolean>(() => {
    try {
      const verifiedAt = localStorage.getItem('tdeak_captcha_verified_at');
      if (verifiedAt) {
        const parsed = parseInt(verifiedAt, 10);
        const now = Date.now();
        if (now - parsed < 24 * 60 * 60 * 1000) {
          return true;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  });

  // Rate Limiting seconds left to wait
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && isVerified) {
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isVerified]);

  // Handle Escape key to close chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Rate limiter countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading || secondsLeft > 0) return;
    if (!isVerified) return;

    // Hard character ceiling to prevent payload memory blowout
    const sanitizedInput = inputValue.trim().slice(0, 1500);
    const userText = sanitizedInput;

    // -- RATE LIMITER CHECK --
    const now = Date.now();
    let timestamps: number[] = [];
    try {
      const stored = localStorage.getItem('tdeak_chat_timestamps');
      if (stored) {
        timestamps = JSON.parse(stored);
      }
    } catch (err) {
      console.error(err);
    }

    // Filter out timestamps older than 3 minutes (180 seconds)
    const threeMinutesAgo = now - 3 * 60 * 1000;
    timestamps = timestamps.filter(t => t > threeMinutesAgo);

    // 1. Burst limit: Max 3 messages within 10 seconds
    const tenSecondsAgo = now - 10 * 1000;
    const recentTimestamps = timestamps.filter(t => t > tenSecondsAgo);

    if (recentTimestamps.length >= 3) {
      const waitTime = Math.ceil((recentTimestamps[0] + 10 * 1000 - now) / 1000);
      setSecondsLeft(waitTime);
      setMessages(prev => [
        ...prev, 
        { role: 'user', text: userText },
        { role: 'model', text: `⚠️ **Spam Protection**: You are sending messages too quickly. Please wait **${waitTime}** seconds.` }
      ]);
      return;
    }

    // 2. Sustained limit: Max 10 messages within 3 minutes
    if (timestamps.length >= 10) {
      const waitTime = Math.ceil((timestamps[0] + 3 * 60 * 1000 - now) / 1000);
      setSecondsLeft(waitTime);
      setMessages(prev => [
        ...prev, 
        { role: 'user', text: userText },
        { role: 'model', text: `⚠️ **Rate Limit Exceeded**: You have sent too many messages in a short time. Please wait **${waitTime}** seconds.` }
      ]);
      return;
    }

    // Append current timestamp and save back to localStorage
    timestamps.push(now);
    try {
      localStorage.setItem('tdeak_chat_timestamps', JSON.stringify(timestamps));
    } catch (err) {
      console.error(err);
    }

    setInputValue('');
    setIsLoading(true);

    // Add User Message
    setMessages(prev => [...prev, { role: 'user', text: userText }]);

    // Add Placeholder Model Message for Streaming
    setMessages(prev => [...prev, { role: 'model', text: '', isStreaming: true }]);

    try {
      const stream = sendMessageToGemini(userText);
      rememberMessage('user', userText);
      let fullResponse = "";
      let hasResponse = false;

      for await (const chunk of stream) {
        hasResponse = true;
        fullResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg.role === 'model' && lastMsg.isStreaming) {
            lastMsg.text = fullResponse;
          }
          return newMessages;
        });
      }

      if (fullResponse.trim()) {
        rememberMessage('model', fullResponse.trim());
      }

      if (!hasResponse) {
          // Handle empty stream edge case
          setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          lastMsg.text = "I'm having trouble connecting to the brain right now. Please check the API Key configuration.";
          return newMessages;
        });
      }

      // Finalize message state
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];
        lastMsg.isStreaming = false;
        return newMessages;
      });

    } catch (error) {
      console.error(error);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];
        lastMsg.text = "Sorry, something went wrong. Please try again.";
        lastMsg.isStreaming = false;
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <section 
          id="chat-window" 
          aria-label="AI Assistant Chat"
          className="bg-paper-hi w-[calc(100vw-32px)] sm:w-[380px] h-[70dvh] sm:h-[550px] rounded-3xl shadow-sheet flex flex-col border border-rule overflow-hidden mb-4 transition-opacity duration-200 ease-in-out"
        >
          {/* Header */}
          <div className="bg-slate-800 text-white p-4 flex justify-between items-center flex-shrink-0">
            <div>
              <h3 className="font-semibold text-sm">Ask about Tamas</h3>
              <p className="text-xs text-slate-300">Powered by Gemini 2.5 Flash</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              aria-label="Close Chat Window (or press Escape)" 
              className="text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white rounded-md p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div 
            className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4 scrollbar-hide"
            aria-live="polite"
            role="log"
            aria-label="Chat message history"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-accent text-accent-ink rounded-br-none shadow-sm' 
                    : 'bg-paper-hi border border-rule text-ink rounded-bl-none shadow-sm'
                }`}>
                  {msg.role === 'model' ? (
                    <div className="markdown-body">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                          li: ({node, ...props}) => <li className="pl-1" {...props} />,
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                          h1: ({node, ...props}) => <h1 className="font-bold text-lg mb-2" {...props} />,
                          h2: ({node, ...props}) => <h2 className="font-bold text-md mb-2" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold text-slate-900" {...props} />,
                          a: ({node, href, ...props}) => {
                            const isSafe = href && !href.toLowerCase().startsWith('javascript:');
                            return (
                              <a 
                                href={isSafe ? href : '#'} 
                                className="text-blue-600 hover:underline" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                {...props} 
                              />
                            );
                          },
                          code: ({node, ...props}) => <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono text-xs" {...props} />,
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                  {msg.isStreaming && <span className="inline-block w-1 h-4 ml-1 bg-slate-400 animate-pulse">|</span>}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input / Captcha Area */}
          {!isVerified ? (
            <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0 flex items-center justify-center">
              <Captcha onVerify={() => {
                setIsVerified(true);
                try {
                  localStorage.setItem('tdeak_captcha_verified_at', Date.now().toString());
                } catch (e) {
                  console.error(e);
                }
              }} />
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex-shrink-0">
              <div className="relative">
                <input
                  ref={chatInputRef}
                  type="text"
                  maxLength={1500}
                  aria-label="Message input for AI Assistant"
                  className="w-full pl-4 pr-10 py-2.5 bg-paper-2 rounded-full text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent transition-colors placeholder-muted disabled:opacity-60 border border-rule"
                  placeholder={secondsLeft > 0 ? `Spam protection: Wait ${secondsLeft}s...` : "Ask me about Tamas..."}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading || secondsLeft > 0}
                />
                <button 
                  type="submit"
                  aria-label="Send message"
                  disabled={isLoading || secondsLeft > 0 || !inputValue.trim()}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    inputValue.trim() && secondsLeft === 0 && !isLoading ? 'text-blue-600 hover:bg-blue-100' : 'text-slate-400'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      {/* Floating handwritten prompt when closed */}
      {!isOpen && (
        <div className="font-hand text-xl text-ink font-bold bg-paper-hi border border-rule px-3.5 py-1 rounded-2xl shadow-sm mb-2 transform -rotate-3 select-none hidden sm:block">
          Ask my AI assistant! 💬
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="chat-window"
        className={`${isOpen ? 'bg-ink' : 'bg-accent'} hover:opacity-95 text-paper p-4 rounded-full shadow-lg transition-transform transition-colors duration-200 motion-safe:hover:scale-105 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-accent/40 focus:ring-offset-2`}
        aria-label={isOpen ? "Close Chat" : "Open AI Assistant Chat"}
      >
        {isOpen ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
           </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
