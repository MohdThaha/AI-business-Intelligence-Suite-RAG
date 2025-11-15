
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { ChartType, ChartDataPoint } from '../types';

interface ChartComponentProps {
  data: ChartDataPoint[];
  type: ChartType;
  dataKey: string;
}

const chartComponents = {
  bar: BarChart,
  line: LineChart,
  area: AreaChart,
};

const seriesComponents = {
  bar: Bar,
  line: Line,
  area: Area,
};

export const ChartComponent: React.FC<ChartComponentProps> = ({ data, type, dataKey }) => {
  const Chart = chartComponents[type];
  const Series = seriesComponents[type];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Chart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
        <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
          }}
        />
        <Legend wrapperStyle={{ fontSize: '14px' }}/>
        <Series 
          type="monotone" 
          dataKey={dataKey} 
          fill="#4f46e5" 
          stroke="#4f46e5" 
          fillOpacity={type === 'area' ? 0.2 : 1}
        />
      </Chart>
    </ResponsiveContainer>
  );
};
