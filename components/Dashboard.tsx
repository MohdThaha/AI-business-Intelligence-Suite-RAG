
import React from 'react';
import type { AnalyticsResponse } from '../types';
import { KpiCard } from './KpiCard';
import { ChartComponent } from './ChartComponent';
import { LoadingSpinner } from './LoadingSpinner';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';

interface DashboardProps {
  data: AnalyticsResponse | null;
  isLoading: boolean;
  error: string | null;
  hasHistory: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, isLoading, error, hasHistory }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-base-100 rounded-xl shadow-lg">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-base-100 rounded-xl shadow-lg text-red-500 p-8">
        <h3 className="text-xl font-bold mb-2">Analysis Failed</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!data && !hasHistory) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-base-100 rounded-xl shadow-lg text-center p-8">
        <ChartBarIcon className="w-16 h-16 text-brand-primary opacity-50 mb-4" />
        <h2 className="text-2xl font-bold text-base-content">Welcome to your AI-Powered Dashboard</h2>
        <p className="mt-2 text-base-content-secondary max-w-md">
          Ask the AI Analyst a question to generate insights, visualize data, and uncover trends in your business. Your results will appear here.
        </p>
      </div>
    );
  }
  
  if (!data && hasHistory) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-base-100 rounded-xl shadow-lg text-center p-8">
            <h2 className="text-2xl font-bold text-base-content">Ready for the next query</h2>
            <p className="mt-2 text-base-content-secondary max-w-md">
            Your previous conversation is on the left. Ask a new question to continue your analysis.
            </p>
        </div>
      )
  }

  if (!data) return null;

  return (
    <div className="space-y-6 animate-fade-in p-6 bg-base-100 rounded-xl shadow-lg h-full overflow-y-auto">
      <div className="animate-slide-in-up">
        <h2 className="text-2xl font-bold mb-2 text-base-content">Analysis & Insights</h2>
        <div className="flex items-start bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
            <LightBulbIcon className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-1"/>
            <p className="text-blue-800">{data.summary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 animate-slide-in-up [animation-delay:0.1s]">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="h-96 w-full animate-slide-in-up [animation-delay:0.2s]">
         <h3 className="text-xl font-bold mb-4 text-base-content">{data.chartTitle}</h3>
        <ChartComponent 
          data={data.chartData} 
          type={data.chartType} 
          dataKey={data.chartKey}
        />
      </div>
    </div>
  );
};
