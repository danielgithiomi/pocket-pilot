import { formatCurrency } from '@libs/utils';
import { MONTHS_ENUM } from '@global/constants';
import { normalizeCategoryName } from '@global/utils';
import { AccountsService } from '@api/accounts.service';
import { CategoriesService } from '@api/categories.service';
import { TransactionsService } from '@api/transactions.service';
import { COLOR_MAP, CostAnalysisCategory } from './cost-analysis.types';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';

@Component({
  styleUrl: './cost-analysis.css',
  selector: 'widget-cost-analysis',
  templateUrl: './cost-analysis.html',
})
export class CostAnalysis {
  // INPUTS
  readonly currentMonth = input.required<string>();
  readonly totalMonthlySpending = input.required<number>();
  protected readonly allowAnimation = input<boolean>(true);
  protected readonly animationDuration = input<number>(500);
  protected readonly showMonthSelector = input<boolean>(true);

  // OUTPUTS
  protected readonly monthChange = output<string>();

  // STATES
  private _hasInitialized = false;
  private readonly _animatedPercentages = signal<Map<string, number>>(new Map());

  // SERVICES
  private readonly accountsService = inject(AccountsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly transactionsService = inject(TransactionsService);

  // DATA
  protected readonly months = MONTHS_ENUM;
  private readonly currency = this.accountsService.getDefaultCurrency();
  private readonly categoriesFromService = this.categoriesService.getUserCategories();
  private readonly transactionsFromService = this.transactionsService.getUserTransactions();

  // COMPUTED
  protected readonly loading = computed(() => this.categoriesFromService.isLoading());

  protected readonly formattedTotalSpending = computed(() =>
    this.formatCurrency(this.totalMonthlySpending().toString()),
  );

  protected readonly categories = computed(() => {
    const response = this.categoriesFromService.value()?.data;
    if (!response) return [];
    const { incomes, expenses } = response;
    return [...incomes, ...expenses];
  });

  protected readonly transactions = computed(() => {
    const transactions = this.transactionsFromService.value()?.data.data;
    if (!transactions) return [];
    return transactions;
  });

  readonly costAnalysisCategories = computed<CostAnalysisCategory[]>(() => {
    const total = this.totalMonthlySpending();
    if (total === 0) return [];

    const categories = this.categories();
    const transactions = this.transactions();

    const categoryTotals = new Map<string, number>();

    transactions.forEach((transaction) => {
      if (transaction.type === 'EXPENSE') {
        const normalizedCategoryName = normalizeCategoryName(transaction.category);
        const currentTotal = categoryTotals.get(normalizedCategoryName) || 0;
        categoryTotals.set(normalizedCategoryName, currentTotal + transaction.amount);
      }
    });

    const categoryAnalysis = categories
      .filter((categoryName) => categoryTotals.has(categoryName))
      .slice(0, 6)
      .map((categoryName, index) => {
        const categoryTotal = categoryTotals.get(categoryName) || 0;
        return {
          categoryName,
          color: COLOR_MAP[index],
          percentage: Math.round((categoryTotal / total) * 100),
        };
      })
      .filter((category) => category.percentage > 0)
      .sort((a, b) => b.percentage - a.percentage); // sort in descending order

    return categoryAnalysis;
  });

  readonly categoriesWithPercentage = computed(() => {
    return this.costAnalysisCategories().map((category, _index) => ({
      id: category.categoryName,
      label: category.categoryName,
      color: category.color,
      percentage: category.percentage,
    }));
  });

  readonly animatedSegments = computed(() => {
    const percentages = this._animatedPercentages();
    return this.categoriesWithPercentage().map((cat) => ({
      ...cat,
      animatedPercentage: percentages.get(cat.id) ?? 0,
    }));
  });

  constructor() {
    effect(() => {
      const animate = this.allowAnimation();
      const duration = this.animationDuration();
      const categories = this.categoriesWithPercentage();

      if (!animate) {
        const percentages = new Map<string, number>();
        categories.forEach((cat) => {
          percentages.set(cat.id, cat.percentage);
        });
        this._animatedPercentages.set(percentages);
        return;
      }

      if (!this._hasInitialized) {
        this._hasInitialized = true;
        const initialPercentages = new Map<string, number>();
        categories.forEach((cat) => {
          initialPercentages.set(cat.id, 0);
        });
        this._animatedPercentages.set(initialPercentages);

        requestAnimationFrame(() => {
          this.animateSegments(categories, duration);
        });
      } else {
        this.animateSegments(categories, duration);
      }
    });
  }

  onMonthChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.monthChange.emit(select.value);
  }

  private animateSegments(
    categories: Array<{ id: string; percentage: number }>,
    duration: number,
  ): void {
    const startPercentages = new Map(this._animatedPercentages());
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      const newPercentages = new Map<string, number>();
      categories.forEach((cat) => {
        const start = startPercentages.get(cat.id) ?? 0;
        const current = start + (cat.percentage - start) * eased;
        newPercentages.set(cat.id, Math.round(current * 10) / 10);
      });

      this._animatedPercentages.set(newPercentages);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        const finalPercentages = new Map<string, number>();
        categories.forEach((cat) => {
          finalPercentages.set(cat.id, cat.percentage);
        });
        this._animatedPercentages.set(finalPercentages);
      }
    };

    requestAnimationFrame(animate);
  }

  // HELPER METHODS
  protected formatCurrency(value: string) {
    return formatCurrency(Number(value), this.currency, 2, true, false);
  }
}
