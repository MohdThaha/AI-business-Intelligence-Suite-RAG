
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-base-content-secondary font-semibold">AI is analyzing...</p>
    </div>
  );
};
