import { formatCurrency } from '@libs/utils';
import { RatioSlider } from '@atoms/ratio-slider';
import { AccountsService } from '@api/accounts.service';
import { Component, computed, inject } from '@angular/core';
import { TransactionsService } from '@api/transactions.service';
import { DashboardCard } from '@components/structural/main/dashboard-card/dashboard-card';
import {
  Wallet,
  HandCoins,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  LucideAngularModule,
} from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
  imports: [DashboardCard, LucideAngularModule, RatioSlider],
})
export class Dashboard {
  // Icons
  protected readonly walletIcon = Wallet;
  protected readonly ratioIcon = PiggyBank;
  protected readonly incomeIcon = TrendingUp;
  protected readonly handCoinsIcon = HandCoins;
  protected readonly expenseIcon = TrendingDown;
  protected readonly transactionIcon = ArrowLeftRight;

  // Services
  private readonly accountsService = inject(AccountsService);
  private readonly transactionsService = inject(TransactionsService);

  // Data
  protected readonly accounts = this.accountsService.getUserAccounts();
  protected readonly currency = this.accountsService.getDefaultCurrency();
  protected readonly transactions = this.transactionsService.getUserTransactions();

  // States
  protected readonly isDataLoading = computed(
    () => this.accounts.isLoading() || this.transactions.isLoading(),
  );

  // Computed
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
    return formatCurrency(revenue + expenses, this.currency, true, false);
  });

  protected readonly spendingRatio = computed<number>(() => {
    const expenses = this.totalExpenses();
    const total = this.totalRevenue() + this.totalExpenses();

    if (expenses <= 0 || total <= 0) return 0;

    const ratio = (expenses / total) * 100;

    return Math.min(100, Math.max(0, Math.round(ratio)));
  });

  // Methods
  protected formatCurrency(value: string) {
    return formatCurrency(Number(value), this.currency, true, false);
  }
}
