import { ExposeEnumDto } from '@common/types';

/**
 * Formats a string value into an ExposeEnumDto with a capitalized label
 * @param enumValue - The string value to format
 * @returns An ExposeEnumDto with the value and a capitalized label
 */
export function formatEnumForFrontend(enumValue: string): ExposeEnumDto {
    return {
        value: enumValue,
        label: enumValue.charAt(0).toUpperCase() + enumValue.slice(1).toLowerCase(),
    };
}

/**
 * Normalizes an array of category strings by:
 * - Trimming whitespace
 * - Converting to lowercase
 * - Replacing non-alphanumeric characters (except spaces and hyphens) with underscores
 * - Replacing spaces with underscores
 * - Removing empty strings
 * - Removing duplicates
 *
 * @param categories - Array of category strings to normalize
 * @returns Array of normalized category strings
 */
export function normalizeCategories(categories: string[]): string[] {
    return Array.from(
        new Set(
            categories
                .map(
                    c =>
                        c
                            .trim()
                            .toLowerCase()
                            .replace(/[^a-z\s-]/g, '') // allow letters, spaces, hyphens
                            .replace(/\s+/g, '_'), // spaces → underscores
                )
                .filter(c => c.length > 0), // remove empty results
        ),
    );
}

/**
 * Normalizes a category name by:
 * - Trimming whitespace
 * - Converting to lowercase
 * - Replacing non-alphanumeric characters (except spaces and hyphens) with underscores
 * - Replacing spaces with underscores
 *
 * @param categoryName - The category name to normalize
 * @returns The normalized category name
 */
export function normalizeCategoryName(categoryName: string): string {
    return categoryName
        .trim()
        .toLowerCase()
        .replace(/[^a-z\s-]/g, '') // allow letters, spaces, hyphens
        .replace(/\s+/g, '_'); // spaces → underscores
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
