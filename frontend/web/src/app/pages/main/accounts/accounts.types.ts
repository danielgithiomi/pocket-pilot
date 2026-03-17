import { minLength, required, schema } from '@angular/forms/signals';
import { CreateAccountRequest } from '@global/types';

export type AccountsSchema = CreateAccountRequest;

export const initialAccountsFormState: AccountsSchema = {
  name: '',
};

export const accountsFormValidationSchema = schema<AccountsSchema>((root) => {
  required(root.name, { message: 'The account name is required field!' });
  minLength(root.name, 3, { message: 'The account name must be at least 3 characters long!' });
});
