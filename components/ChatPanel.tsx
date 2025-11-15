import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { UserIcon } from './icons/UserIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { SendIcon } from './icons/SendIcon';
import { ErrorIcon } from './icons/ErrorIcon';

interface ChatPanelProps {
  onQuerySubmit: (query: string) => void;
  isLoading: boolean;
  chatHistory: ChatMessage[];
}

const exampleQueries = [
    "Compare Q1 vs Q2 2024 sales for the Pro Widget in North America and Europe.",
    "What was customer sentiment after the Phoenix app update? Any major bugs?",
    "Analyze the ROI for the 'Summer Splash' marketing campaign and its impact on user sign-ups.",
    "Summarize InnovateCorp's strategy based on our Q2 competitive analysis notes.",
];


export const ChatPanel: React.FC<ChatPanelProps> = ({ onQuerySubmit, isLoading, chatHistory }) => {
  const [query, setQuery] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onQuerySubmit(query.trim());
      setQuery('');
    }
  };

  const handleExampleQueryClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
  }

  return (
    <div className="bg-base-100 rounded-xl shadow-lg flex flex-col h-full p-4 overflow-hidden">
        <h2 className="text-lg font-bold mb-4 text-base-content">AI Analyst Assistant</h2>
      <div className="flex-grow overflow-y-auto pr-2 space-y-4">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 animate-fade-in ${msg.type === 'user' ? 'justify-end' : ''}`}>
            {msg.type !== 'user' && (
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.type === 'ai' ? 'bg-brand-primary text-white' : 'bg-red-500 text-white'}`}>
                {msg.type === 'ai' ? <SparklesIcon className="w-5 h-5" /> : <ErrorIcon className="w-5 h-5" />}
              </div>
            )}
            <div className={`max-w-xs md:max-w-sm p-3 rounded-lg ${msg.type === 'user' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-base-200 text-base-content rounded-bl-none'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
             {msg.type === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-base-300 text-base-content-secondary">
                <UserIcon className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}
        {isLoading && chatHistory.some(m => m.type === 'user') && (
            <div className="flex items-start gap-3 animate-fade-in">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-brand-primary text-white">
                    <SparklesIcon className="w-5 h-5 animate-pulse" />
                </div>
                <div className="p-3 rounded-lg bg-base-200 text-base-content rounded-bl-none">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-base-content-secondary rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-base-content-secondary rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-base-content-secondary rounded-full animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={chatEndRef} />
      </div>

       {chatHistory.length === 0 && !isLoading && (
            <div className="text-center p-4">
                <h3 className="text-md font-semibold text-base-content mb-2">Ask me anything about your business</h3>
                <p className="text-sm text-base-content-secondary mb-4">Or try one of these examples:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {exampleQueries.map((q) => (
                        <button key={q} onClick={() => handleExampleQueryClick(q)} className="p-2 bg-base-200 hover:bg-base-300 rounded-lg text-left transition-colors duration-200">
                           {q}
                        </button>
                    ))}
                </div>
            </div>
        )}

      <form onSubmit={handleSubmit} className="mt-4 flex items-center space-x-2 border-t border-base-200 pt-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question..."
          className="flex-grow p-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition-shadow"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="p-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-base-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> 
            : <SendIcon className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
};