
import React from 'react';
import { ChartBarIcon } from './icons/ChartBarIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-base-100 shadow-md p-4 flex items-center justify-between z-10">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-brand-primary rounded-lg text-white">
          <ChartBarIcon className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-base-content">AI Business Intelligence Suite</h1>
      </div>
       <div className="flex items-center space-x-2">
         <span className="text-sm font-semibold text-brand-primary">Powered by</span>
         <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
           Gemini
         </span>
       </div>
    </header>
  );
};
