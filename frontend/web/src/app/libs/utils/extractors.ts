import { FieldTree } from '@angular/forms/signals';
import { MONTHS_ENUM } from '@shared/constants';

/**
 * Extracts the current value from an Angular signal-form field tree.
 *
 * Passing the root field tree returns the full form payload. Passing a child
 * field tree returns that individual field's value.
 */
export function extractValueFromInputField<T>(field: FieldTree<T>): T {
    return field().value();
}

/**
 * Extract the string value of the month using the month index from the enum
 *
 * @param monthIndex The index of the month you want to get the value of (zero-index)
 * @returns monthName The name of the month retrieved from the enum
 */
export function getMonthValue(monthIndex: number = new Date().getMonth()): string {
    return MONTHS_ENUM[monthIndex].value;
}
