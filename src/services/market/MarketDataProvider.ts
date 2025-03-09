import type { CandleData, Quote } from '@/types/api';

export interface MarketDataProvider {
  getQuote(symbol: string): Promise<Quote>;
  getCandles(
    symbol: string,
    resolution: string,
    from: number,
    to: number
  ): Promise<CandleData>;
}
