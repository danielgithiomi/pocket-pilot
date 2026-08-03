import { Input } from '@atoms/input';
import { Select } from '@atoms/select';
import { Button } from '@atoms/button';
import { Table } from '@organisms/table';
import { NgClass } from '@angular/common';
import { Form } from '@organisms/form/form';
import { ToastService } from '@atoms/toast';
import { TabList } from '@atoms/tab-list/tab-list';
import { extractValueFromInputField } from '@libs/utils';
import { IVoidResourceResponse } from '@shared/types';
import { AccountsService } from '@api/accounts.service';
import { NoData } from '@structural/main/no-data/no-data';
import { TableColumn } from '@organisms/table/table.types';
import { CategoriesService } from '@api/categories.service';
import { TransactionsService } from '@api/transactions.service';
import { ExchangeRateService } from '@api/exchange-rate.service';
import { form, FieldTree, FormRoot } from '@angular/forms/signals';
import { ListFilterPlus, LucideAngularModule } from 'lucide-angular';
import { FetchError } from '@structural/main/fetch-error/fetch-error';
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { formatCurrency, formatDate, formatToReadable, splitTransactionId } from '@libs/utils/formatters';
import {
    skeletonData,
    tabListItems,
    TransactionRow,
    TransactionSchema,
    initialTransactionFormState,
    transactionFormValidationSchema
} from './transactions.types';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.html',
    imports: [Form, FormRoot, Input, Table, NoData, Select, Button, NgClass, TabList, FetchError, LucideAngularModule]
})
export class Transactions {
    // ICONS
    protected readonly iconSize: number = 18;
    protected readonly Plus = ListFilterPlus;
    protected readonly skeletonData = skeletonData;
    protected readonly tabListItems = tabListItems;

    // SERVICES
    private readonly toastService = inject(ToastService);
    private readonly accountsService = inject(AccountsService);
    private readonly categoriesService = inject(CategoriesService);
    private readonly transactionsService = inject(TransactionsService);
    private readonly exchangeRateService = inject(ExchangeRateService);

    // DATA
    protected readonly defaultCurrency = this.accountsService.getDefaultCurrency();
    protected readonly accounts = this.accountsService.getUserAccounts();
    protected readonly transactionCategories = this.categoriesService.getTransactionCategories;
    protected readonly transactions = this.transactionsService.getUserTransactions();
    protected readonly transactionTypes = this.transactionsService.getTransactionTypes();

    // SIGNAL STATES
    protected isDeleting = signal<boolean>(false);
    protected isFormOpen = signal<boolean>(false);
    protected readonly activeTabIndex = signal<number>(0);
    protected readonly isTransferTransaction = signal<boolean>(false);

    // COMPUTED
    protected isFetching = computed(() => {
        return this.accounts.isLoading() || this.transactions.isLoading();
    });

    protected sourceAccountDropdown = computed(() => {
        const accounts = this.accounts.value()?.data?.data;
        const targetAccountId = this.transactionFormModel().targetAccountId;

        if (!targetAccountId || targetAccountId === '')
            return accounts?.map((account) => ({
                value: account.id,
                label: account.name
            }));

        const sourceAccounts = accounts
            ?.filter((account) => account.id !== targetAccountId)
            .map((account) => ({
                value: account.id,
                label: account.name
            }));

        if (!sourceAccounts || sourceAccounts.length === 0) {
            return [{ value: '', label: 'You have no other accounts!', disabled: true }];
        }

        return sourceAccounts;
    });

