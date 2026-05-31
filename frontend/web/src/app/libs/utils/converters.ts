/**
 * Converts a given number of days into a human-readable string
 * representing years and months.
 *
 * Examples:
 *   convertDaysToYearsAndMonths(15)    => "15 days"
 *   convertDaysToYearsAndMonths(60)    => "2 months"
 *   convertDaysToYearsAndMonths(400)   => "1 yrs 1 months"
 *
 * - For inputs less than 30 days, returns the number of days.
 * - For inputs between 30 and 364, returns the number of months (approx.).
 * - For 365 and above, returns the number of years and remaining months.
 *
 * @param days - Number of days to convert
 * @returns A formatted string in days, months, or years & months
 */
export function convertDaysToYearsAndMonths(days: number): string {
    if (days < 30) return `${days} days`;

    if (days < 365) {
        const months = Math.floor(days / 30);
        return `${months} months`;
    }

    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    return `${years} yrs ${months} months`;
}

/**
 * Generates a deterministic positive integer hash code from a given string.
 *
 * Intended for fast non-cryptographic use, such as generating color palettes or
 * distributing items evenly based on name. The hash is computed by multiplying
 * the current hash by 31 and adding the character code for each letter,
 * modulo 2^32.
 *
 * Example:
 *   hashFromName("Alice") => 2022895601
 *
 * @param value - The input string to hash (e.g., a name)
 * @returns Unsigned integer hash code
 */
export function hashFromName(value: string): number {
    let h = 0;
    for (let i = 0; i < value.length; i++) {
        h = (h * 31 + value.charCodeAt(i)) >>> 0;
    }
    return h;
}
