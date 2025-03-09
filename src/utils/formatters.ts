// src/utils/formatters.ts
/**
 * Format a number as currency
 */
export const formatCurrency = (
  value: number,
  currency = 'USD',
  locale = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
};

/**
 * Format a number with commas
 */
export const formatNumber = (
  value: number,
  decimals = 0,
  locale = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format a number as percentage
 */
export const formatPercent = (
  value: number,
  decimals = 2,
  locale = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

/**
 * Format a date
 */
export const formatDate = (
  timestamp: number | Date,
  locale = 'en-US'
): string => {
  const date =
    timestamp instanceof Date ? timestamp : new Date(timestamp * 1000);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a date with time
 */
export const formatDateTime = (
  timestamp: number | Date,
  locale = 'en-US'
): string => {
  const date =
    timestamp instanceof Date ? timestamp : new Date(timestamp * 1000);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format large numbers in a human-readable way (K, M, B)
 */
export const formatCompactNumber = (
  value: number,
  locale = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Format a duration in seconds to a human-readable string
 */
export const formatDuration = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) {
    parts.push(`${days}d`);
  }
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (remainingSeconds > 0 && parts.length === 0) {
    parts.push(`${remainingSeconds}s`);
  }

  return parts.join(' ');
};

/**
 * Format relative time (e.g., "5 minutes ago")
 */
export const formatRelativeTime = (
  timestamp: number | Date,
  locale = 'en-US'
): string => {
  const now = new Date();
  const date =
    timestamp instanceof Date ? timestamp : new Date(timestamp * 1000);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (seconds < 60) {
    return rtf.format(-Math.floor(seconds), 'second');
  }

  const minutes = seconds / 60;
  if (minutes < 60) {
    return rtf.format(-Math.floor(minutes), 'minute');
  }

  const hours = minutes / 60;
  if (hours < 24) {
    return rtf.format(-Math.floor(hours), 'hour');
  }

  const days = hours / 24;
  if (days < 30) {
    return rtf.format(-Math.floor(days), 'day');
  }

  const months = days / 30;
  if (months < 12) {
    return rtf.format(-Math.floor(months), 'month');
  }

  const years = days / 365;
  return rtf.format(-Math.floor(years), 'year');
};
