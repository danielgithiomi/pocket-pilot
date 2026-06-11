import { Table, TableColumn } from '@organisms/table';
import { TransactionWithAccount } from '@global/types';
import { AccountsService } from '@api/accounts.service';
import { formatCurrency, formatDate } from '@libs/utils';
import { AccountTransactionRow } from './transactions.types';
import { ExchangeRateService } from '@api/exchange-rate.service';
import { Component, computed, inject, input } from '@angular/core';

@Component({
    imports: [Table],
    selector: 'account-transactions',
    templateUrl: './transactions.html',
})
export class TransactionsComponent {
    private readonly accountsService = inject(AccountsService);
    private readonly exchangeRateService = inject(ExchangeRateService);

    // INPUT
    readonly accountId = input.required<string>();
    readonly accountCurrency = input.required<string>();
    readonly transactions = input.required<TransactionWithAccount[]>();

    private readonly defaultCurrency = this.accountsService.getDefaultCurrency();

    // TABLE
    protected accountTransactionsColumns: TableColumn<AccountTransactionRow>[] = [
        {
            key: 'category',
            label: 'Category',
            width: '1fr',
            cellTemplate: (transaction: AccountTransactionRow) => {
                const classes =
                    'px-2 py-1 rounded-xl text-xs overflow-hidden text-ellipsis bg-(--body-background)';
                return `<span class="${classes}">${transaction.category}</span>`;
            },
        },
        {
            key: 'amount',
            label: 'Amount',
            width: '1.5fr',
            cellTemplate: (transaction: AccountTransactionRow) => {
                const classes = 'font-semibold';
                const currencyClasses = 'font-semibold text-muted-text text-[11px]';

                return `
          <div class="flex flex-col">
            <span class="${classes}">${transaction.amount}</span>
            <span class="${transaction.showConvertedAmount ? currencyClasses : 'hidden'}">≈ ${transaction.convertedAmount}</span>
          </div>
        `;
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

                return `<span class="${classes}">
          ${transaction.type} ${transaction.type === 'TRANSFER' ? (this.accountId() !== transaction.sourceAccountId ? '&#8690;' : '&#8689;') : ''}
        </span>`;
            },
        },
        {
            key: 'description',
            label: 'Description',
            width: '2fr',
            cellTemplate: (transaction: AccountTransactionRow) => {
                const classes = 'font-semibold';
                const description = !transaction.description ? '-' : transaction.description;
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
        const snapshot = this.exchangeRateService.exchangeRateSnapshot();
        const defaultCurrency = this.defaultCurrency;
        const fallbackCurrency = this.accountCurrency();

        return transactionsToFormat
            ?.map((transaction) => {
                const currency = transaction.sourceAccount?.currency ?? fallbackCurrency;
                const conversionResult =
                    snapshot &&
                    this.exchangeRateService.performCurrencyConversion(
                        transaction.amount,
                        currency,
                        defaultCurrency,
                    );

                const isSameCurrency = currency === defaultCurrency;
                const convertedAmount = conversionResult
                    ? formatCurrency(
                          conversionResult.target.amount,
                          conversionResult.target.currency,
                          2,
                          true,
                          false,
                      )
                    : '';

                return {
                    id: transaction.id,
                    type: transaction.type,
                    category: transaction.category,
                    date: formatDate(transaction.date),
                    description: transaction.description,
                    sourceAccountId: transaction.sourceAccount?.id ?? '',
                    targetAccountId: transaction.targetAccount?.id ?? null,
                    currency,
                    rawAmount: transaction.amount,
                    amount: formatCurrency(transaction.amount, currency, 2, true, false),
                    convertedAmount,
                    showConvertedAmount: !isSameCurrency && convertedAmount !== '',
                };
            })
            .reverse();
    });
}
