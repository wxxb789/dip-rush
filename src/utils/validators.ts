// src/utils/validators.ts
/**
 * Validate a symbol string
 * @param symbol Stock ticker symbol
 * @returns True if the symbol is valid
 */
export const isValidSymbol = (symbol: string): boolean => {
  // Basic stock symbol validation (1-5 uppercase letters)
  return /^[A-Z]{1,5}$/.test(symbol);
};

/**
 * Interface defining stock screening criteria
 */
export interface ScreeningCriteria {
  rsiThreshold: number;
  macdSignalCrossover: boolean;
  bollingerBandTouch: boolean;
  goldenCross: boolean;
}

/**
 * Validate a stock screening criteria object
 * @param criteria The screening criteria object
 * @returns Boolean indicating if criteria is valid
 */
export const isValidScreeningCriteria = (
  criteria: ScreeningCriteria | unknown
): boolean => {
  if (!criteria || typeof criteria !== 'object') {
    return false;
  }

  // Cast to ScreeningCriteria to check properties
  const c = criteria as Partial<ScreeningCriteria>;

  // Check for required fields with appropriate types
  if (
    typeof c.rsiThreshold !== 'number' ||
    c.rsiThreshold < 0 ||
    c.rsiThreshold > 100
  ) {
    return false;
  }

  if (typeof c.macdSignalCrossover !== 'boolean') {
    return false;
  }

  if (typeof c.bollingerBandTouch !== 'boolean') {
    return false;
  }

  if (typeof c.goldenCross !== 'boolean') {
    return false;
  }

  return true;
};

/**
 * Validate email address format
 * @param email Email address to validate
 * @returns True if email format is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 * @param url URL to validate
 * @returns True if URL format is valid
 */
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Ensure a number is within specified range
 * @param value Number to check
 * @param min Minimum acceptable value
 * @param max Maximum acceptable value
 * @returns Number clamped to the specified range
 */
export const clampValue = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Validate timeframe for chart display
 * @param timeframe Timeframe string
 * @param allowedValues Array of allowed timeframe values
 * @returns True if timeframe is valid
 */
export const isValidTimeframe = (
  timeframe: string,
  allowedValues: string[] = ['1', '5', '15', '30', '60', 'D', 'W', 'M']
): boolean => {
  return allowedValues.includes(timeframe);
};

/**
 * Sanitize input string to prevent XSS
 * @param input String to sanitize
 * @returns Sanitized string
 */
export const sanitizeString = (input: string): string => {
  if (!input) {
    return '';
  }

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
