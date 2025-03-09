import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ScreenerResult } from '@/types/indicators';
import type { ResultsTableProps } from '@/types/ui';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { ArrowUpDown, ChevronDown, ChevronUp, Search } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ResultsTable: React.FC<ResultsTableProps> = ({
  data,
  loading,
  onRowClick,
}) => {
  const { t } = useTranslation();
  const [sortField, setSortField] = useState<keyof ScreenerResult>('rsiValue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  // Sort and filter data
  const sortedData = [...data]
    .sort((a, b) => {
      if (a[sortField] === undefined || b[sortField] === undefined) {
        return 0;
      }

      if (
        sortField === 'symbol' ||
        sortField === 'name' ||
        sortField === 'industry'
      ) {
        const valueA = String(a[sortField] || '').toLowerCase();
        const valueB = String(b[sortField] || '').toLowerCase();
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      const valueA = Number(a[sortField] || 0);
      const valueB = Number(b[sortField] || 0);
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    })
    .filter((item) => {
      if (!searchTerm) {
        return true;
      }

      const searchLower = searchTerm.toLowerCase();
      return (
        item.symbol?.toLowerCase().includes(searchLower) ||
        item.name?.toLowerCase().includes(searchLower) ||
        item.industry?.toLowerCase().includes(searchLower)
      );
    });

  // Toggle sort order
  const toggleSort = (field: keyof ScreenerResult) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Render sort icon
  const SortIcon = ({ field }: { field: keyof ScreenerResult }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-4 w-4" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  // Render indicator badges
  const renderIndicatorBadges = (result: ScreenerResult) => {
    return (
      <div className="flex flex-wrap gap-1">
        {result.rsiBelowThreshold && (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          >
            {t('table.rsiLow')}
          </Badge>
        )}
        {result.macdBullishCross && (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          >
            {t('table.macdCross')}
          </Badge>
        )}
        {result.belowLowerBollingerBand && (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            {t('table.bollingerTouch')}
          </Badge>
        )}
        {result.goldenCross && (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
          >
            {t('table.goldenCross')}
          </Badge>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="text-lg text-muted-foreground">{t('table.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('table.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 max-w-sm"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {t('table.sortBy')} <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('table.sortBy')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toggleSort('symbol')}>
              {t('table.symbol')}
              <SortIcon field="symbol" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleSort('rsiValue')}>
              {t('table.rsi')}
              <SortIcon field="rsiValue" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleSort('currentPrice')}>
              {t('table.price')}
              <SortIcon field="currentPrice" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleSort('changePercent')}>
              {t('table.change')}
              <SortIcon field="changePercent" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {sortedData.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer w-[100px]"
                  onClick={() => toggleSort('symbol')}
                >
                  {t('table.symbol')}
                  <SortIcon field="symbol" />
                </TableHead>
                <TableHead className="min-w-[200px]">
                  {t('table.name')}
                </TableHead>
                <TableHead
                  className="cursor-pointer text-right"
                  onClick={() => toggleSort('currentPrice')}
                >
                  {t('table.price')}
                  <SortIcon field="currentPrice" />
                </TableHead>
                <TableHead
                  className="cursor-pointer text-right"
                  onClick={() => toggleSort('changePercent')}
                >
                  {t('table.change')}
                  <SortIcon field="changePercent" />
                </TableHead>
                <TableHead
                  className="cursor-pointer text-right"
                  onClick={() => toggleSort('rsiValue')}
                >
                  {t('table.rsi')}
                  <SortIcon field="rsiValue" />
                </TableHead>
                <TableHead>{t('table.indicators')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((result) => (
                <TableRow
                  key={result.symbol}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onRowClick(result.symbol)}
                >
                  <TableCell className="font-medium">{result.symbol}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{result.name || '-'}</div>
                      <div className="text-xs text-muted-foreground">
                        {result.industry || '-'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(result.currentPrice, 'USD')}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        result.changePercent && result.changePercent > 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }
                    >
                      {result.changePercent
                        ? `${result.changePercent > 0 ? '+' : ''}${formatPercent(result.changePercent)}`
                        : '-'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        result.rsiValue < 30
                          ? 'text-red-600 dark:text-red-400'
                          : result.rsiValue > 70
                            ? 'text-green-600 dark:text-green-400'
                            : ''
                      }
                    >
                      {result.rsiValue.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell>{renderIndicatorBadges(result)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-md border border-dashed p-8 text-center">
          <div className="text-muted-foreground">{t('table.noResults')}</div>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        {sortedData.length} {t('table.matches')}
      </div>
    </div>
  );
};

export default ResultsTable;
