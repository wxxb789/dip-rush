import { useTechnicalAnalysis } from '@/hooks/useTechnicalAnalysis';
import type { ScreeningCriteria } from '@/types/screening';
import { useState } from 'react';

export function useScreener() {
  const {
    screeningResults,
    criteria,
    isLoading,
    error,
    runScreening,
    selectSymbol,
  } = useTechnicalAnalysis();

  // Custom screening criteria state
  const [customCriteria, setCustomCriteria] = useState<ScreeningCriteria>({
    rsiThreshold: criteria.rsiThreshold,
    rsiEnabled: true,
    macdSignalCrossoverEnabled: criteria.macdSignalCrossoverEnabled,
    bollingerBandTouchEnabled: criteria.bollingerBandTouchEnabled,
    goldenCrossEnabled: criteria.goldenCrossEnabled,
  });

  // Update individual criteria
  const updateCriteria = (
    key: keyof ScreeningCriteria,
    value: boolean | number
  ) => {
    setCustomCriteria((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle running the screener with current criteria
  const handleRunScreener = () => {
    const updatedCriteria = {
      ...customCriteria,
    };

    runScreening(updatedCriteria);
  };

  return {
    screeningResults,
    customCriteria,
    isLoading,
    error,
    updateCriteria,
    handleRunScreener,
    selectSymbol,
  };
}
