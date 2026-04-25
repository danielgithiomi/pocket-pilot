import { Input } from '@atoms/input';
import { Form } from '@organisms/form';
import { Select } from '@atoms/select';
import { Button } from '@atoms/button';
import { form } from '@angular/forms/signals';
import { CURRENCIES } from '@global/constants';
import { Account as IAccount } from '@global/types';
import { AccountsService } from '@api/accounts.service';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { UpdateAccountDetailsSchema, UpdateAccountValidationSchema } from './account.details.types';

@Component({
  selector: 'edit-account-details-form',
  imports: [Form, Input, Select, Button],
  template: `
    <organism-form
      id="accounts"
      title="Add Account"
      [class.hidden]="!isEditFormOpen()"
      description="Create a new account"
      (closeForm)="onEditFormClose.emit()"
    >
      @let types = accountTypes.value()?.data;
      <form slot="content" id="accounts-form" (submit)="submitEditAccountForm($event)">
        <atom-input
          id="name"
          type="text"
          [inverted]="true"
          autocomplete="name"
          label="Account Name"
          placeholder="Eg: Expenditure"
          [formField]="editAccountForm.name"
          (clearOutput)="editAccountForm.name().controlValue.set('')"
        />

        <div class="flex flex-col sm:flex-row gap-4">
          <atom-select
            class="flex-1"
            id="account-type"
            [inverted]="true"
            label="Account Type"
            wrapperClassName="my-0"
            placeholder="Select a type"
            [formField]="editAccountForm.type"
            [options]="types || [{ value: '', label: 'No account types found' }]"
          />

          <atom-select
            class="flex-1"
            [inverted]="true"
            id="account-currency"
            [options]="currencies"
            wrapperClassName="my-0"
            label="Account Currency"
            placeholder="Select a currency"
            [formField]="editAccountForm.currency"
          />
        </div>
      </form>

      <div class="w-full flex flex-row items-center justify-end gap-4" slot="footer">
        <atom-button
          type="button"
          [inverted]="true"
          label="Reset Form"
          variant="secondary"
          form="accounts-form"
          id="reset-account-form"
          (clicked)="resetEditAccountsForm()"
          [disabled]="!editAccountForm().dirty() || isSubmitting()"
        />

        <atom-button
          type="submit"
          form="accounts-form"
          label="Create A New Account"
          id="submit-account-form"
          [isLoading]="isSubmitting()"
          [disabled]="editAccountForm().invalid() || isSubmitting()"
        />
      </div>
    </organism-form>
  `,
})
export class AccountDetailsForm {
  // INPUTS
  readonly account = input.required<IAccount>();
  readonly isSubmitting = input.required<boolean>();
  readonly isEditFormOpen = input.required<boolean>();

  // OUTPUTS
  readonly onEditFormClose = output<void>();

  // SERVICES
  private readonly accountsService = inject(AccountsService);

  // DATA
  protected readonly currencies = CURRENCIES;
  protected readonly accountTypes = this.accountsService.getAccountTypes();

  // FORM
  protected readonly editAccountFormModel = signal<UpdateAccountDetailsSchema>({
    name: '',
    type: '',
    currency: '',
  });

  protected readonly editAccountForm = form<UpdateAccountDetailsSchema>(
    this.editAccountFormModel,
    UpdateAccountValidationSchema,
  );

  constructor() {
    effect(() => {
      const { name, type, currency } = this.account();
      this.editAccountFormModel.set({ name, type, currency });
    });
  }

  // METHODS
  protected resetEditAccountsForm() {
    const acc = this.account();
    this.editAccountForm().reset();
    this.editAccountFormModel.set({
      name: acc.name,
      type: acc.type,
      currency: acc.currency,
    });
  }

  // SUBMISSIONS
  protected submitEditAccountForm(event: Event) {
    event.preventDefault();

    const { ...payload } = this.editAccountFormModel();

    setTimeout(() => {
      this.accountsService.createNewAccount(payload).subscribe({
        next: () => {
          console.log('Account created successfully');
        },
        complete: () => this.onEditFormClose.emit(),
      });
    }, 2500);
  }
}
