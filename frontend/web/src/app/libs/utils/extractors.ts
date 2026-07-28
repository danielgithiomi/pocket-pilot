import { FieldTree } from '@angular/forms/signals';

export function extractValueFromInputField<T>(field: FieldTree<string, string | number>): T {

    const fieldValue = (field: FieldTree<string, string | number>) => field().value();

    return {} as T;
}
