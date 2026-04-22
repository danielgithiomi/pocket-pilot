import { NgClass } from '@angular/common';
import { ToastService } from '@atoms/toast';
import { formatCurrency } from '@libs/utils';
import { MONTHS_ENUM } from '@global/constants';
import { RatioSlider } from '@atoms/ratio-slider';
import { ProgressBar } from '@atoms/progress-bar';
import { CostAnalysis } from '@widgets/cost-analysis';
import { AccountsService } from '@api/accounts.service';
import { DrawerService } from '@infrastructure/services';
import { TransactionsService } from '@api/transactions.service';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { DashboardCard } from '@structural/main/dashboard-card/dashboard-card';
import {
  Wallet,
  HandCoins,
  PiggyBank,
  Calendar1,
  CirclePile,
  TrendingUp,
  CircleGauge,
  TrendingDown,
  ArrowLeftRight,
  BrickWallShield,
  LucideAngularModule,
} from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
  imports: [
    NgClass,
    RatioSlider,
    ProgressBar,
    CostAnalysis,
    DashboardCard,
    CalendarModule,
    LucideAngularModule,
  ],
})
export class Dashboard {
  // Icons
  protected readonly walletIcon = Wallet;
  protected readonly ratioIcon = PiggyBank;
  protected readonly pilesIcon = CirclePile;
  protected readonly gaugeIcon = CircleGauge;
  protected readonly incomeIcon = TrendingUp;
  protected readonly calendarIcon = Calendar1;
  protected readonly handCoinsIcon = HandCoins;
  protected readonly expenseIcon = TrendingDown;
  protected readonly transactionIcon = ArrowLeftRight;
  protected readonly spendingLimitIcon = BrickWallShield;

  // Services
  private readonly toastService = inject(ToastService);
  protected readonly drawerService = inject(DrawerService);
  private readonly accountsService = inject(AccountsService);
  private readonly transactionsService = inject(TransactionsService);

  // Data
  protected readonly minDate = new Date();
  protected readonly currentMonthIndex = new Date().getMonth();
  protected readonly accounts = this.accountsService.getUserAccounts();
  protected readonly currency = this.accountsService.getDefaultCurrency();
  protected readonly actualMonth = MONTHS_ENUM[this.currentMonthIndex].value;
  protected readonly transactions = this.transactionsService.getUserTransactions();
  protected readonly monthlySpendingLimit = this.accountsService.getMonthlySpendingLimit();

  // States
  protected readonly currentMonth = signal<string>(this.actualMonth);

  // Computed
  protected readonly isDataLoading = computed(
    () => this.accounts.isLoading() || this.transactions.isLoading(),
  );

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

  // Methods
  protected onMonthChange(month: string) {
    console.log('Month changed:', month);
    this.currentMonth.set(month);
  }

  protected onSpendingLimitClick() {
    this.toastService.show({
      variant: 'info',
      title: 'Edit In Settings!',
      details: 'Please visit the settings page to edit your monthly spending limit.',
    });
  }

  // Helper Methods
  protected formatCurrency(value: string) {
    return formatCurrency(Number(value), this.currency, 2, true, false);
  }
}
