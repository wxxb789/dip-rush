import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import type { ScreeningCriteria as ScreeningCriteriaType } from '@/types/screening';
import { useTranslation } from 'react-i18next';

interface ScreeningCriteriaProps {
  criteria: ScreeningCriteriaType;
  isLoading: boolean;
  onCriteriaChange: (
    key: keyof ScreeningCriteriaType,
    value: number | boolean
  ) => void;
  onRunScreener: () => void;
}

export function ScreeningCriteria({
  criteria,
  isLoading,
  onCriteriaChange,
  onRunScreener,
}: ScreeningCriteriaProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('screener.screeningCriteria')}</CardTitle>
        <CardDescription>{t('screener.title')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* RSI Threshold */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="rsi-threshold">{t('screener.rsiThreshold')}</Label>
            <span className="text-sm font-medium">{criteria.rsiThreshold}</span>
          </div>
          <Slider
            id="rsi-threshold"
            min={0}
            max={100}
            step={1}
            value={[criteria.rsiThreshold]}
            onValueChange={(value) =>
              onCriteriaChange('rsiThreshold', value[0])
            }
          />
        </div>

        {/* MACD Crossover */}
        <div className="flex items-center space-x-2">
          <Switch
            id="macd-crossover"
            checked={criteria.macdSignalCrossoverEnabled}
            onCheckedChange={(checked) =>
              onCriteriaChange('macdSignalCrossoverEnabled', checked)
            }
          />
          <Label htmlFor="macd-crossover">{t('screener.macdCrossover')}</Label>
        </div>

        {/* Bollinger Band Touch */}
        <div className="flex items-center space-x-2">
          <Switch
            id="bollinger-touch"
            checked={criteria.bollingerBandTouchEnabled}
            onCheckedChange={(checked) =>
              onCriteriaChange('bollingerBandTouchEnabled', checked)
            }
          />
          <Label htmlFor="bollinger-touch">
            {t('screener.bollingerBandTouch')}
          </Label>
        </div>

        {/* Golden Cross */}
        <div className="flex items-center space-x-2">
          <Switch
            id="golden-cross"
            checked={criteria.goldenCrossEnabled}
            onCheckedChange={(checked) =>
              onCriteriaChange('goldenCrossEnabled', checked)
            }
          />
          <Label htmlFor="golden-cross">{t('screener.goldenCross')}</Label>
        </div>

        <Button onClick={onRunScreener} className="w-full" disabled={isLoading}>
          {isLoading ? t('screener.running') : t('screener.runScreener')}
        </Button>
      </CardContent>
    </Card>
  );
}
