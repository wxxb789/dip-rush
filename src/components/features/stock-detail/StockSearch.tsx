import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StockSearchProps {
  searchSymbol: string;
  onSearchSymbolChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function StockSearch({
  searchSymbol,
  onSearchSymbolChange,
  onSearch,
  isLoading,
}: StockSearchProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={onSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('stockDetail.searchPlaceholder')}
              value={searchSymbol}
              onChange={(e) => onSearchSymbolChange(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button type="submit" disabled={isLoading || !searchSymbol}>
            {t('stockDetail.search')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
