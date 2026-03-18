import { form } from '@angular/forms/signals';
import { Input } from '@components/ui/atoms/input';
import { Select } from '@components/ui/atoms/select';
import { Button } from '@components/ui/atoms/button';
import { AccountsService } from '@api/accounts.service';
import { ToastService } from '@components/ui/atoms/toast';
import { Form } from '@components/ui/organisms/form/form';
import { TransactionsService } from '@api/transactions.service';
import { Component, computed, inject, signal } from '@angular/core';
import { LucideAngularModule, ListFilterPlus } from 'lucide-angular';
import { NoData } from '@components/structural/main/no-data/no-data';
import {
  TransactionSchema,
  initialTransactionFormState,
  transactionFormValidationSchema,
} from './transactions.types';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.html',
  imports: [Button, LucideAngularModule, NoData, Form, Input, Select],
})
export class Transactions {
  // Icons
  protected readonly iconSize: number = 18;
  protected readonly Plus = ListFilterPlus;

  // Services
  private readonly toastService = inject(ToastService);
  private readonly accountsService = inject(AccountsService);
  private readonly transactionsService = inject(TransactionsService);

  // Data
  protected readonly accounts = this.accountsService.getUserAccounts();
  protected readonly transactionTypes = this.transactionsService.getTransactionTypes();
  protected readonly transactionCategories = this.transactionsService.getTransactionCategories();

  // States
  protected isFormOpen = signal<boolean>(false);
  protected isSubmitting = signal<boolean>(false);

  // Computed
  protected accountsDropdown = computed(() => {
    return this.accounts.value()?.data?.data?.map((account) => ({
      value: account.id,
      label: account.name,
    }));
  });

  // Form
  protected transactionFormModel = signal<TransactionSchema>(initialTransactionFormState);
  protected transactionForm = form(this.transactionFormModel, transactionFormValidationSchema);

  // Methods
  private resetTransactionForm() {
    this.transactionForm().reset();
    this.transactionFormModel.set(initialTransactionFormState);
  }

  protected handleOpenForm() {
    if (this.accounts.value()?.data?.count === 0) {
      this.toastService.show({
        variant: 'info',
        title: 'No accounts found!',
        details: 'Please create an account first to add transactions.',
      });
      return;
    }
    this.isFormOpen.set(true);
  }

  protected handleCloseForm(source: 'icon' | 'overlay') {
    if (source === 'icon') this.resetTransactionForm();
    this.isFormOpen.set(false);
  }

  protected submitTransactionForm(event: Event) {
    event.preventDefault();
    this.isSubmitting.set(true);

    const { amount, type, category, accountId } = this.transactionFormModel();

    console.log(amount, type, category, accountId);

    setTimeout(() => {
      this.isSubmitting.set(false);
    }, 3000);
  }
}
