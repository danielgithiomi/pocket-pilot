import { Form } from '@organisms/form';
import { NgClass } from '@angular/common';
import { Account } from '@widgets/account';
import { form } from '@angular/forms/signals';
import { Input } from '@components/ui/atoms/input';
import { Button } from '@components/ui/atoms/button';
import { Select } from '@components/ui/atoms/select';
import { AccountsService } from '@api/accounts.service';
import { ToastService } from '@components/ui/atoms/toast';
import { Component, computed, inject, signal } from '@angular/core';
import { LucideAngularModule, ListFilterPlus } from 'lucide-angular';
import { NoData } from '@components/structural/main/no-data/no-data';
import { FetchError } from '@components/structural/main/fetch-error/fetch-error';
import {
  AccountsSchema,
  initialAccountsFormState,
  accountsFormValidationSchema,
} from './accounts.types';

@Component({
  selector: 'accounts',
  templateUrl: './accounts.html',
  styles: `
    @reference 'tailwindcss';

    .account-grid {
      @apply grid py-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6;
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
  protected readonly accountsService = inject(AccountsService);

  // States
  protected isFormOpen = signal<boolean>(false);
  protected isSubmitting = signal<boolean>(false);

  // Computed
  protected isLoadingAccounts = computed<boolean>(() => this.accountsWithCount.isLoading());

  // Data
  protected readonly accountTypes = this.accountsService.getAccountTypes();
  protected readonly accountsWithCount = this.accountsService.getUserAccounts();

  // Form
  protected accountsFormModel = signal<AccountsSchema>(initialAccountsFormState);
  protected accountsForm = form(this.accountsFormModel, accountsFormValidationSchema);

  // Methods
  protected resetAccountsForm() {
    this.accountsForm().reset();
    this.accountsFormModel.set(initialAccountsFormState);
  }

  protected handleCloseForm(source: 'icon' | 'overlay') {
    if (source === 'icon') this.resetAccountsForm();
    this.isFormOpen.set(false);
  }

  protected submitAccountsForm = (event: Event) => {
    event.preventDefault();

    const { name, type } = this.accountsFormModel();

    this.isSubmitting.set(true);

    setTimeout(() => {
      this.accountsService.createNewAccount({ name, type }).subscribe({
        next: () => {
          this.toastService.show({
            variant: 'success',
            title: 'Account created!',
            details: `Your [${name}] account has been created successfully.`,
          });
          this.accountsWithCount.reload();
          this.resetAccountsForm();
          this.isFormOpen.set(false);
        },
        error: (error) => console.error('Account creation failed:', error),
        complete: () => this.isSubmitting.set(false),
      });
    }, 3000);
  };
}
