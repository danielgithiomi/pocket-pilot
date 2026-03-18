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
