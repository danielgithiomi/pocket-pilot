import { form } from '@angular/forms/signals';
import { Table } from '@components/ui/organisms';
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
import { TableColumn } from '@components/ui/organisms/table/table.types';
import { formatCurrency, formatDate, splitTransactionId, capitalize } from '@libs/utils/formatters';
import {
  TransactionRow,
  TransactionSchema,
  initialTransactionFormState,
  transactionFormValidationSchema,
} from './transactions.types';
import { IDeletedResourceResponse, IStandardResponse } from '@global/types';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.html',
  imports: [Button, LucideAngularModule, NoData, Form, Input, Select, Table],
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
  protected readonly transactions = this.transactionsService.getUserTransactions();
  protected readonly transactionTypes = this.transactionsService.getTransactionTypes();
  protected readonly transactionCategories = this.transactionsService.getTransactionCategories();

  // States
  protected isDeleting = signal<boolean>(false);
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

  private reloadResources() {
    this.accounts.reload();
    this.transactions.reload();
  }

  // TABLE
  protected transactionColumns: TableColumn<TransactionRow>[] = [
    {
      key: 'id',
      label: 'ID',
      width: '1fr',
    },
    {
      key: 'type',
      label: 'Type',
      width: '1fr',
      cellTemplate: (transaction: TransactionRow) => {
        let classes =
          'px-2 py-1 rounded-xl text-xs overflow-hidden text-ellipsis dark:text-(--inverted-text)';

        if (transaction.type === 'INCOME') classes += ' bg-(--income)';
        else classes += ' bg-(--expense)';

        return `<span class="${classes}">${transaction.type}</span>`;
      },
    },
    {
      key: 'amount',
      label: 'Amount',
      width: '2fr',
      cellTemplate: (transaction: TransactionRow) => {
        let classes = 'font-semibold';
        return `<span class="${classes}">${transaction.amount}</span>`;
      },
    },
    {
      key: 'category',
      label: 'Category',
      width: '2fr',
      cellTemplate: (transaction: TransactionRow) => {
        let classes =
          'px-2 py-1 rounded-xl text-xs overflow-hidden text-ellipsis bg-(--body-background)';

        return `<span class="${classes}">${transaction.category}</span>`;
      },
    },
    {
      key: 'accountName',
      label: 'Account',
      width: '2fr',
    },
    {
      key: 'date',
      label: 'Date',
      width: '1fr',
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      width: '1fr',
    },
  ];

  protected formattedTransactions = computed<TransactionRow[]>(() => {
    return (
      this.transactions.value()?.data?.data?.map((transaction) => ({
        fullId: transaction.id,
        type: transaction.type,
        category: transaction.category,
        accountId: transaction.account.id,
        date: formatDate(transaction.date),
        id: splitTransactionId(transaction.id),
        amount: formatCurrency(transaction.amount),
        accountName: capitalize(transaction.account.name),
      })) || []
    );
  });

  protected deleteDataRow(row: TransactionRow) {
    this.isDeleting.set(true);
    const { accountId, fullId: transactionId } = row;

    this.transactionsService.deleteTransaction(accountId, transactionId).subscribe({
      next: (response: IStandardResponse<IDeletedResourceResponse>) => {
        const { message, details } = response.data;
        this.toastService.show({
          details,
          title: message,
          variant: 'success',
        });
        this.reloadResources();
      },
      error: (error) => console.error(error),
      complete: () => this.isDeleting.set(false),
    });
  }

  // FORM
  protected handleOpenForm() {
    if (this.accounts.value()?.data?.count === 0) {
      this.toastService.show({
        variant: 'warning',
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

    const { amount } = this.transactionFormModel();

    if (!amount) {
      this.toastService.show({
        variant: 'error',
        title: 'Amount is required!',
        details: 'Please enter a valid amount.',
      });
      return;
    }

    this.isSubmitting.set(true);

    const { accountId, ...transactionPayload } = this.transactionFormModel();
    const availableBalance: number =
      this.accounts.value()?.data?.data?.find((account) => account.id === accountId)?.balance ?? 0;

    setTimeout(() => {
      this.transactionsService
        .createTransaction(accountId, availableBalance, transactionPayload)
        .subscribe({
          next: () => {
            this.toastService.show({
              variant: 'success',
              title: 'Transaction created!',
              details: `Your [${transactionPayload.type.toUpperCase()}] transaction has been logged successfully.`,
            });

            this.reloadResources();
            this.resetTransactionForm();
            this.isFormOpen.set(false);
          },
          error: (error) => console.error('Transaction creation failed:', error),
          complete: () => this.isSubmitting.set(false),
        });
    }, 3000);
  }
}
