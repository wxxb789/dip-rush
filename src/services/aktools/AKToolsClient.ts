import { getAssetBySymbol } from '@/constants/defaultAssets';
import type { MarketDataProvider } from '@/services/market/MarketDataProvider';
import type {
  AKToolsHistoricalResponse,
  AKToolsUSStockParams,
  CandleData,
  Quote,
} from '@/types/api';
import axios from 'axios';

const formatDate = (date: number): string => {
  const d = new Date(date * 1000);
  return d.toISOString().split('T')[0].replace(/-/g, '');
};

const validateUSStockParams = (params: AKToolsUSStockParams): void => {
  if (!params.symbol) {
    throw new Error('Symbol is required');
  }
  if (!params.symbol.includes('.')) {
    throw new Error('Symbol must include market code (e.g., "107.SPY")');
  }
  if (params.period !== 'daily') {
    throw new Error('Only daily period is supported');
  }
  if (!/^\d{8}$/.test(params.start_date)) {
    throw new Error('start_date must be in YYYYMMDD format');
  }
  if (!/^\d{8}$/.test(params.end_date)) {
    throw new Error('end_date must be in YYYYMMDD format');
  }
  if (params.adjust !== 'qfq') {
    throw new Error('Only qfq (forward adjusted) is supported');
  }
};

class AKToolsClient implements MarketDataProvider {
  private baseUrl = '/aktools';

  // Helper to get proper market code formatted symbol
  private getUSStockSymbol(symbol: string): string {
    const asset = getAssetBySymbol(symbol);
    if (!asset?.stock_us_spot_em) {
      throw new Error(`No stock_us_spot_em found for symbol: ${symbol}`);
    }
    return asset.stock_us_spot_em;
  }

  async getQuote(symbol: string): Promise<Quote> {
    // Get today's date and yesterday's date
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const params: AKToolsUSStockParams = {
      symbol: this.getUSStockSymbol(symbol),
      period: 'daily',
      start_date: formatDate(yesterday.getTime() / 1000),
      end_date: formatDate(today.getTime() / 1000),
      adjust: 'qfq',
    };

    validateUSStockParams(params);
    const response = await axios.get(`${this.baseUrl}/stock_us_hist`, {
      params,
    });
    const data = response.data[response.data.length - 1];
    return this.adaptQuote(data);
  }

  async getCandles(
    symbol: string,
    _resolution: string,
    from: number,
    to: number
  ): Promise<CandleData> {
    const params: AKToolsUSStockParams = {
      symbol: this.getUSStockSymbol(symbol),
      period: 'daily',
      start_date: formatDate(from),
      end_date: formatDate(to),
      adjust: 'qfq',
    };

    validateUSStockParams(params);

    const response = await axios.get(`${this.baseUrl}/stock_us_hist`, {
      params,
    });
    return this.adaptCandles(response.data);
  }

  async fetchBatch<T>(
    symbols: string[],
    processor: (symbol: string) => Promise<T>,
    batchSize = 5,
    delayMs = 1000
  ): Promise<T[]> {
    const results = [];
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      const batchPromises = batch.map(processor);
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      if (i + batchSize < symbols.length) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
    return results;
  }

  private adaptQuote(data: AKToolsHistoricalResponse): Quote {
    return {
      c: data.close,
      d: data.change_amount,
      dp: data.change_percent,
      h: data.high,
      l: data.low,
      o: data.open,
      pc: data.close - data.change_amount,
    };
  }

  private adaptCandles(data: AKToolsHistoricalResponse[]): CandleData {
    return {
      c: data.map((d) => d.close),
      h: data.map((d) => d.high),
      l: data.map((d) => d.low),
      o: data.map((d) => d.open),
      s: 'ok', // Assuming status is always 'ok'
      t: data.map((d) => new Date(d.date).getTime() / 1000), // Convert to Unix timestamp
      v: data.map((d) => d.volume),
    };
  }
}

export default new AKToolsClient();
