# DIP Rush

A real-time stock market analysis tool built with React, TypeScript, and Vite that helps identify potential buying opportunities using technical analysis.

## Features

- Real-time stock data via AKTools integration
- Technical analysis indicators
- Batch processing for efficient data fetching
- Interactive charts and visualizations
- Customizable screening criteria

## Setup

1. **Install Dependencies**

```shell
pnpm i
```

2. **Start Development Server**

```shell
pnpm run dev
```

3. **Build for Production**

```shell
pnpm run build
```

## Technical Details

### Data Provider

The application uses AKTools (https://aktools.550w.xyz) as its market data provider with the following endpoints:

- Stock Daily Data: `/api/public/stock_zh_a_daily`
- Historical Data: `/api/public/stock_zh_a_hist`
- Company Information: `/api/public/company_profile`

### API Interface

The market data provider interface is designed to be provider-agnostic:

```typescript
interface MarketDataProvider {
  getQuote(symbol: string): Promise<Quote>;
  getCandles(symbol: string, resolution: string, from: number, to: number): Promise<CandleData>;
  getCompanyProfile(symbol: string): Promise<CompanyProfile>;
}
```

### Rate Limiting

The AKTools service has a rate limit of 50 requests per second. The application includes built-in rate limiting and batch processing to handle this efficiently.

## Project Structure

- `/src/services/market` - Market data provider interface
- `/src/services/aktools` - AKTools client implementation
- `/src/components/charts` - Chart components
- `/src/hooks` - Custom React hooks
- `/src/types` - TypeScript type definitions
- `/src/utils` - Utility functions

## UI Components

All UI components are based on shadcn/ui and can be found under `@/components/ui`.

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Submit a pull request

## License

MIT
