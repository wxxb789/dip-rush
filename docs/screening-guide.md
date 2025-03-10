# Stock Screening System Technical Guide

## Overview

The stock screening system uses multiple technical indicators to identify potential buying opportunities. Here's a detailed breakdown of how each component works.

## Screening Criteria

The system uses four main criteria for screening stocks:

```typescript
{
  rsiThreshold: 30,        // Default RSI threshold
  rsiEnabled: true,        // RSI screening enabled
  macdSignalCrossoverEnabled: true,     // MACD crossover screening
  bollingerBandTouchEnabled: true,      // Bollinger Band touch screening
  goldenCrossEnabled: true,             // Golden Cross screening
}
```

### Default Parameters

- RSI Threshold: 30 (Oversold condition)
- MACD: 12-day EMA vs 26-day EMA with 9-day signal line
- Bollinger Bands: 20-day period with 2 standard deviations
- Moving Averages: 50-day and 200-day for Golden Cross

## Technical Indicators Explained

### 1. RSI (Relative Strength Index)

RSI measures the speed and magnitude of recent price changes to evaluate oversold or overbought conditions.

**Calculation:**
1. Calculate price changes
2. Separate gains and losses
3. Calculate average gain and loss over the period (typically 14 days)
4. RSI = 100 - (100 / (1 + RS))
   where RS = Average Gain / Average Loss

**Interpretation:**
- RSI < 30: Potentially oversold (buying opportunity)
- RSI > 70: Potentially overbought (selling opportunity)

### 2. MACD (Moving Average Convergence Divergence)

MACD identifies trend changes and momentum by comparing two moving averages.

**Calculation:**
1. Fast EMA (12-day) - Slow EMA (26-day) = MACD Line
2. 9-day EMA of MACD Line = Signal Line
3. MACD Line - Signal Line = Histogram

**Bullish Signal:**
- MACD line crosses above signal line while both are below zero
- Indicates potential trend reversal

### 3. Bollinger Bands

Bollinger Bands measure volatility and relative price levels using standard deviations.

**Calculation:**
1. Middle Band = 20-day SMA
2. Upper Band = Middle Band + (2 × Standard Deviation)
3. Lower Band = Middle Band - (2 × Standard Deviation)

**Signal:**
- Price crossing below lower band indicates potential oversold condition

### 4. Golden Cross

A long-term bullish signal using moving average crossovers.

**Calculation:**
- Compare 50-day MA with 200-day MA
- Golden Cross occurs when 50-day MA crosses above 200-day MA

## Adjusting Parameters for Better Results

If you're getting "No matching stocks found", try these adjustments:

1. **Relax RSI Criteria:**
   - Default threshold: 30
   - Try increasing to 35-40 for more matches
   - Consider disabling if too restrictive

2. **MACD Flexibility:**
   - Default: Requires bullish crossover below zero
   - Consider disabling if too restrictive
   - Most flexible of the indicators

3. **Bollinger Bands:**
   - Default: Price below lower band
   - Look for touches rather than crosses
   - Consider disabling during high volatility

4. **Golden Cross:**
   - Most restrictive long-term signal
   - Consider disabling for short-term trades
   - Best used in combination with other indicators

### Recommended Parameter Combinations

1. **Conservative Screening:**
   ```typescript
   {
     rsiThreshold: 30,
     rsiEnabled: true,
     macdSignalCrossoverEnabled: true,
     bollingerBandTouchEnabled: false,
     goldenCrossEnabled: false
   }
   ```

2. **Moderate Screening:**
   ```typescript
   {
     rsiThreshold: 35,
     rsiEnabled: true,
     macdSignalCrossoverEnabled: true,
     bollingerBandTouchEnabled: true,
     goldenCrossEnabled: false
   }
   ```

3. **Aggressive Screening:**
   ```typescript
   {
     rsiThreshold: 40,
     rsiEnabled: true,
     macdSignalCrossoverEnabled: true,
     bollingerBandTouchEnabled: true,
     goldenCrossEnabled: true
   }
   ```

## Tips for Optimal Results

1. Start with fewer criteria and gradually add more as needed
2. Monitor market conditions - different parameters work better in different markets
3. Use RSI as your primary filter and add others for confirmation
4. Consider market volatility when using Bollinger Bands
5. Use Golden Cross for long-term position trading only