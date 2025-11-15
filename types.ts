
export interface Kpi {
  label: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
}

export interface ChartDataPoint {
  name: string;
  [key: string]: number | string;
}

export type ChartType = 'bar' | 'line' | 'area';

export interface AnalyticsResponse {
  summary: string;
  kpis: Kpi[];
  chartData: ChartDataPoint[];
  chartType: ChartType;
  chartKey: string;
  chartTitle: string;
}

export interface ChatMessage {
  type: 'user' | 'ai' | 'error';
  text: string;
}
