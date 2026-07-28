import { Form } from '@organisms/form';
import { ToastService } from '@atoms/toast';
import { formatCurrency } from '@libs/utils';
import { RatioSlider } from '@atoms/ratio-slider';
import { ProgressBar } from '@atoms/progress-bar';
import { CostAnalysis } from '@widgets/cost-analysis';
import { AccountsService } from '@api/accounts.service';
import { DashboardCalendar } from './dashboard-calendar';
import { DrawerService } from '@infrastructure/services';
import { TransactionsStore } from '@stores/transactions.store';
import { TransactionsService } from '@api/transactions.service';
import { UpcomingBills } from './upcoming-bills/upcoming-bills';
import { Component, computed, inject, signal } from '@angular/core';
import { ChangedEventArgs } from '@syncfusion/ej2-angular-calendars';
import { DashboardCard } from '@structural/main/dashboard-card/dashboard-card';
import {
    Wallet,
    HandCoins,
    CirclePile,
    TrendingUp,
    CircleGauge,
    TrendingDown,
    ArrowLeftRight,
    BrickWallShield,
    LucideAngularModule
} from 'lucide-angular';

@Component({
    selector: 'app-dashboard',
    styleUrl: './dashboard.css',
    templateUrl: './dashboard.html',
    imports: [
        Form,
        RatioSlider,
        ProgressBar,
        CostAnalysis,
        UpcomingBills,
        DashboardCard,
        DashboardCalendar,
        LucideAngularModule
    ]
})
export class Dashboard {
    // Icons
    readonly iconSize: number = 16;
    protected readonly walletIcon = Wallet;
    protected readonly pilesIcon = CirclePile;
    protected readonly gaugeIcon = CircleGauge;
    protected readonly incomeIcon = TrendingUp;
    protected readonly handCoinsIcon = HandCoins;
    protected readonly expenseIcon = TrendingDown;
    protected readonly transactionIcon = ArrowLeftRight;
    protected readonly spendingLimitIcon = BrickWallShield;

    // Services
    private readonly toastService = inject(ToastService);
    protected readonly drawerService = inject(DrawerService);
    private readonly accountsService = inject(AccountsService);
    private readonly transactionsService = inject(TransactionsService);

    // STORES
    protected readonly transactionsStore = inject(TransactionsStore);

    // DATA
    protected readonly actualMonth = this.transactionsStore.actualMonth;
    protected readonly currency = this.accountsService.getDefaultCurrency();
    protected readonly currentAnalysisMonth = this.transactionsStore.currentMonth;
    protected readonly monthlySpendingLimit = this.accountsService.getMonthlySpendingLimit();
    protected readonly accounts = this.accountsService.getUserAccounts();
    protected readonly transactions = this.transactionsService.getUserTransactions();

    // States
    protected readonly isDateClickedModalOpen = signal<boolean>(false);

    // Computed
    protected readonly isDataLoading = computed(() => this.accounts.isLoading() || this.transactions.isLoading());

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
        return revenue - expenses;
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

    // METHODS
    protected onMonthChange(monthIndex: number) {
        this.transactionsStore.setCurrentMonth(monthIndex);
    }

    protected onSpendingLimitClick() {
        this.toastService.show({
            variant: 'info',
            title: 'Edit In Settings!',
            details: 'Please visit the settings page to edit your monthly spending limit.'
        });
    }

    protected handleOnDateClicked(event: ChangedEventArgs) {
        console.log(event);
        if (event.value) this.isDateClickedModalOpen.set(true);
    }

    protected handleOnDatePickerSubmit(event: Event) {
        event.preventDefault();

        console.log('Submitted form');
    }

    // HELPER FUNCTIONS
    protected formatCurrency(value: string) {
        return formatCurrency(Number(value), this.currency, 2, true, false);
    }
}
