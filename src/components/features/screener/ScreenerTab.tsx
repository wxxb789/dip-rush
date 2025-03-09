import { useScreener } from '@/hooks/useScreener';
import { ScreeningCriteria } from './ScreeningCriteria';
import { ScreeningResults } from './ScreeningResults';

interface ScreenerTabProps {
  onSelectSymbol: (symbol: string) => void;
  onSwitchToDetail: () => void;
}

export function ScreenerTab({
  onSelectSymbol,
  onSwitchToDetail,
}: ScreenerTabProps) {
  const {
    screeningResults,
    customCriteria,
    isLoading,
    error,
    updateCriteria,
    handleRunScreener,
    selectSymbol,
  } = useScreener();

  // Handle row click in the results table
  const handleResultRowClick = (symbol: string) => {
    selectSymbol(symbol);
    onSelectSymbol(symbol);
    onSwitchToDetail();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Screening Criteria Card */}
        <div className="lg:col-span-1">
          <ScreeningCriteria
            criteria={customCriteria}
            isLoading={isLoading}
            onCriteriaChange={updateCriteria}
            onRunScreener={handleRunScreener}
          />
        </div>

        {/* Results Table */}
        <div className="lg:col-span-2">
          <ScreeningResults
            results={screeningResults}
            isLoading={isLoading}
            error={error}
            onRetry={handleRunScreener}
            onRowClick={handleResultRowClick}
          />
        </div>
      </div>
    </div>
  );
}
