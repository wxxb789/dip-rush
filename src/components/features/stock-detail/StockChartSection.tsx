import StockChart from '@/components/charts/StockChart';
import { Card } from '@/components/ui/card';
import type { StockData } from '@/types/indicators';
import type { TimeframeType } from '@/types/stock';
import { PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StockChartSectionProps {
  selectedSymbol: StockData | null;
  selectedIndicators: string[];
  timeframe: TimeframeType;
  onTimeframeChange: (timeframe: TimeframeType) => void;
  onIndicatorToggle: (indicator: string) => void;
}

export function StockChartSection({
  selectedSymbol,
  selectedIndicators,
  timeframe,
  onTimeframeChange,
  onIndicatorToggle,
}: StockChartSectionProps) {
  const { t } = useTranslation();

  if (!selectedSymbol) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center text-center h-[300px] space-y-4">
          <PlusCircle className="h-12 w-12 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-medium">
              {t('stockDetail.noStockSelected')}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {t('stockDetail.selectStock')}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <StockChart
      data={selectedSymbol}
      selectedIndicators={selectedIndicators}
      timeframe={timeframe as string}
      onTimeframeChange={(newTimeframe: string) =>
        onTimeframeChange(newTimeframe as TimeframeType)
      }
      onIndicatorToggle={onIndicatorToggle}
      height={500}
    />
  );
}
