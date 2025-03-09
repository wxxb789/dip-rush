// src/types/indicators.ts
export interface RSIParams {
  timeperiod: number;
}

export interface MACDParams {
  fastperiod: number;
  slowperiod: number;
  signalperiod: number;
}

export interface BollingerBandsParams {
  timeperiod: number;
  nbdevup: number;
  nbdevdn: number;
}

export interface MovingAverageParams {
  timeperiod: number;
  seriestype: 'open' | 'high' | 'low' | 'close';
}

type IndicatorParamValue =
  | number
  | 'open'
  | 'high'
  | 'low'
  | 'close'
  | boolean
  | undefined;

export interface IndicatorParams {
  [key: string]: IndicatorParamValue;
}

export interface MACDResult {
  macd: number[];
  signal: number[];
  histogram: number[];
}

export interface BollingerBandsResult {
  upper: number[];
  middle: number[];
  lower: number[];
}

export interface DipDetectionResult {
  symbol: string;
  name?: string;
  matchesCriteria: boolean;
  rsiBelowThreshold: boolean;
  macdBullishCross: boolean;
  belowLowerBollingerBand: boolean;
  goldenCross: boolean;
  currentPrice: number;
  rsiValue: number;
  latestTimestamp: number;
  industry?: string;
}

export interface ScreeningCriteria {
  // RSI settings
  rsiEnabled: boolean;
  rsiThreshold: number;
  // Other technical indicators
  macdSignalCrossoverEnabled: boolean;
  bollingerBandTouchEnabled: boolean;
  goldenCrossEnabled: boolean;
  // Optional custom criteria
  customCriteria?: Record<string, number | string | boolean>;
}

export interface StockData {
  symbol: string;
  candles: {
    open: number[];
    high: number[];
    low: number[];
    close: number[];
    volume: number[];
    timestamp: number[];
  };
  indicators: {
    rsi?: number[];
    macd?: MACDResult;
    bollingerBands?: BollingerBandsResult;
    ma50?: number[];
    ma200?: number[];
  };
  profile?: {
    name: string;
    industry: string;
    logo: string;
  };
}

export type SortDirection = 'asc' | 'desc';

export interface ScreenerResult extends DipDetectionResult {
  // Additional fields for the screener table
  changePercent?: number;
  volume?: number;
}
