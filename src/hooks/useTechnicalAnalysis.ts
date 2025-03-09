import AKToolsClient from '@/services/aktools/AKToolsClient';
import analyticsService from '@/services/analyticsService';
import type { Resolution } from '@/types/api';
import type {
  ScreenerResult,
  ScreeningCriteria,
  StockData,
} from '@/types/indicators';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

// Default screening criteria
const DEFAULT_CRITERIA: ScreeningCriteria = {
  rsiThreshold: 30,
  rsiEnabled: true,
  macdSignalCrossoverEnabled: true,
  bollingerBandTouchEnabled: true,
  goldenCrossEnabled: true,
};

// Default timeframes in seconds (1 day, 50 days, 200 days)
const DAY_IN_SECONDS = 86400;
const DEFAULT_TIMEFRAME = {
  short: DAY_IN_SECONDS * 30, // 30 days
  medium: DAY_IN_SECONDS * 100, // ~3 months (for 50-day MA)
  long: DAY_IN_SECONDS * 400, // ~1+ year (for 200-day MA)
};

// Cache TTL in milliseconds (24 hours)
const CACHE_TTL = 24 * 60 * 60 * 1000;

export const useTechnicalAnalysis = () => {
  const [stockData, setStockData] = useState<Map<string, StockData>>(new Map());
  const [screeningResults, setScreeningResults] = useState<ScreenerResult[]>(
    []
  );
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Add a ref to track if we've already run the initial screening
  const initialScreeningRun = useRef<boolean>(false);

  // Store screening criteria in local storage
  const [criteria, setCriteria] = useLocalStorage<ScreeningCriteria>(
    'diprush-screening-criteria',
    DEFAULT_CRITERIA
  );

  // Store default symbols to screen in local storage
  const [defaultSymbols, setDefaultSymbols] = useLocalStorage<string[]>(
    'diprush-default-symbols',
    []
  );

  // Cache expiration map to track when data was last fetched
  const cacheExpirationRef = useRef<Map<string, number>>(new Map());

  // Helper function to extract error message, memoized to prevent recreation
  const getErrorMessage = useCallback((error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }, []);

  // Fetch stock data for a single symbol with optimized API usage
  const fetchStockData = useCallback(
    async (
      symbol: string,
      resolution: Resolution = 'D'
    ): Promise<StockData | undefined> => {
      setIsLoading(true);
      setError(null);

      try {
        // Calculate timestamps
        const now = Math.floor(Date.now() / 1000);
        const longTimeAgo = now - DEFAULT_TIMEFRAME.long;

        // Check cache first for this symbol
        const cachedData = stockData.get(symbol);
        const cachedTimestamp = cacheExpirationRef.current.get(symbol);
        const currentTime = Date.now();

        if (
          cachedData &&
          cachedTimestamp &&
          currentTime - cachedTimestamp < CACHE_TTL
        ) {
          // Use cached data if it's still valid
          setIsLoading(false);
          return cachedData;
        }

        // Get candle data - this is our primary API call
        const candleData = await AKToolsClient.getCandles(
          symbol,
          resolution,
          longTimeAgo,
          now
        );

        // Transform candle data to our format
        const data: StockData = {
          symbol,
          candles: {
            open: candleData.o,
            high: candleData.h,
            low: candleData.l,
            close: candleData.c,
            volume: candleData.v,
            timestamp: candleData.t,
          },
          indicators: {},
        };

        // Calculate all technical indicators locally instead of making multiple API calls
        const enhancedData =
          await analyticsService.calculateAllIndicators(data);

        // Update stock data map and cache expiration
        setStockData((prevMap) => {
          const newMap = new Map(prevMap);
          newMap.set(symbol, enhancedData);
          return newMap;
        });
        cacheExpirationRef.current.set(symbol, Date.now());

        return enhancedData;
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        console.error(`Error fetching data for ${symbol}:`, err);
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [stockData, getErrorMessage]
  );

  // Use the predefined list of target stocks
  const fetchDefaultSymbols = useCallback(async (): Promise<string[]> => {
    if (defaultSymbols.length > 0) {
      return defaultSymbols;
    }

    try {
      // Import the DEFAULT_ASSETS directly from constants
      const { getDefaultSymbols } = await import('@/constants/defaultAssets');
      const targetSymbols = getDefaultSymbols();

      setDefaultSymbols(targetSymbols);
      return targetSymbols;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error('Error loading default symbols:', err);
      return [];
    }
  }, [defaultSymbols, setDefaultSymbols, getErrorMessage]);

  // Run the stock screener with optimized batching
  const runScreening = useCallback(
    async (customCriteria?: ScreeningCriteria): Promise<void> => {
      setIsLoading(true);
      setError(null);

      const screeningCriteria = customCriteria || criteria;

      try {
        // Get symbols to screen
        const symbols = await fetchDefaultSymbols();

        if (symbols.length === 0) {
          throw new Error('No symbols available for screening');
        }

        console.info(`Screening ${symbols.length} target stocks...`);

        // First fetch all necessary stock data in bulk to reduce API calls
        const missingSymbols = [];

        // Check which symbols need data fetching vs which can use cache
        for (const symbol of symbols) {
          const cachedTimestamp = cacheExpirationRef.current.get(symbol);
          const currentTime = Date.now();

          if (
            !stockData.has(symbol) ||
            !cachedTimestamp ||
            currentTime - cachedTimestamp >= CACHE_TTL
          ) {
            missingSymbols.push(symbol);
          }
        }

        if (missingSymbols.length > 0) {
          // Fetch data for missing symbols in a single batch
          await AKToolsClient.fetchBatch(
            missingSymbols,
            async (symbol) => {
              const data = await fetchStockData(symbol);
              return data;
            },
            5, // Batch size of 5
            1000 // 1 second delay between batches
          );
        }

        // Now process the criteria locally without additional API calls
        const results: ScreenerResult[] = [];

        for (const symbol of symbols) {
          const data = stockData.get(symbol);
          if (!data) {
            continue;
          }

          // Apply screening criteria locally
          const dipResult = analyticsService.detectDips(
            data,
            screeningCriteria
          );

          if (dipResult.matchesCriteria) {
            results.push({
              ...dipResult,
              changePercent: 0, // Placeholder, will be updated below
            });
          }
        }

        // If we have matching results, fetch quotes in a single batch
        if (results.length > 0) {
          const matchingSymbols = results.map((result) => result.symbol);

          // Fetch all quotes in a single batch to minimize API calls
          await AKToolsClient.fetchBatch(
            matchingSymbols,
            async (symbol) => {
              try {
                const quote = await AKToolsClient.getQuote(symbol);
                // Update the matching result with quote data
                const resultIndex = results.findIndex(
                  (r) => r.symbol === symbol
                );
                if (resultIndex >= 0) {
                  results[resultIndex].changePercent = quote.dp;
                }
                return quote;
              } catch (error) {
                console.warn(`Failed to fetch quote for ${symbol}:`, error);
                return null;
              }
            },
            5, // Batch size
            1000 // Delay
          );
        }

        setScreeningResults(results);

        // If custom criteria was provided, update the stored criteria
        if (customCriteria) {
          setCriteria(customCriteria);
        }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        console.error('Error running screening:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [
      criteria,
      fetchDefaultSymbols,
      fetchStockData,
      stockData,
      setCriteria,
      getErrorMessage,
    ]
  );

  // Select a symbol for detailed view
  const selectSymbol = useCallback(
    (symbol: string) => {
      setSelectedSymbol(symbol);

      // Fetch data for the symbol if we don't have it yet or if the cache is expired
      const cachedTimestamp = cacheExpirationRef.current.get(symbol);
      const currentTime = Date.now();

      if (
        !stockData.has(symbol) ||
        !cachedTimestamp ||
        currentTime - cachedTimestamp >= CACHE_TTL
      ) {
        fetchStockData(symbol);
      }
    },
    [fetchStockData, stockData]
  );

  // Initialize by fetching default symbols
  useEffect(() => {
    if (defaultSymbols.length === 0) {
      fetchDefaultSymbols();
    }
  }, [defaultSymbols, fetchDefaultSymbols]);

  // Run initial screening once
  useEffect(() => {
    if (!initialScreeningRun.current && !isLoading) {
      initialScreeningRun.current = true;
      runScreening();
    }
  }, [isLoading, runScreening]);

  return {
    stockData,
    screeningResults,
    selectedSymbol: selectedSymbol
      ? stockData.get(selectedSymbol) || null
      : null,
    criteria,
    isLoading,
    error,
    runScreening,
    selectSymbol,
    fetchStockData,
    setCriteria,
  };
};
