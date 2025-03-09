// src/types/api.ts
export interface CandleData {
  c: number[]; // close prices
  h: number[]; // high prices
  l: number[]; // low prices
  o: number[]; // open prices
  s: string; // status
  t: number[]; // timestamps
  v: number[]; // volumes
}

export interface Quote {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
}

export interface StockSymbol {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

export interface IndicatorResponse {
  c: number[]; // Indicator values
  s: string; // Status
  t: number[]; // Timestamps
}

export type ApiResponse<T> = {
  status: 'success' | 'error';
  data?: T;
  error?: string;
};

export interface FinnhubErrorResponse {
  error: string;
}

export interface ApiKeyStatus {
  isValid: boolean;
  message?: string;
}

export type Resolution = '1' | '5' | '15' | '30' | '60' | 'D' | 'W' | 'M';

// AKTools US Stock Request Parameters
export interface AKToolsUSStockParams {
  symbol: string; // Use stock_us_spot_em from Asset (e.g. "107.SPY")
  period: 'daily'; // Currently only supports 'daily'
  start_date: string; // YYYYMMDD format
  end_date: string; // YYYYMMDD format
  adjust: string; // e.g. 'qfq' for forward adjusted price
}

// AKTools US Stock Historical Response
export interface AKToolsHistoricalResponse {
  date: string; // Trading date (YYYY-MM-DD format)
  open: number; // Opening price
  close: number; // Closing price
  high: number; // Highest price
  low: number; // Lowest price
  volume: number; // Trading volume
  amount: number; // Trading amount
  amplitude: number; // Price amplitude percentage
  change_percent: number; // Price change percentage
  change_amount: number; // Absolute price change
  turnover_rate: number; // Stock turnover rate
}

// AKTools API response types
export interface AKToolsQuoteResponse {
  收盘: number;
  涨跌额: number;
  涨跌幅: number;
  最高: number;
  最低: number;
  开盘: number;
  前收盘: number;
}

export interface AKToolsCandleResponse {
  收盘: number[];
  最高: number[];
  最低: number[];
  开盘: number[];
  时间: number[];
  成交量: number[];
}
