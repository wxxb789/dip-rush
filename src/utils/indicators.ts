// src/utils/indicators.ts
import type { BollingerBandsResult, MACDResult } from '@/types/indicators';

/**
 * Calculate Simple Moving Average (SMA)
 * @param prices Array of prices
 * @param period Moving average period
 * @returns Array of moving average values
 */
export const calculateMovingAverage = (
  prices: number[],
  period: number
): number[] => {
  if (!prices || prices.length < period) {
    return [];
  }

  const result: number[] = [];

  for (let i = period - 1; i < prices.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += prices[i - j];
    }
    result.push(sum / period);
  }

  // Pad the beginning with NaN to match the input array length
  const padding = Array(period - 1).fill(Number.NaN);
  return [...padding, ...result];
};

/**
 * Calculate Relative Strength Index (RSI)
 * @param prices Array of prices
 * @param period RSI period (typically 14)
 * @returns Array of RSI values
 */
export const calculateRSI = (prices: number[], period: number): number[] => {
  if (!prices || prices.length <= period) {
    return [];
  }

  // Calculate price changes
  const changes: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  const gains: number[] = changes.map((change) => (change > 0 ? change : 0));
  const losses: number[] = changes.map((change) => (change < 0 ? -change : 0));

  // Calculate initial average gain and loss
  let avgGain =
    gains.slice(0, period).reduce((sum, gain) => sum + gain, 0) / period;
  let avgLoss =
    losses.slice(0, period).reduce((sum, loss) => sum + loss, 0) / period;

  const rsiValues: number[] = [];

  // First RSI value
  let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  let rsi = 100 - 100 / (1 + rs);
  rsiValues.push(rsi);

  // Calculate remaining RSI values using smoothed averages
  for (let i = period; i < changes.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;

    rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi = 100 - 100 / (1 + rs);
    rsiValues.push(rsi);
  }

  // Pad the beginning with NaN to match the input array length
  const padding = Array(period).fill(Number.NaN);
  return [...padding, ...rsiValues];
};

/**
 * Calculate Moving Average Convergence Divergence (MACD)
 * @param prices Array of prices
 * @param fastPeriod Fast EMA period (typically 12)
 * @param slowPeriod Slow EMA period (typically 26)
 * @param signalPeriod Signal line period (typically 9)
 * @returns MACD result object with macd, signal, and histogram arrays
 */
export const calculateMACD = (
  prices: number[],
  fastPeriod: number,
  slowPeriod: number,
  signalPeriod: number
): MACDResult => {
  // Calculate EMAs
  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);

  // Calculate MACD line
  const macdLine: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (Number.isNaN(fastEMA[i]) || Number.isNaN(slowEMA[i])) {
      macdLine.push(Number.NaN);
    } else {
      macdLine.push(fastEMA[i] - slowEMA[i]);
    }
  }

  // Calculate signal line (EMA of MACD line)
  const validMacdStart = macdLine.findIndex((value) => !Number.isNaN(value));
  const validMacdValues = macdLine.slice(validMacdStart);
  const signalLinePartial = calculateEMA(validMacdValues, signalPeriod);

  // Pad signal line with NaN to match the original array length
  const signalPadding = Array(validMacdStart + signalPeriod - 1).fill(
    Number.NaN
  );
  const signalLine = [
    ...signalPadding,
    ...signalLinePartial.slice(signalPeriod - 1),
  ];

  // Calculate histogram (MACD line - signal line)
  const histogram: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (Number.isNaN(macdLine[i]) || Number.isNaN(signalLine[i])) {
      histogram.push(Number.NaN);
    } else {
      histogram.push(macdLine[i] - signalLine[i]);
    }
  }

  return {
    macd: macdLine,
    signal: signalLine,
    histogram: histogram,
  };
};

/**
 * Calculate Exponential Moving Average (EMA)
 * @param prices Array of prices
 * @param period EMA period
 * @returns Array of EMA values
 */
export const calculateEMA = (prices: number[], period: number): number[] => {
  if (!prices || prices.length < period) {
    return Array(prices.length).fill(Number.NaN);
  }

  const k = 2 / (period + 1);
  const emaValues: number[] = Array(prices.length).fill(Number.NaN);

  // Initialize EMA with SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += prices[i];
  }
  emaValues[period - 1] = sum / period;

  // Calculate EMA for the rest of the values
  for (let i = period; i < prices.length; i++) {
    emaValues[i] = prices[i] * k + emaValues[i - 1] * (1 - k);
  }

  return emaValues;
};

/**
 * Calculate Bollinger Bands
 * @param prices Array of prices
 * @param period Bollinger Bands period (typically 20)
 * @param stdDev Standard deviation multiplier (typically 2)
 * @returns Bollinger Bands result object with upper, middle, and lower bands
 */
export const calculateBollingerBands = (
  prices: number[],
  period: number,
  stdDev: number
): BollingerBandsResult => {
  if (!prices || prices.length < period) {
    return {
      upper: Array(prices.length).fill(Number.NaN),
      middle: Array(prices.length).fill(Number.NaN),
      lower: Array(prices.length).fill(Number.NaN),
    };
  }

  // Calculate middle band (SMA)
  const middle = calculateMovingAverage(prices, period);

  const upper: number[] = [];
  const lower: number[] = [];

  // Calculate standard deviation and bands
  for (let i = 0; i < prices.length; i++) {
    if (Number.isNaN(middle[i])) {
      upper.push(Number.NaN);
      lower.push(Number.NaN);
      continue;
    }

    // Calculate standard deviation using the middle band
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      if (j >= 0) {
        sum += (prices[j] - middle[i]) ** 2;
      }
    }
    const standardDeviation = Math.sqrt(sum / period);

    upper.push(middle[i] + standardDeviation * stdDev);
    lower.push(middle[i] - standardDeviation * stdDev);
  }

  return {
    upper,
    middle,
    lower,
  };
};

/**
 * Detect golden cross (50-day MA crossing above 200-day MA)
 * @param ma50 50-day moving average array
 * @param ma200 200-day moving average array
 * @returns Boolean indicating if a golden cross has occurred
 */
export const detectGoldenCross = (ma50: number[], ma200: number[]): boolean => {
  if (!ma50 || !ma200 || ma50.length < 2 || ma200.length < 2) {
    return false;
  }

  const length = Math.min(ma50.length, ma200.length);

  // Check for golden cross (50-day MA crosses above 200-day MA)
  return (
    ma50[length - 2] <= ma200[length - 2] &&
    ma50[length - 1] > ma200[length - 1]
  );
};

/**
 * Detect death cross (50-day MA crossing below 200-day MA)
 * @param ma50 50-day moving average array
 * @param ma200 200-day moving average array
 * @returns Boolean indicating if a death cross has occurred
 */
export const detectDeathCross = (ma50: number[], ma200: number[]): boolean => {
  if (!ma50 || !ma200 || ma50.length < 2 || ma200.length < 2) {
    return false;
  }

  const length = Math.min(ma50.length, ma200.length);

  // Check for death cross (50-day MA crosses below 200-day MA)
  return (
    ma50[length - 2] >= ma200[length - 2] &&
    ma50[length - 1] < ma200[length - 1]
  );
};
