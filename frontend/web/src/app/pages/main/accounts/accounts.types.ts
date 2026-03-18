import { CreateAccountRequest, AccountType } from '@global/types';
import { minLength, required, schema, validate } from '@angular/forms/signals';

export type AccountsSchema = CreateAccountRequest;

export const initialAccountsFormState: AccountsSchema = {
  name: '',
  type: '',
};

export const accountsFormValidationSchema = schema<AccountsSchema>((root) => {
  required(root.name, { message: 'The account name is required field!' });
  minLength(root.name, 3, { message: 'The account name must be at least 3 characters long!' });

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
});
