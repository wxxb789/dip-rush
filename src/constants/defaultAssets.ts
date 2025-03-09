// Asset type definitions
export type AssetType = 'ETF' | 'STOCK' | 'INDEX';

export interface Asset {
  symbol: string;
  stock_us_spot_em: string;
  name: string;
  type: AssetType;
}

export const DEFAULT_ASSETS: Asset[] = [
  {
    symbol: 'SPY',
    stock_us_spot_em: '107.SPY',
    name: 'SPDR S&P 500 ETF Trust',
    type: 'ETF',
  },
  {
    symbol: 'QQQ',
    stock_us_spot_em: '105.QQQ',
    name: 'Invesco QQQ Trust',
    type: 'ETF',
  },
  {
    symbol: 'GOOGL',
    stock_us_spot_em: '105.GOOGL',
    name: 'Alphabet Inc.',
    type: 'STOCK',
  },
  {
    symbol: 'XLE',
    stock_us_spot_em: '107.XLE',
    name: 'Energy Select Sector SPDR Fund',
    type: 'ETF',
  },
];

// Helper functions
export const getDefaultSymbols = (): string[] => {
  return DEFAULT_ASSETS.map((asset) => asset.symbol);
};

export const getAssetBySymbol = (symbol: string): Asset | undefined => {
  return DEFAULT_ASSETS.find((asset) => asset.symbol === symbol);
};
