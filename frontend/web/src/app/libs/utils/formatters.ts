/**
 * Splits a transaction ID into its components
 * @param id The transaction ID to split
 * @returns The first part of the transaction ID
 */
export function splitTransactionId(id: string): string {
  return id.split('-')[0];
}

/**
 * Formats a date as a short date string
 * @param date The date to format
 * @returns The formatted date string
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats a date as a full date string
 * @param date The date to format
 * @returns The formatted date string
 */
export function formatFullDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}

/**
 * Formats a number as currency
 * @param amount The amount to format
 * @param currency The currency code (e.g., 'USD', 'EUR')
 * @param fractionDigits The number of decimal places to show (default: 2)
 * @param showSymbol Whether to show the currency symbol (default: false)
 * @param narrow Whether to use the narrow symbol (default: true)
 * @returns The formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: Intl.NumberFormatOptions['currency'],
  fractionDigits: number = 2,
  showSymbol: boolean = false,
  narrow: boolean = true,
): string {
  return new Intl.NumberFormat('en-US', {
    currency: currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
    style: showSymbol ? 'currency' : 'decimal',
    currencyDisplay: narrow ? 'narrowSymbol' : 'code',
  }).format(amount);
}

/**
 * Capitalizes the first letter of a string
 * @param string The string to capitalize
 * @returns The capitalized string
 */
export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Denormalizes a category name from a normalized name
 * - Replaces underscores and hyphens with spaces
 * - Capitalizes the first letter of each word
 *
 * @param normalizedName The normalized category name
 * @returns The denormalized category name
 */
export function denormalizeCategoryName(normalizedName: string): string {
  return normalizedName
    .replace(/[_-]/g, ' ') // underscores & hyphens → spaces
    .split(' ')
    .filter(Boolean) // remove empty strings (safety)
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ');
}
