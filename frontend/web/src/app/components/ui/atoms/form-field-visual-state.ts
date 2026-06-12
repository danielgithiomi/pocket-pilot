export type FormFieldVisualState = 'neutral' | 'error';

export const FORM_FIELD_ERROR_BORDER_CLASSES =
    'border-[2px]! border-solid! border-error! focus:border-primary! focus:outline-none!';

export function isFormFieldInError(field: { invalid: () => boolean; touched: () => boolean }): boolean {
    return field.invalid() && field.touched();
}

export function resolveFormFieldVisualState(
    showStatus: boolean,
    field: { invalid: () => boolean; touched: () => boolean }
): FormFieldVisualState {
    if (!showStatus || !isFormFieldInError(field)) return 'neutral';
    return 'error';
}
