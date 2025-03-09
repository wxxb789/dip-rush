export interface ScreeningCriteria {
  rsiThreshold: number;
  rsiEnabled: boolean;
  macdSignalCrossoverEnabled: boolean;
  bollingerBandTouchEnabled: boolean;
  goldenCrossEnabled: boolean;
}

// Updated to match the ScreenerResult type from indicators.ts
export interface ScreeningResult {
  symbol: string;
  name?: string;
  industry?: string;
  currentPrice: number;
  changePercent?: number;
  volume?: number;
  rsiValue: number;
  matchesCriteria: boolean;
  rsiBelowThreshold: boolean;
  macdBullishCross: boolean;
  belowLowerBollingerBand: boolean;
  goldenCross: boolean;
  latestTimestamp: number;
}
