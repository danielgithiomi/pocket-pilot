import { Form } from '@organisms/form';
import { NgClass } from '@angular/common';
import { Account } from '@widgets/account';
import { form } from '@angular/forms/signals';
import { Input } from '@components/ui/atoms/input';
import { Button } from '@components/ui/atoms/button';
import { Select } from '@components/ui/atoms/select';
import { AccountsService } from '@api/accounts.service';
import { DrawerService } from '@infrastructure/services';
import { ToastService } from '@components/ui/atoms/toast';
import { NoData } from '@structural/main/no-data/no-data';
import { Component, computed, inject, signal } from '@angular/core';
import { LucideAngularModule, ListFilterPlus } from 'lucide-angular';
import { FetchError } from '@structural/main/fetch-error/fetch-error';
import { AccountsSchema, accountsFormValidationSchema } from './accounts.types';
import { CURRENCIES, DummyAccountData as DummyAccount } from '@global/constants';

@Component({
  selector: 'accounts',
  templateUrl: './accounts.html',
  styles: `
    @reference 'tailwindcss';

    .account-grid {
      @apply grid py-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6;
    }
  `,
  imports: [NoData, Button, LucideAngularModule, Form, Input, NgClass, Account, Select, FetchError],
})
export class Accounts {
  // Icons
  protected readonly iconSize: number = 18;
  protected readonly Plus = ListFilterPlus;

  // Services
  private readonly toastService = inject(ToastService);
  protected readonly drawerService = inject(DrawerService);
  protected readonly accountsService = inject(AccountsService);

  // States
  protected isFormOpen = signal<boolean>(false);
  protected isSubmitting = signal<boolean>(false);

  // Computed
  protected isLoadingAccounts = computed<boolean>(() => this.accountsWithCount.isLoading());
  protected accountsHasError = computed(
    () => !!this.accountsWithCount.error() || !this.accountsWithCount.hasValue(),
  );
  protected accountsResource = computed(() => {
    if (this.accountsWithCount.error()) return null;
    return this.accountsWithCount.value()?.data ?? null;
  });
  protected accountsList = computed(() => this.accountsResource()?.data ?? []);
  protected accountsCount = computed(() => this.accountsResource()?.count ?? 0);

  // Data
  protected readonly currencies = CURRENCIES;
  protected readonly dummyAccount = DummyAccount;
  protected readonly currency = this.accountsService.getDefaultCurrency();
  protected readonly accountTypes = this.accountsService.getAccountTypes();
  protected readonly accountsWithCount = this.accountsService.getUserAccounts();

  // Safe resource accessors for templates
  protected accountTypesHasError = computed(() => !!this.accountTypes.error());
  protected accountTypesValue = computed(() => {
    if (this.accountTypes.error()) return null;
    return this.accountTypes.value()?.data ?? null;
  });

  // Form
  private readonly INITIAL_FORM_STATE: AccountsSchema = {
    name: '',
    type: '',
    currency: this.currency,
  };
  protected accountsFormModel = signal<AccountsSchema>(this.INITIAL_FORM_STATE);
  protected accountsForm = form(this.accountsFormModel, accountsFormValidationSchema);

  // Methods
  protected resetAccountsForm() {
    this.accountsForm().reset();
    this.accountsFormModel.set(this.INITIAL_FORM_STATE);
  }

  protected handleCloseForm(source: 'icon' | 'overlay') {
    if (source === 'icon') this.resetAccountsForm();
    this.isFormOpen.set(false);
  }

  protected submitAccountsForm = (event: Event) => {
    event.preventDefault();

    const payload = this.accountsFormModel();

    this.isSubmitting.set(true);

    setTimeout(() => {
      this.accountsService.createNewAccount(payload).subscribe({
        next: () => {
          this.toastService.show({
            variant: 'success',
            title: 'Account created!',
            details: `Your [${payload.name}] account has been created successfully.`,
          });
          this.accountsWithCount.reload();
          this.resetAccountsForm();
          this.isFormOpen.set(false);
        },
        error: (error) => console.error('Account creation failed:', error),
        complete: () => this.isSubmitting.set(false),
      });
    }, 1000);
  };
}
