import { FieldTree } from '@angular/forms/signals';

/**
 * Extracts the current value from an Angular signal-form field tree.
 *
 * Passing the root field tree returns the full form payload. Passing a child
 * field tree returns that individual field's value.
 */
export function extractValueFromInputField<T>(field: FieldTree<T>): T {
    return field().value();
}
