import { StockDetailTab } from '@/components/features/stock-detail/StockDetailTab';
import { useTechnicalAnalysis } from '@/hooks/useTechnicalAnalysis';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export default function StockDetailPage() {
  const { t } = useTranslation();
  const { symbol } = useParams<{ symbol?: string }>();
  const { selectSymbol } = useTechnicalAnalysis();

  useEffect(() => {
    if (symbol) {
      selectSymbol(symbol);
    }
  }, [symbol, selectSymbol]);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-2">
        {t('navigation.stockDetail')}
      </h1>
      <p className="text-muted-foreground max-w-[600px] mb-6">
        {symbol
          ? t('stockDetail.symbolView', { symbol })
          : t('stockDetail.noSymbol')}
      </p>
      <StockDetailTab />
    </div>
  );
}
