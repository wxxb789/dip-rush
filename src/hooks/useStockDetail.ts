import { useTechnicalAnalysis } from '@/hooks/useTechnicalAnalysis';
import type { TimeframeType } from '@/types/stock';
import { useState } from 'react';

export function useStockDetail() {
  const { selectedSymbol, fetchStockData, selectSymbol, isLoading } =
    useTechnicalAnalysis();

  // For the stock search functionality
  const [searchSymbol, setSearchSymbol] = useState<string>('');
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([
    'rsi',
    'macd',
  ]);
  const [selectedTimeframe, setSelectedTimeframe] =
    useState<TimeframeType>('D');

  // Handle stock search
  const handleStockSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchSymbol) {
      return;
    }

    const symbol = searchSymbol.toUpperCase();
    await fetchStockData(symbol, selectedTimeframe);
    selectSymbol(symbol);
  };

  // Handle indicator toggle
  const handleIndicatorToggle = (indicator: string) => {
    setSelectedIndicators((prev) => {
      if (prev.includes(indicator)) {
        return prev.filter((i) => i !== indicator);
      }
      return [...prev, indicator];
    });
  };

  return {
    selectedSymbol,
    searchSymbol,
    setSearchSymbol,
    selectedIndicators,
    selectedTimeframe,
    setSelectedTimeframe,
    handleStockSearch,
    handleIndicatorToggle,
    isLoading,
  };
}
