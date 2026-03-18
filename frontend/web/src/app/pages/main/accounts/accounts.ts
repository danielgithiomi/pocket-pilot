import { Form } from '@organisms/form';
import { NgClass } from '@angular/common';
import { Account } from '@widgets/account';
import { form } from '@angular/forms/signals';
import { Input } from '@components/ui/atoms/input';
import { Button } from '@components/ui/atoms/button';
import { AccountsService } from '@api/accounts.service';
import { ToastService } from '@components/ui/atoms/toast';
import { Component, inject, signal } from '@angular/core';
import { LucideAngularModule, ListFilterPlus } from 'lucide-angular';
import { NoData } from '@components/structural/main/no-data/no-data';
import {
  AccountsSchema,
  initialAccountsFormState,
  accountsFormValidationSchema,
} from './accounts.types';

@Component({
  selector: 'accounts',
  styleUrl: './accounts.css',
  templateUrl: './accounts.html',
  imports: [NoData, Button, LucideAngularModule, Form, Input, NgClass, Account],
})
export class Accounts {
  protected readonly iconSize: number = 18;
  protected readonly Plus = ListFilterPlus;

  // Services
  private readonly toastService = inject(ToastService);
  protected readonly accountsService = inject(AccountsService);

  // States
  protected isFormOpen = signal<boolean>(false);
  protected isSubmitting = signal<boolean>(false);
  protected readonly accountTypes = this.accountsService.getAccountTypes();
  protected readonly accountsWithCount = this.accountsService.getUserAccounts();

  // Form
  protected accountsFormModel = signal<AccountsSchema>(initialAccountsFormState);
  protected accountsForm = form(this.accountsFormModel, accountsFormValidationSchema);

  // Methods
  resetAccountsForm = () => {
    this.accountsForm().reset();
    this.accountsFormModel.set(initialAccountsFormState);
  };

  submitAccountsForm = (event: Event) => {
    event.preventDefault();

    const { name } = this.accountsFormModel();

    this.isSubmitting.set(true);

    setTimeout(() => {
      this.accountsService.createNewAccount({ name }).subscribe({
        next: () => {
          this.toastService.show({
            variant: 'success',
            title: 'Account created!',
            details: `Your [${name}] account has been created successfully.`,
          });
          this.accountsWithCount.reload();
          this.isFormOpen.set(false);
          this.resetAccountsForm();
        },
        error: () => this.isSubmitting.set(false),
        complete: () => this.isSubmitting.set(false),
      });
    }, 3000);
  };
}