    protected targetAccountDropdown = computed(() => {
        const accounts = this.accounts.value()?.data?.data;
        const sourceAccountId = this.transactionFormModel().sourceAccountId;

        const targetAccounts = accounts
            ?.filter((account) => account.id !== sourceAccountId)
            .map((account) => ({
                value: account.id,
                label: account.name
            }));

        if (!targetAccounts || targetAccounts.length === 0) {
            return [{ value: '', label: 'You have no other accounts!', disabled: true }];
        }

        return targetAccounts;
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

    // FORM
    protected transactionFormModel = signal<TransactionSchema>(initialTransactionFormState);
    protected transactionForm = form(this.transactionFormModel, transactionFormValidationSchema, {
        submission: {
            ignoreValidators: 'none',
            action: (fieldTree: FieldTree<TransactionSchema>) => this.submitTransactionForm(fieldTree)
        }
    });

    // Methods
    protected resetTransactionForm() {
        this.transactionForm().reset();
        this.isTransferTransaction.set(false);
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
                let classes = 'px-2 py-1 rounded-xl text-xs overflow-hidden text-ellipsis bg-(--body-background)';

                return `<span class="${this.isFetching() ? 'table-skeleton' : classes}">${transaction.category}</span>`;
            }
        },
        {
            key: 'amount',
            label: 'Amount',
            width: '1.5fr',
            cellTemplate: (transaction: TransactionRow) => {
                const classes = 'font-semibold';
                const currencyClasses = 'font-semibold text-muted-text text-[11px]';

                return `
          <div class="flex flex-col">
            <span class="${classes}">${transaction.amount}</span>
            <span class="${transaction.showConvertedAmount ? currencyClasses : 'hidden'}">≈ ${transaction.convertedAmount}</span>
          </div>
        `;
            }
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
            }
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
            }
        },
        {
            key: 'accountName',
            label: 'Account',
            width: '2fr'
        },
        {
            key: 'date',
            label: 'Date',
            width: '1fr'
        },
        {
            key: 'actions',
            label: 'Actions',
            align: 'right',
            width: '1fr',
        }
    ];

    protected formattedTransactions = computed<TransactionRow[]>(() => {
        const transactionsToFormat = this.filteredTransactions();
        const snapshot = this.exchangeRateService.exchangeRateSnapshot();
        const defaultCurrency = this.defaultCurrency;

        return (
            transactionsToFormat?.map((transaction) => {
                const currency = transaction.sourceAccount?.currency ?? defaultCurrency;
                const conversionResult =
                    snapshot &&
                    this.exchangeRateService.performCurrencyConversion(transaction.amount, currency, defaultCurrency);

                const isSameCurrency = currency === defaultCurrency;
                const convertedAmount = conversionResult
                    ? formatCurrency(conversionResult.target.amount, conversionResult.target.currency, 2, true, false)
                    : '';

                return {
                    fullId: transaction.id,
                    type: transaction.type,
                    rawAmount: transaction.amount,
                    category: transaction.category,
                    date: formatDate(transaction.date),
                    description: transaction.description,
                    id: splitTransactionId(transaction.id),
                    accountId: transaction.sourceAccount?.id ?? '',
                    currency,
                    accountName: transaction.sourceAccount?.name
                        ? transaction.targetAccount?.name
                            ? `${formatToReadable(transaction.sourceAccount.name)} -> ${formatToReadable(transaction.targetAccount.name)}`
                            : formatToReadable(transaction.sourceAccount.name)
                        : 'Unknown Account',
                    amount: formatCurrency(transaction.amount, currency, 2, true, false),
                    convertedAmount,
                    showConvertedAmount: !isSameCurrency && convertedAmount !== ''
                };
            }) || skeletonData
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
                    variant: 'success'
                });
                this.reloadResources();
            },
            error: (error) => console.error(error),
            complete: () => this.isDeleting.set(false)
        });
    }

    // FORM
    protected handleOpenForm() {
        if (this.accounts.value()?.data?.count === 0) {
            this.toastService.show({
                variant: 'warning',
                title: 'No accounts found!',
                details: 'Please create an account first to log your transactions.'
            });
            return;
        }
        this.isFormOpen.set(true);
    }

    protected handleCloseForm(source: 'icon' | 'backdrop') {
        if (source === 'icon') this.resetTransactionForm();
        this.isFormOpen.set(false);
    }

    protected async submitTransactionForm(fieldTree: FieldTree<TransactionSchema>) {
        const payload: TransactionSchema = extractValueFromInputField(fieldTree);

        const response = await firstValueFrom(
            this.transactionsService.createTransaction(payload.sourceAccountId, payload)
        );

        if ('data' in response) {
            // const { data: { type } } = response;

            // this.toastService.show({
            //     variant: 'success',
            //     title: 'Transaction created!',
            //     details: `Your [${type.toUpperCase()}] transaction has been logged successfully.`
            // });

            this.reloadResources();
            this.resetTransactionForm();
            this.isFormOpen.set(false);
        } else {
            this.toastService.show({
                variant: 'error',
                title: 'An error occurred.',
                details: 'There was an error encountered while creating the transaction.'
            });
        }
    }

    constructor() {
        effect(() => {
            const categoryControl = this.transactionForm.category();
            const transactionType = this.transactionForm.type().controlValue();
            const currentCategory = untracked(() => categoryControl.controlValue());

            if (transactionType === 'TRANSFER') {
                this.isTransferTransaction.set(true);
                if (currentCategory !== 'Transfer') {
                    categoryControl.controlValue.set('Transfer');
                }
            } else {
                this.isTransferTransaction.set(false);
                if (currentCategory !== '') {
                    categoryControl.controlValue.set('');
                }
            }
        });
    }
}
