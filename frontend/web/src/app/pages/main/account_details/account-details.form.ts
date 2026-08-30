import { Input } from '@atoms/input';
import { Form } from '@organisms/form';
import { Select } from '@atoms/select';
import { Button } from '@atoms/button';
import { ToastService } from '@atoms/toast';
import { form } from '@angular/forms/signals';
import { CURRENCIES } from '@shared/constants';
import { formatToReadable } from '@libs/utils';
import { Account as IAccount } from '@shared/types';
import { AccountsService } from '@api/accounts.service';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { UpdateAccountDetailsSchema, UpdateAccountValidationSchema } from './account.details.types';

@Component({
    selector: 'edit-account-details-form',
    imports: [Form, Input, Select, Button],
    template: `
        <organism-form
            id="accounts"
            title="Update Account"
            [class.hidden]="!isEditFormOpen()"
            description="Modify account details"
            (onFormCloseEvent)="closeEditFormEvent.emit($event)">
            @let types = accountTypes.value()?.data;
            <form slot="content" id="edit-account-form" (submit)="submitEditAccountForm($event)">
                <atom-input
                    id="name"
                    type="text"
                    [inverted]="true"
                    autocomplete="name"
                    label="Account Name"
                    placeholder="Eg: Expenditure"
                    [formField]="editAccountForm.name"
                    (clearOutput)="editAccountForm.name().controlValue.set('')" />

                <div class="flex flex-col sm:flex-row gap-4">
                    <atom-select
                        class="flex-1"
                        id="account-type"
                        [inverted]="true"
                        label="Account Type"
                        wrapperClassName="my-0"
                        placeholder="Select a type"
                        [formField]="editAccountForm.type"
                        [options]="types || [{ value: '', label: 'No account types found' }]" />

                    <atom-select
                        class="flex-1"
                        [inverted]="true"
                        id="account-currency"
                        [options]="currencies"
                        wrapperClassName="my-0"
                        label="Account Currency"
                        placeholder="Select a currency"
                        [formField]="editAccountForm.currency" />
                </div>
            </form>

            <div class="w-full flex flex-row items-center justify-end gap-4" slot="footer">
                <atom-button
                    type="button"
                    [inverted]="true"
                    label="Reset Form"
                    variant="secondary"
                    form="edit-account-form"
                    id="reset-edit-account-form"
                    (clicked)="resetEditAccountsForm()"
                    [disabled]="!editAccountForm().dirty() || isSubmitting()" />

                <atom-button
                    type="submit"
                    label="Update Account"
                    form="edit-account-form"
                    [isLoading]="isSubmitting()"
                    id="submit-edit-account-form"
                    [disabled]="editAccountForm().invalid() || !editAccountForm().dirty() || isSubmitting()" />
            </div>
        </organism-form>
    `
})
export class AccountDetailsForm {
    // INPUTS
    readonly account = input.required<IAccount>();
    readonly isEditFormOpen = input.required<boolean>();

    // OUTPUTS
    readonly closeEditFormEvent = output<'submit' | 'icon' | 'backdrop'>();

    // SIGNALS
    protected readonly isSubmitting = signal<boolean>(false);

    // SERVICES
    private readonly toastService = inject(ToastService);
    private readonly accountsService = inject(AccountsService);

    // DATA
    protected readonly currencies = CURRENCIES;
    protected readonly accountTypes = this.accountsService.getAccountTypes();

    // FORM
    protected readonly editAccountFormModel = signal<UpdateAccountDetailsSchema>({
        name: '',
        type: '',
        currency: '',
        isBalanceVisible: true
    });

    protected readonly editAccountForm = form<UpdateAccountDetailsSchema>(
        this.editAccountFormModel,
        UpdateAccountValidationSchema
    );

    constructor() {
        effect(() => {
            const { name, type, currency, isBalanceVisible } = this.account();
            this.editAccountFormModel.set({
                name: formatToReadable(name),
                type,
                currency,
                isBalanceVisible
            });
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
            isBalanceVisible: acc.isBalanceVisible
        });
    }

    // SUBMISSIONS
    protected submitEditAccountForm(event: Event) {
        event.preventDefault();

        this.isSubmitting.set(true);

        const { ...payload } = this.editAccountFormModel();

        setTimeout(() => {
            this.accountsService.updateAccountById(this.account().id, payload).subscribe({
                next: (account: IAccount) => {
                    this.toastService.show({
                        variant: 'success',
                        title: 'Account updated successfully!',
                        details: `Your [${account.name}] account information has been updated successfully.`
                    });

                    this.closeEditFormEvent.emit('submit');
                },
                complete: () => this.isSubmitting.set(false)
            });
        }, 2500);
    }
}
