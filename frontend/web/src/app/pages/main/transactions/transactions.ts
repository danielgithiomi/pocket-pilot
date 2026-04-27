import { Table } from '@organisms/table';
import { NgClass } from '@angular/common';
import { form } from '@angular/forms/signals';
import { Input } from '@components/ui/atoms/input';
import { Select } from '@components/ui/atoms/select';
import { Button } from '@components/ui/atoms/button';
import { IVoidResourceResponse } from '@global/types';
import { AccountsService } from '@api/accounts.service';
import { NoData } from '@structural/main/no-data/no-data';
import { ToastService } from '@components/ui/atoms/toast';
import { Form } from '@components/ui/organisms/form/form';
import { TableColumn } from '@organisms/table/table.types';
import { CategoriesService } from '@api/categories.service';
import { TransactionsService } from '@api/transactions.service';
import { TabList } from '@components/ui/atoms/tab-list/tab-list';
import { Component, computed, inject, signal } from '@angular/core';
import { LucideAngularModule, ListFilterPlus } from 'lucide-angular';
import { FetchError } from '@structural/main/fetch-error/fetch-error';
import { formatCurrency, formatDate, splitTransactionId, capitalize } from '@libs/utils/formatters';
import {
  skeletonData,
  tabListItems,
  TransactionRow,
  TransactionSchema,
  initialTransactionFormState,
  transactionFormValidationSchema,
} from './transactions.types';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.html',
  imports: [
    Form,
    Input,
    Table,
    NoData,
    Select,
    Button,
    NgClass,
    TabList,
    FetchError,
    LucideAngularModule,
  ],
})
export class Transactions {
  // Icons
  protected readonly iconSize: number = 18;
  protected readonly Plus = ListFilterPlus;
  protected readonly skeletonData = skeletonData;
  protected readonly tabListItems = tabListItems;

