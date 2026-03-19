import { formatCurrency } from '@libs/utils';
import { AccountsService } from '@api/accounts.service';
import { Component, computed, inject } from '@angular/core';
import { TransactionsService } from '@api/transactions.service';
import {
  LucideAngularModule,
  Wallet,
  Move3d,
  HandCoins,
  TrendingDown,
  TrendingUp,
} from 'lucide-angular';
import { DashboardCard } from '@components/structural/main/dashboard-card/dashboard-card';

@Component({
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
  imports: [DashboardCard, LucideAngularModule],
})
export class Dashboard {
  // Icons
  protected readonly walletIcon = Wallet;
  protected readonly incomeIcon = TrendingUp;
  protected readonly transactionIcon = Move3d;
  protected readonly handCoinsIcon = HandCoins;
  protected readonly expenseIcon = TrendingDown;

  // Services
  private readonly accountsService = inject(AccountsService);
  private readonly transactionsService = inject(TransactionsService);

  // Data
  protected readonly accounts = this.accountsService.getUserAccounts();
  protected readonly transactions = this.transactionsService.getUserTransactions();

  // States
  protected readonly isDataLoading = computed(
    () => this.accounts.isLoading() || this.transactions.isLoading(),
  );

  // Computed
  protected readonly accountsCount = computed(() =>
    (this.accounts.value()?.data.count ?? 0).toString(),
  );

  protected readonly transactionsCount = computed(() =>
    (this.transactions.value()?.data.count ?? 0).toString(),
  );

  protected readonly totalBalance = computed(() => {
    const accounts = this.accounts.value()?.data.data;
    if (!accounts) return '0';
    return accounts.reduce((total, account) => total + account.balance, 0).toString();
  });

  protected readonly totalIncome = computed(() => {
    const transactions = this.transactions.value()?.data.data;
    if (!transactions) return '0';
    return transactions
      .filter((transaction) => transaction.type === 'INCOME')
      .reduce((total, transaction) => total + transaction.amount, 0)
      .toString();
  });

  protected readonly totalExpenses = computed(() => {
    const transactions = this.transactions.value()?.data.data;
    if (!transactions) return '0';
    return transactions
      .filter((transaction) => transaction.type === 'EXPENSE')
      .reduce((total, transaction) => total + transaction.amount, 0)
      .toString();
  });

  protected readonly netCashFlow = computed(() => {
    const income = Number(this.totalIncome());
    const expenses = Number(this.totalExpenses());
    return formatCurrency(income + expenses);
  });

  // Methods
  protected formatCurrency(value: string) {
    return formatCurrency(Number(value));
  }
}
