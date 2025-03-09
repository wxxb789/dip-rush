// src/types/ui.ts
import type { ReactNode } from 'react';
import type { ApiKeyStatus } from './api';
import type { ScreenerResult, StockData } from './indicators';

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en-US' | 'zh-CN';

export interface TabProps {
  value: string;
  label: string;
  children: ReactNode;
}

export interface StockChartProps {
  data: StockData;
  selectedIndicators: string[];
  timeframe: string;
  height?: number;
  width?: number;
  onTimeframeChange?: (timeframe: string) => void;
  onIndicatorToggle?: (indicator: string) => void;
}

export interface ResultsTableProps {
  data: ScreenerResult[];
  loading: boolean;
  onRowClick: (symbol: string) => void;
}

export interface ApiKeyFormProps {
  onApiKeySubmit: (apiKey: string) => Promise<ApiKeyStatus>;
  initialApiKey?: string;
  loading?: boolean;
  error?: string;
}

export interface TooltipData {
  value: number;
  label: string;
  color?: string;
  dataKey?: string;
}

export interface ChartControlsProps {
  timeframes: { label: string; value: string }[];
  selectedTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  indicators: { label: string; value: string }[];
  selectedIndicators: string[];
  onIndicatorToggle: (indicator: string) => void;
}

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export interface ErrorMessageProps {
  message: string;
  retry?: () => void;
}

export interface EmptyStateProps {
  message: string;
  icon?: ReactNode;
}

export interface PageLayoutProps {
  children: ReactNode;
  title?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

export interface HeaderProps {
  navigationItems?: NavigationItem[];
}

export interface FooterProps {
  version?: string;
}