  // Services
  private readonly toastService = inject(ToastService);
  private readonly accountsService = inject(AccountsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly transactionsService = inject(TransactionsService);

  // Data
  protected readonly accounts = this.accountsService.getUserAccounts();
  protected readonly transactions = this.transactionsService.getUserTransactions();
  protected readonly transactionTypes = this.transactionsService.getTransactionTypes();
  protected readonly transactionCategories = this.categoriesService.getTransactionCategories;

  // States
  protected activeTabIndex = signal<number>(0);
  protected isDeleting = signal<boolean>(false);
  protected isFormOpen = signal<boolean>(false);
  protected isSubmitting = signal<boolean>(false);

  // Computed
  protected isFetching = computed(() => {
    return this.accounts.isLoading() || this.transactions.isLoading();
  });

  protected accountsDropdown = computed(() => {
    return this.accounts.value()?.data?.data?.map((account) => ({
      value: account.id,
      label: account.name,
    }));
  });

  protected editStateText = computed<string>(() => {
    switch (this.activeTabIndex()) {
      case 0:
        return 'You have no transactions yet! Log your first transaction today.';
      case 1:
        return 'You have no income transactions logged yet!';
      case 2:
        return 'You have no expense transactions logged yet!';
      default:
        return 'You have no transfer transactions logged yet!';
    }
  });

  protected filteredTransactions = computed(() => {
    const activeTabIndex = this.activeTabIndex();
    const transactions = this.transactions.value()?.data?.data;
    const activeTabValue = this.tabListItems[activeTabIndex].value;

    if (!transactions) return [];

    return transactions.filter((transaction) => {
      if (activeTabIndex === 0) return true;
      return transaction.type.toLowerCase() === activeTabValue;
    });
  });

  // Form
  protected transactionFormModel = signal<TransactionSchema>(initialTransactionFormState);
  protected transactionForm = form(this.transactionFormModel, transactionFormValidationSchema);

  // Methods
  protected resetTransactionForm() {
    this.transactionForm().reset();
    this.transactionFormModel.set(initialTransactionFormState);
  }

  protected onTabSelected(index: number) {
    this.activeTabIndex.set(index);
  }

  private reloadResources() {
    this.accounts.reload();
    this.transactions.reload();
  }

  // TABLE
  protected transactionColumns: TableColumn<TransactionRow>[] = [
    {
      key: 'category',
      label: 'Category',
      width: '1fr',
      cellTemplate: (transaction: TransactionRow) => {
        let classes =
          'px-2 py-1 rounded-xl text-xs overflow-hidden text-ellipsis bg-(--body-background)';

        return `<span class="${this.isFetching() ? 'table-skeleton' : classes}">${transaction.category}</span>`;
      },
    },
    {
      key: 'amount',
      label: 'Amount',
      width: '1.5fr',
      cellTemplate: (transaction: TransactionRow) => {
        const isSameCurrency = transaction.currency === 'MUR';

        let classes = 'font-semibold';
        let currencyClasses = 'font-semibold text-muted-text text-xs';
        return `<div class="flex flex-col">
        <span class="${this.isFetching() ? 'table-skeleton' : classes}">${transaction.amount}</span>
          <span class="${isSameCurrency ? 'hidden' : currencyClasses}">≈ Rs. 200</span>
        </div>`;
      },
    },
    {
      key: 'type',
      label: 'Type',
      width: '1fr',
      cellTemplate: (transaction: TransactionRow) => {
        let classes =
          'px-2 py-1 font-semibold rounded-xl text-xs overflow-hidden text-ellipsis dark:text-(--inverted-text)';

        switch (transaction.type) {
          case 'INCOME':
            classes += ' bg-(--income)';
            break;
          case 'EXPENSE':
            classes += ' bg-(--expense)';
            break;
          case 'TRANSFER':
            classes += ' bg-(--transfer)';
            break;
          default:
            classes += ' bg-(--body-background)';
            break;
        }

        return `<span class="${this.isFetching() ? 'table-skeleton' : classes}">${transaction.type}</span>`;
      },
    },
    {
      key: 'description',
      label: 'Description',
      width: '2fr',
      cellTemplate: (transaction: TransactionRow) => {
        let classes = 'font-semibold';
        let description = this.isFetching()
          ? transaction.amount
          : !transaction.description
            ? '-'
            : transaction.description;
        return `<span class="${this.isFetching() ? 'table-skeleton' : classes}">${description}</span>`;
      },
    },
    {
      key: 'accountName',
      label: 'Account',
      width: '1fr',
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
    const transactionsToFormat = this.filteredTransactions();

    return (
      transactionsToFormat?.map((transaction) => ({
        fullId: transaction.id,
        type: transaction.type,
        category: transaction.category,
        accountId: transaction.account.id,
        date: formatDate(transaction.date),
        description: transaction.description,
        id: splitTransactionId(transaction.id),
        currency: transaction.account.currency,
        accountName: capitalize(transaction.account.name),
        amount: formatCurrency(transaction.amount, transaction.account.currency, 2, true, false),
      })) || skeletonData
    ).reverse();
  });

  protected deleteDataRow(row: TransactionRow) {
    this.isDeleting.set(true);
    const { accountId, fullId: transactionId } = row;

    this.transactionsService.deleteTransaction(accountId, transactionId).subscribe({
      next: (response: IVoidResourceResponse) => {
        const { message, details } = response;
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

    this.isSubmitting.set(true);

    const { accountId, ...transactionPayload } = this.transactionFormModel();
    const availableBalance: number =
      this.accounts.value()?.data?.data?.find((account) => account.id === accountId)?.balance ?? 0;

    if (this.transactionsService.isNegativeBalance(availableBalance, transactionPayload))
      this.toastService.show({
        variant: 'warning',
        title: 'Exceeded available balance!',
        details: 'This transaction will result in a negative balance in your account.',
      });

    setTimeout(() => {
      this.transactionsService.createTransaction(accountId, transactionPayload).subscribe({
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
    }, 3500);
  }
}
