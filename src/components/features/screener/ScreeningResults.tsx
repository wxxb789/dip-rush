import ResultsTable from '@/components/tables/ResultsTable';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ScreeningResult } from '@/types/screening';
import { AlertCircle, LineChart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ScreeningResultsProps {
  results: ScreeningResult[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onRowClick: (symbol: string) => void;
}

export function ScreeningResults({
  results,
  isLoading,
  error,
  onRetry,
  onRowClick,
}: ScreeningResultsProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <LineChart className="mr-2 h-5 w-5" />
          {t('screener.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('errors.errorOccurred')}</AlertTitle>
            <AlertDescription>
              {error}
              <Button
                variant="link"
                onClick={onRetry}
                className="p-0 ml-2 h-auto"
              >
                {t('errors.tryAgain')}
              </Button>
            </AlertDescription>
          </Alert>
        ) : results.length === 0 && !isLoading ? (
          <div className="text-center p-6">
            <p className="text-muted-foreground">
              {t('screener.noResultsFound')}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[600px] pr-4">
            <ResultsTable
              data={results}
              loading={isLoading}
              onRowClick={onRowClick}
            />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
