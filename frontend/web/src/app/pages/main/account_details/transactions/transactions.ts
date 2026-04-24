import { Transaction } from '@global/types';
import { Table, TableColumn } from '@organisms/table';
import { AccountsService } from '@api/accounts.service';
import { formatCurrency, formatDate } from '@libs/utils';
import { AccountTransactionRow } from './transactions.types';
import { Component, computed, inject, input } from '@angular/core';

@Component({
  selector: 'account-transactions',
  templateUrl: './transactions.html',
  imports: [Table],
})
export class TransactionsComponent {
  // INPUT
  readonly transactions = input.required<Transaction[]>();

  // SERVICES
  private readonly accountService = inject(AccountsService);

  // DATA
  private readonly currency = this.accountService.getDefaultCurrency();

  // TABLE
  protected accountTransactionsColumns: TableColumn<AccountTransactionRow>[] = [
    {
      key: 'category',
      label: 'Category',
      width: '1fr',
      cellTemplate: (transaction: AccountTransactionRow) => {
        let classes =
          'px-2 py-1 rounded-xl text-xs overflow-hidden text-ellipsis bg-(--body-background)';
        return `<span class="${classes}">${transaction.category}</span>`;
      },
    },
    {
      key: 'amount',
      label: 'Amount',
      width: '1.5fr',
      cellTemplate: (transaction: AccountTransactionRow) => {
        let classes = 'font-semibold';
        return `<span class="${classes}">${transaction.amount}</span>`;
      },
    },
    {
      key: 'type',
      label: 'Type',
      width: '1fr',
      cellTemplate: (transaction: AccountTransactionRow) => {
        let classes =
          'px-2 py-1 rounded-xl text-xs overflow-hidden text-ellipsis dark:text-(--inverted-text)';

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

        return `<span class="${classes}">${transaction.type}</span>`;
      },
    },
    {
      key: 'description',
      label: 'Description',
      width: '2fr',
      cellTemplate: (transaction: AccountTransactionRow) => {
        let classes = 'font-semibold';
        let description = !transaction.description ? '-' : transaction.description;
        return `<span class="${classes}">${description}</span>`;
      },
    },
    {
      key: 'date',
      label: 'Date',
      width: '1fr',
    },
  ];

  protected formattedTransactions = computed<AccountTransactionRow[]>(() => {
    const transactionsToFormat = this.transactions();

    return (
      transactionsToFormat?.map((transaction) => ({
        id: transaction.id,
        type: transaction.type,
        category: transaction.category,
        date: formatDate(transaction.date),
        description: transaction.description,
        amount: formatCurrency(transaction.amount, this.currency, 2, true, false),
      }))
    ).reverse();
  });
}
