export type TimeframeType = 'D' | 'W' | 'M';

export interface StockData {
  symbol: string;
  name?: string;
  timeframe: TimeframeType;
  prices: {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
  indicators?: {
    rsi?: number[];
    macd?: {
      line: number[];
      signal: number[];
      histogram: number[];
    };
    bollingerBands?: {
      upper: number[];
      middle: number[];
      lower: number[];
    };
    movingAverages?: {
      ma50: number[];
      ma200: number[];
    };
  };
}
