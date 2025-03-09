import { useStockDetail } from '@/hooks/useStockDetail';
import { useTechnicalAnalysis } from '@/hooks/useTechnicalAnalysis';
import { StockChartSection } from './StockChartSection';
import { StockSearch } from './StockSearch';

export function StockDetailTab() {
  const { isLoading } = useTechnicalAnalysis();
  const {
    selectedSymbol,
    searchSymbol,
    setSearchSymbol,
    selectedIndicators,
    selectedTimeframe,
    setSelectedTimeframe,
    handleStockSearch,
    handleIndicatorToggle,
  } = useStockDetail();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {/* Stock Search */}
        <StockSearch
          searchSymbol={searchSymbol}
          onSearchSymbolChange={setSearchSymbol}
          onSearch={handleStockSearch}
          isLoading={isLoading}
        />

        {/* Stock Chart */}
        <StockChartSection
          selectedSymbol={selectedSymbol}
          selectedIndicators={selectedIndicators}
          timeframe={selectedTimeframe}
          onTimeframeChange={setSelectedTimeframe}
          onIndicatorToggle={handleIndicatorToggle}
        />
      </div>
    </div>
  );
}
