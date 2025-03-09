import type { Resolution } from '@/types/api';
// src/services/analyticsService.ts
import type {
  BollingerBandsParams,
  BollingerBandsResult,
  DipDetectionResult,
  MACDParams,
  MACDResult,
  RSIParams,
  ScreeningCriteria,
  StockData,
} from '@/types/indicators';
import {
  calculateBollingerBands,
  calculateMACD,
  calculateMovingAverage,
  calculateRSI,
} from '@/utils/indicators';
import akToolsClient from './aktools/AKToolsClient';

class AnalyticsService {
  // Cache for indicator calculations
  private calculationsCache = new Map<
    string,
    { data: any; timestamp: number }
  >();
  private readonly CACHE_TTL: number = 5 * 60 * 1000; // 5 minutes in milliseconds

  /**
   * Get data from cache or calculate it using the provided function
   */
  private async getOrCalculate<T>(
    cacheKey: string,
    calculationFn: () => Promise<T>
  ): Promise<T | null> {
    // Check cache first
    const cached = this.calculationsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T;
    }

    try {
      const result = await calculationFn();

      // Cache the result
      if (result !== null) {
        this.calculationsCache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
        });
      }

      return result;
    } catch (error) {
      console.error(`Failed to calculate for ${cacheKey}:`, error);
      return null;
    }
  }

  /**
   * Calculate RSI preferring client-side calculation to reduce API calls
   */
  async getRSI(
    symbol: string,
    resolution: Resolution,
    from: number,
    to: number,
    params: RSIParams
  ): Promise<number[] | null> {
    const cacheKey = `rsi:${symbol}:${resolution}:${from}:${to}:${params.timeperiod}`;

    return this.getOrCalculate(cacheKey, async () => {
      try {
        // Get candle data (only one API call)
        const candlesResponse = await akToolsClient.getCandles(
          symbol,
          resolution,
          from,
          to
        );
        const prices = candlesResponse.c;
        return calculateRSI(prices, params.timeperiod);
      } catch (error) {
        console.error('Failed to calculate RSI:', error);
        return null;
      }
    });
  }

  /**
   * Calculate MACD preferring client-side calculation to reduce API calls
   */
  async getMACD(
    symbol: string,
    resolution: Resolution,
    from: number,
    to: number,
    params: MACDParams
  ): Promise<MACDResult | null> {
    const cacheKey = `macd:${symbol}:${resolution}:${from}:${to}:${params.fastperiod}:${params.slowperiod}:${params.signalperiod}`;

    return this.getOrCalculate(cacheKey, async () => {
      try {
        // Get candle data (only one API call)
        const candlesResponse = await akToolsClient.getCandles(
          symbol,
          resolution,
          from,
          to
        );
        const prices = candlesResponse.c;
        return calculateMACD(
          prices,
          params.fastperiod,
          params.slowperiod,
          params.signalperiod
        );
      } catch (error) {
        console.error('Failed to calculate MACD:', error);
        return null;
      }
    });
  }

  /**
   * Calculate Bollinger Bands preferring client-side calculation to reduce API calls
   */
  async getBollingerBands(
    symbol: string,
    resolution: Resolution,
    from: number,
    to: number,
    params: BollingerBandsParams
  ): Promise<BollingerBandsResult | null> {
    const cacheKey = `bbands:${symbol}:${resolution}:${from}:${to}:${params.timeperiod}:${params.nbdevup}`;

    return this.getOrCalculate(cacheKey, async () => {
      try {
        // Get candle data (only one API call)
        const candlesResponse = await akToolsClient.getCandles(
          symbol,
          resolution,
          from,
          to
        );
        const prices = candlesResponse.c;
        return calculateBollingerBands(
          prices,
          params.timeperiod,
          params.nbdevup
        );
      } catch (error) {
        console.error('Failed to calculate Bollinger Bands:', error);
        return null;
      }
    });
  }

  /**
   * Calculate Moving Average preferring client-side calculation to reduce API calls
   */
  async getMovingAverage(
    symbol: string,
    resolution: Resolution,
    from: number,
    to: number,
    period: number
  ): Promise<number[] | null> {
    const cacheKey = `ma:${symbol}:${resolution}:${from}:${to}:${period}`;

    return this.getOrCalculate(cacheKey, async () => {
      try {
        // Get candle data (only one API call)
        const candlesResponse = await akToolsClient.getCandles(
          symbol,
          resolution,
          from,
          to
        );
        const prices = candlesResponse.c;
        return calculateMovingAverage(prices, period);
      } catch (error) {
        console.error(
          `Failed to calculate ${period}-day Moving Average:`,
          error
        );
        return null;
      }
    });
  }

  /**
   * Calculate all indicators for a stock in one operation to minimize API calls
   * @param stockData The stock data with candles
   */
  async calculateAllIndicators(stockData: StockData): Promise<StockData> {
    if (
      !stockData.candles ||
      !stockData.candles.close ||
      stockData.candles.close.length === 0
    ) {
      return stockData;
    }

    const prices = stockData.candles.close;
    const updatedData = {
      ...stockData,
      indicators: { ...stockData.indicators },
    };

    // Calculate RSI
    const rsi = calculateRSI(prices, 14);
    if (rsi) {
      updatedData.indicators.rsi = rsi;
    }

    // Calculate MACD
    const macd = calculateMACD(prices, 12, 26, 9);
    if (macd) {
      updatedData.indicators.macd = macd;
    }

    // Calculate Bollinger Bands
    const bbands = calculateBollingerBands(prices, 20, 2);
    if (bbands) {
      updatedData.indicators.bollingerBands = bbands;
    }

    // Calculate Moving Averages
    const ma50 = calculateMovingAverage(prices, 50);
    if (ma50) {
      updatedData.indicators.ma50 = ma50;
    }

    const ma200 = calculateMovingAverage(prices, 200);
    if (ma200) {
      updatedData.indicators.ma200 = ma200;
    }

    return updatedData;
  }

  /**
   * Detect if the stock meets the dip criteria
   */
  detectDips(
    stockData: StockData,
    criteria: ScreeningCriteria
  ): DipDetectionResult {
    const result: DipDetectionResult = {
      symbol: stockData.symbol,
      name: stockData.profile?.name,
      matchesCriteria: false,
      rsiBelowThreshold: false,
      macdBullishCross: false,
      belowLowerBollingerBand: false,
      goldenCross: false,
      currentPrice: stockData.candles.close[stockData.candles.close.length - 1],
      rsiValue: stockData.indicators.rsi
        ? stockData.indicators.rsi[stockData.indicators.rsi.length - 1]
        : 50,
      latestTimestamp:
        stockData.candles.timestamp[stockData.candles.timestamp.length - 1],
      industry: stockData.profile?.industry,
    };

    console.info(`[DEBUG] Evaluating dip detection for ${stockData.symbol}:`, {
      criteria,
      indicators: stockData.indicators,
    });

    // Check RSI criterion
    if (stockData.indicators.rsi) {
      const latestRsi =
        stockData.indicators.rsi[stockData.indicators.rsi.length - 1];
      result.rsiBelowThreshold = latestRsi < criteria.rsiThreshold;
    }

    // Check MACD bullish crossover
    if (stockData.indicators.macd) {
      const macd = stockData.indicators.macd;
      const length = macd.macd.length;
      // A bullish crossover happens when the MACD line crosses above the signal line
      // while both are below zero
      if (length >= 2) {
        const prevMacd = macd.macd[length - 2];
        const prevSignal = macd.signal[length - 2];
        const currMacd = macd.macd[length - 1];
        const currSignal = macd.signal[length - 1];

        result.macdBullishCross =
          prevMacd < prevSignal &&
          currMacd > currSignal &&
          currMacd < 0 &&
          currSignal < 0;
      }
    }

    // Check Bollinger Bands criterion
    if (stockData.indicators.bollingerBands) {
      const bb = stockData.indicators.bollingerBands;
      const length = bb.lower.length;
      const prices = stockData.candles.close;

      // Price crosses below lower Bollinger Band
      if (length >= 2 && prices.length >= 2) {
        const prevPrice = prices[prices.length - 2];
        const prevLowerBand = bb.lower[length - 2];
        const currPrice = prices[prices.length - 1];
        const currLowerBand = bb.lower[length - 1];

        result.belowLowerBollingerBand =
          prevPrice >= prevLowerBand && currPrice < currLowerBand;
      }
    }

    // Check Golden Cross criterion
    if (stockData.indicators.ma50 && stockData.indicators.ma200) {
      const ma50 = stockData.indicators.ma50;
      const ma200 = stockData.indicators.ma200;

      const length50 = ma50.length;
      const length200 = ma200.length;

      // A Golden Cross occurs when the 50-day MA crosses above the 200-day MA
      if (length50 >= 2 && length200 >= 2) {
        const prevMa50 = ma50[length50 - 2];
        const prevMa200 = ma200[length200 - 2];
        const currMa50 = ma50[length50 - 1];
        const currMa200 = ma200[length200 - 1];

        result.goldenCross = prevMa50 <= prevMa200 && currMa50 > currMa200;
      }
    }

    // Determine if the stock matches all criteria
    result.matchesCriteria =
      (!criteria.rsiEnabled || result.rsiBelowThreshold) &&
      (!criteria.macdSignalCrossoverEnabled || result.macdBullishCross) &&
      (!criteria.bollingerBandTouchEnabled || result.belowLowerBollingerBand) &&
      (!criteria.goldenCrossEnabled || result.goldenCross);

    console.info(`[DEBUG] ${stockData.symbol} criteria evaluation:`, {
      rsi: {
        enabled: criteria.rsiEnabled,
        threshold: criteria.rsiThreshold,
        value: stockData.indicators.rsi?.[stockData.indicators.rsi.length - 1],
        meets: result.rsiBelowThreshold,
      },
      matches: result.matchesCriteria,
    });

    // Add detailed evaluation logging
    console.info(`[DEBUG] ${stockData.symbol} detailed criteria:`, {
      rsi: `${criteria.rsiEnabled ? 'ON' : 'OFF'} - Value: ${result.rsiValue.toFixed(2)} (< ${criteria.rsiThreshold})`,
      macd: `${criteria.macdSignalCrossoverEnabled ? 'ON' : 'OFF'} - ${result.macdBullishCross ? 'Crossed' : 'No Cross'}`,
      boll: `${criteria.bollingerBandTouchEnabled ? 'ON' : 'OFF'} - ${result.belowLowerBollingerBand ? 'Below' : 'Above'}`,
      golden: `${criteria.goldenCrossEnabled ? 'ON' : 'OFF'} - ${result.goldenCross ? 'Crossed' : 'No Cross'}`,
    });

    return result;
  }
}

// Create a singleton instance
const analyticsService = new AnalyticsService();
export default analyticsService;
