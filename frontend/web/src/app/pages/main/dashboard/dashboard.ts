import { Input } from "@atoms/input";
import { Button } from "@atoms/button";
import { Form } from '@organisms/form';
import { formatCurrency } from '@libs/utils';
import { form } from '@angular/forms/signals';
import { MONTHS_ENUM } from '@global/constants';
import { RatioSlider } from '@atoms/ratio-slider';
import { ProgressBar } from '@atoms/progress-bar';
import { CostAnalysis } from '@widgets/cost-analysis';
import { AccountsService } from '@api/accounts.service';
import { TransactionsService } from '@api/transactions.service';
import { Component, computed, inject, signal } from '@angular/core';
import { DashboardCard } from '@components/structural/main/dashboard-card/dashboard-card';
import { TransactionLimitSchema, TransactionLimitValidationSchema } from './dashboard.types';
import {
  Wallet,
  HandCoins,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  BrickWallShield,
  LucideAngularModule,
} from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
  imports: [RatioSlider, ProgressBar, CostAnalysis, DashboardCard, LucideAngularModule, Form, Input, Button],
})
export class Dashboard {
  // Icons
  protected readonly walletIcon = Wallet;
  protected readonly ratioIcon = PiggyBank;
  protected readonly incomeIcon = TrendingUp;
  protected readonly handCoinsIcon = HandCoins;
  protected readonly expenseIcon = TrendingDown;
  protected readonly transactionIcon = ArrowLeftRight;
  protected readonly spendingLimitIcon = BrickWallShield;

  // Services
  private readonly accountsService = inject(AccountsService);
  private readonly transactionsService = inject(TransactionsService);

  // Data
  protected readonly accounts = this.accountsService.getUserAccounts();
  protected readonly currency = this.accountsService.getDefaultCurrency();
  protected readonly transactions = this.transactionsService.getUserTransactions();
  protected readonly spendingLimit = this.accountsService.getMaximumSpendingLimit();

  // Signals
  protected readonly isSubmittingEditLimitForm = signal<boolean>(false);
  protected readonly isEditSpendingLimitFormOpen = signal<boolean>(false);
  protected readonly maximumSpendingLimit = this.accountsService.getMaximumSpendingLimit();

  // States
  protected readonly isDataLoading = computed(
    () => this.accounts.isLoading() || this.transactions.isLoading(),
  );

  // Computed
  protected readonly currentMonth = computed(() => MONTHS_ENUM[new Date().getMonth()].value);

  protected readonly accountsCount = computed(() => {
    if (this.accounts.error()) return '0';
    return (this.accounts.value()?.data.count ?? 0).toString();
  });

  protected readonly transactionsCount = computed(() => {
    if (this.transactions.error()) return '0';
    return (this.transactions.value()?.data.count ?? 0).toString();
  });

  protected readonly totalRevenue = computed<number>(() => {
    if (this.transactions.error()) return 0;
    const transactions = this.transactions.value()?.data.data;
    if (!transactions) return 0;
    return transactions
      .filter((transaction) => transaction.type === 'INCOME')
      .reduce((total, transaction) => total + transaction.amount, 0);
  });

  protected readonly totalExpenses = computed<number>(() => {
    if (this.transactions.error()) return 0;
    const transactions = this.transactions.value()?.data.data;
    if (!transactions) return 0;
    return transactions
      .filter((transaction) => transaction.type === 'EXPENSE')
      .reduce((total, transaction) => total + transaction.amount, 0);
  });

  protected readonly netCashFlow = computed(() => {
    const revenue = this.totalRevenue();
    const expenses = this.totalExpenses();
    return revenue + expenses;
  });

  protected readonly formattedNetCashFlow = computed(() => {
    return formatCurrency(this.netCashFlow(), this.currency, 2, true, false);
  });

  protected readonly spendingRatio = computed<number>(() => {
    const revenue = this.totalRevenue();
    const expenses = this.totalExpenses();

    if (expenses <= 0 || revenue <= 0) return 0;

    const ratio = (expenses / revenue) * 100;

    return Math.min(100, Math.max(0, Math.round(ratio)));
  });

  // Forms
  protected readonly initialLimitFormState = { amount: this.spendingLimit() };
  protected editLimitFormModel = signal<TransactionLimitSchema>(this.initialLimitFormState);
  protected editLimitForm = form(this.editLimitFormModel, TransactionLimitValidationSchema);

  // Methods
  protected submitEditLimitForm(event: Event) {
    event.preventDefault();

    const { amount } = this.editLimitFormModel();
    this.accountsService.setMaximumSpendingLimit(amount);
    this.isEditSpendingLimitFormOpen.set(false);
  }

  protected resetEditLimitForm() {
    this.editLimitForm().reset();
    this.isSubmittingEditLimitForm.set(false);
    this.editLimitFormModel.set(this.initialLimitFormState);
  }

  protected onEditSpendingLimit() {
    this.isEditSpendingLimitFormOpen.set(true);
  }

  protected onMonthChange(month: string) {
    console.log('Month changed:', month);
  }

  protected handleCloseForm(source: 'icon' | 'overlay') {
    this.isEditSpendingLimitFormOpen.set(false);
  }

  // Helper Methods
  protected formatCurrency(value: string) {
    return formatCurrency(Number(value), this.currency, 2, true, false);
  }
}
