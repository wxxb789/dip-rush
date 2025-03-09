import { ScreenerTab } from '@/components/features/screener/ScreenerTab';
import { useTechnicalAnalysis } from '@/hooks/useTechnicalAnalysis';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function ScreenerPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectSymbol } = useTechnicalAnalysis();

  const handleSelectSymbol = (symbol: string) => {
    selectSymbol(symbol);
    // Navigate to stock detail page with the selected symbol
    navigate(`/stock-detail/${symbol}`);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-2">
        {t('navigation.screener')}
      </h1>
      <p className="text-muted-foreground max-w-[600px] mb-6">
        {t('app.description')}
      </p>
      <ScreenerTab
        onSelectSymbol={handleSelectSymbol}
        onSwitchToDetail={() => {}} // Not needed anymore as we use navigation
      />
    </div>
  );
}
