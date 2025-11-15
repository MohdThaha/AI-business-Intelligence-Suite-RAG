
import React from 'react';
import type { Kpi } from '../types';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { ArrowDownIcon } from './icons/ArrowDownIcon';
import { MinusIcon } from './icons/MinusIcon';


const iconMap = {
  increase: <ArrowUpIcon className="w-4 h-4" />,
  decrease: <ArrowDownIcon className="w-4 h-4" />,
  neutral: <MinusIcon className="w-4 h-4" />,
};

const colorMap = {
  increase: 'text-green-500 bg-green-100',
  decrease: 'text-red-500 bg-red-100',
  neutral: 'text-gray-500 bg-gray-100',
};


export const KpiCard: React.FC<Kpi> = ({ label, value, change, changeType }) => {
  return (
    <div className="bg-base-100 p-4 rounded-xl border border-base-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <p className="text-sm text-base-content-secondary font-medium">{label}</p>
      <div className="mt-1 flex items-baseline justify-between">
        <p className="text-2xl font-bold text-base-content">{value}</p>
        <div className={`flex items-center text-sm font-semibold px-2 py-1 rounded-full ${colorMap[changeType]}`}>
          {iconMap[changeType]}
          <span className="ml-1">{change}</span>
        </div>
      </div>
    </div>
  );
};
