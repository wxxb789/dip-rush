// src/components/charts/StockChart.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { StockChartProps } from '@/types/ui';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  BarElement,
  CategoryScale,
  type ChartData,
  Chart as ChartJS,
  type ChartOptions,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  type TooltipItem,
} from 'chart.js';
import type React from 'react';
import { useRef, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StockChart: React.FC<StockChartProps> = ({
  data,
  timeframe,
  height = 400,
  width,
  onTimeframeChange,
  onIndicatorToggle,
}) => {
  const { t } = useTranslation();
  const chartRef = useRef<ChartJS>(null);
  const [activeTab, setActiveTab] = useState<string>('price');
  const [activeIndicators, setActiveIndicators] = useState<string[]>([]);

  // Available timeframes
  const timeframes = [
    { value: 'D', label: `1 ${t('chart.day')}` },
    { value: 'W', label: `1 ${t('chart.week')}` },
    { value: 'M', label: `1 ${t('chart.month')}` },
  ];

  // Get dates for x-axis
  const dates = data.candles.timestamp.map((ts) => formatDate(ts));

  // Generate chart data
  const chartData: ChartData<'line' | 'bar'> = {
    labels: dates,
    datasets:
      activeTab === 'rsi'
        ? [
            {
              type: 'line' as const,
              label: t('chart.rsi'),
              data: data.indicators.rsi || [],
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
              borderWidth: 1.5,
              pointRadius: 0,
              pointHoverRadius: 3,
            },
            {
              type: 'line' as const,
              label: t('chart.overbought'),
              data: Array(dates.length).fill(70), // Overbought line
              borderColor: 'rgba(255, 99, 132, 0.5)',
              borderDash: [5, 5],
              tension: 0,
              borderWidth: 1,
              pointRadius: 0,
            },
            {
              type: 'line' as const,
              label: t('chart.oversold'),
              data: Array(dates.length).fill(30), // Oversold line
              borderColor: 'rgba(54, 162, 235, 0.5)',
              borderDash: [5, 5],
              tension: 0,
              borderWidth: 1,
              pointRadius: 0,
            },
          ]
        : activeTab === 'volume'
          ? [
              {
                type: 'bar' as const,
                label: t('chart.volume'),
                data: data.candles.volume,
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
              },
            ]
          : [
              {
                type: 'line' as const,
                label: t('chart.close'),
                data: data.candles.close,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                borderWidth: 1.5,
                pointRadius: 0,
                pointHoverRadius: 3,
              },
            ],
  };

  // Chart options
  const chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'line' | 'bar'>) => {
            const label = tooltipItem.dataset.label || '';
            const value = tooltipItem.parsed.y;

            if (activeTab === 'price') {
              return `${label}: ${formatCurrency(value, 'USD')}`;
            }
            if (activeTab === 'volume') {
              return `${label}: ${value.toLocaleString()}`;
            }
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(200, 200, 200, 0.1)',
        },
        ...(activeTab === 'rsi' && {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,
          },
        }),
      },
      ...(activeTab === 'rsi' && {
        y2: {
          display: false, // Hide secondary y-axis but keep it for potential future use
        },
      }),
    },
  };

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe: string) => {
    if (onTimeframeChange) {
      onTimeframeChange(newTimeframe);
    }
  };

  // Handle indicator toggle
  const handleIndicatorToggle = (indicator: string) => {
    let updatedIndicators: string[];

    if (activeIndicators.includes(indicator)) {
      updatedIndicators = activeIndicators.filter((item) => item !== indicator);
    } else {
      updatedIndicators = [...activeIndicators, indicator];
    }

    setActiveIndicators(updatedIndicators);

    if (onIndicatorToggle) {
      onIndicatorToggle(indicator);
    }
  };

  // Calculate price change and percent for display
  const lastPrice = data.candles.close[data.candles.close.length - 1];
  const previousPrice =
    data.candles.close[data.candles.close.length - 2] || lastPrice;
  const priceChange = lastPrice - previousPrice;
  const priceChangePercent = (priceChange / previousPrice) * 100;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col space-y-4 pb-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center">
              <CardTitle className="text-xl font-bold mr-2">
                {data.symbol}
              </CardTitle>
              {data.profile?.name && (
                <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                  {data.profile.name}
                </span>
              )}
            </div>
            <div className="flex items-baseline mt-1">
              <span className="text-2xl font-bold mr-2">
                {formatCurrency(lastPrice, 'USD')}
              </span>
              <Badge
                className={priceChange >= 0 ? 'bg-green-500' : 'bg-red-500'}
              >
                {priceChange >= 0 ? '+' : ''}
                {formatCurrency(priceChange, 'USD')} (
                {priceChange >= 0 ? '+' : ''}
                {priceChangePercent.toFixed(2)}%)
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Timeframe selectors */}
            <div className="flex items-center space-x-1">
              {timeframes.map((tf) => (
                <Button
                  key={tf.value}
                  variant={timeframe === tf.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTimeframeChange(tf.value)}
                >
                  {tf.label}
                </Button>
              ))}
            </div>

            {/* Indicator toggles */}
            <div className="flex items-center space-x-1">
              {['rsi', 'macd', 'bollinger'].map((indicator) => (
                <Button
                  key={indicator}
                  variant={
                    activeIndicators.includes(indicator) ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => handleIndicatorToggle(indicator)}
                >
                  {indicator.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
            <TabsTrigger value="price">{t('chart.price')}</TabsTrigger>
            <TabsTrigger value="volume">{t('chart.volume')}</TabsTrigger>
            <TabsTrigger value="rsi">{t('chart.rsi')}</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="pt-4">
        <div style={{ height: height, width: width || '100%' }}>
          <Chart
            type="line"
            ref={chartRef}
            data={chartData}
            options={chartOptions}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StockChart;
