
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ChatPanel } from './components/ChatPanel';
import { Dashboard } from './components/Dashboard';
import type { AnalyticsResponse, ChatMessage } from './types';
import { getBusinessInsights } from './services/geminiService';

const App: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuerySubmit = useCallback(async (query: string) => {
    if (!query || isLoading) return;

    setIsLoading(true);
    setError(null);
    const newChatMessage: ChatMessage = { type: 'user', text: query };
    setChatHistory(prev => [...prev, newChatMessage]);

    try {
      const result = await getBusinessInsights(query);
      setAnalyticsData(result);
      const aiMessage: ChatMessage = { type: 'ai', text: result.summary };
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError('Failed to generate insights. Please try again.');
      const errorMessageItem: ChatMessage = { type: 'error', text: errorMessage };
      setChatHistory(prev => [...prev, errorMessageItem]);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);


  return (
    <div className="flex flex-col h-screen font-sans bg-base-200 text-base-content">
      <Header />
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 overflow-hidden">
        <div className="lg:col-span-1 xl:col-span-1 h-full">
          <ChatPanel 
            onQuerySubmit={handleQuerySubmit} 
            isLoading={isLoading}
            chatHistory={chatHistory}
          />
        </div>
        <div className="lg:col-span-2 xl:col-span-3 h-full overflow-y-auto rounded-xl">
           <Dashboard 
            data={analyticsData} 
            isLoading={isLoading}
            error={error}
            hasHistory={chatHistory.length > 0}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
