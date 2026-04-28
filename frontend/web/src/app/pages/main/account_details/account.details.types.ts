import { UpdateAccountPayload } from '@global/types';
import { minLength, required, schema, validate } from '@angular/forms/signals';

export type UpdateAccountDetailsSchema = UpdateAccountPayload;

export const UpdateAccountValidationSchema = schema<UpdateAccountDetailsSchema>((root) => {
  // Account name
  required(root.name, { message: 'The account name is required field!' });
  minLength(root.name, 3, { message: 'The account name must be at least 3 characters long!' });

  // Account type
  validate(root.type, (context) => {
    const type = context.value();
    if (!type || type.trim() === '') {
      return {
        kind: 'type-required',
        message: 'The account type is required field!',
      };
    }
    return null;
  });

  // Account currency
  required(root.currency, { message: 'The account currency is required field!' });
});
