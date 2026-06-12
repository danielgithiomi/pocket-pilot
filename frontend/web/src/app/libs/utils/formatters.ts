/**
 * Extracts the primary identifier from a transaction ID string.
 * The transaction ID is assumed to be composed of multiple sections separated by dashes.
 * Returns the first section before the dash, representing the main ID.
 *
 * @param id The full transaction ID (e.g., "txn-1234-5678")
 * @returns The primary identifier before any dashes (e.g., "txn")
 */
export function splitTransactionId(id: string): string {
    return id.split('-')[0];
}

/**
 * Converts a date string into a concise, human-readable date format.
 * Example output: "May 10, 2024".
 *
 * @param date A valid date string (e.g. "2024-05-10T09:00Z")
 * @returns The formatted date as a short string (e.g. "May 10, 2024")
 */
export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Converts a date string into a detailed, human-friendly format with the weekday.
 * Example output: "Fri, May 10, 2024".
 *
 * @param date A date string to format (e.g. "2024-05-10T09:00Z")
 * @returns The formatted date as a verbose string (e.g. "Fri, May 10, 2024")
 */
export function formatFullDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short'
    });
}

/**
 * Returns a new Date object with a given number of months added to the input date.
 *
 * @param date The base Date.
 * @param months The number of months to add (can be negative).
 * @returns A new Date instance after adding the specified months.
 */
export function addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}

/**
 * Returns a new Date object representing one month after the given date.
 *
 * @param date The starting Date.
 * @returns A new Date instance one month after the supplied date.
 */
export function addOneMonthFromDate(date: Date): Date {
    return addMonths(date, 1);
}

/**
 * Calculates the number of full months between two Date objects.
 * The difference is positive if the 'end' date is after the 'start' date.
 *
 * @param start The starting Date.
 * @param end The ending Date.
 * @returns The difference in months as an integer.
 */
export function getMonthDifference(start: Date, end: Date): number {
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();

    return years * 12 + months;
}

/**
 * Formats a date string for input field display using a short, consistent style.
 * Example output: "May 10, 2024".
 *
 * @param date The date string to format (e.g. "2024-05-10T09:00Z")
 * @returns The formatted string suitable for input fields.
 */
export function formatInputFieldDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Formats a numeric amount as currency, allowing control over symbol display and decimal places.
 * Example output: "15.99" or "$15.99" depending on showSymbol parameter.
 *
 * @param amount The numeric value to format.
 * @param currency The ISO 4217 currency code (e.g., "USD", "EUR").
 * @param fractionDigits Number of decimal places to display. Defaults to 2.
 * @param showSymbol If true, displays the currency symbol (e.g., "$"); if false, no symbol. Defaults to false.
 * @param narrow If true, uses the narrow currency symbol if available; otherwise uses the full code. Defaults to true.
 * @returns The formatted currency string.
 */
export function formatCurrency(
    amount: number,
    currency: Intl.NumberFormatOptions['currency'],
    fractionDigits: number = 2,
    showSymbol: boolean = false,
    narrow: boolean = true
): string {
    return new Intl.NumberFormat('en-US', {
        currency: currency,
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
        style: showSymbol ? 'currency' : 'decimal',
        currencyDisplay: narrow ? 'narrowSymbol' : 'code'
    }).format(amount);
}

/**
 * Capitalizes the first character of a string, leaving the rest unchanged.
 * For example, "hello" becomes "Hello".
 *
 * @param string The input string.
 * @returns The string with only its first character capitalized.
 */
export function capitalize(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Converts a normalized string (e.g. snake_case or kebab-case) into a human-readable label.
 * - Replaces underscores and hyphens with spaces
 * - Capitalizes the first letter of each word
 * Example: "fast_food-delivery" -> "Fast Food Delivery"
 *
 * @param normalizedName The normalized input (e.g. "grocery-store_list")
 * @returns The denormalized, readable string (e.g. "Grocery Store List")
 */
export function formatToReadable(normalizedName: string): string {
    return normalizedName
        .replace(/[_-]/g, ' ') // underscores & hyphens → spaces
        .split(' ')
        .filter(Boolean) // remove empty strings (safety)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
