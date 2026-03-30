import { MonthOption } from '@global/types';
import { DEFAULT_MONTHS } from '@global/constants';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { formatCurrency } from '@libs/utils';
import { AccountsService } from '@api/accounts.service';
import { CategoriesService } from '@api/categories.service';
import { CostAnalysisCategory } from './cost-analysis.types';
import { TransactionsService } from '@api/transactions.service';

/**
 * Represents a single spending category
 */
export interface SpendingCategory {
  /** Category identifier */
  id: string;
  /** Display label for the category */
  label: string;
  /** Amount spent in this category */
  amount: number;
  /** Color for this category segment */
  color: string;
}

/**
 * Color configuration for the component
 */
export interface CostAnalysisColors {
  /** Card background color */
  cardBackground: string;
  /** Card border color */
  cardBorder: string;
  /** Title text color */
  titleColor: string;
  /** Subtitle text color */
  subtitleColor: string;
  /** Total amount text color */
  totalColor: string;
  /** Legend text color */
  legendTextColor: string;
  /** Percentage text color */
  percentageColor: string;
  /** Dropdown background color */
  dropdownBackground: string;
  /** Dropdown text color */
  dropdownTextColor: string;
  /** Dropdown border color */
  dropdownBorder: string;
  /** Track background (for empty space) */
  trackBackground: string;
}

/**
 * Month option for the dropdown
 */

const DEFAULT_COLORS: CostAnalysisColors = {
  cardBackground: '#ffffff',
  cardBorder: '#e5e7eb',
  titleColor: '#1f2937',
  subtitleColor: '#6b7280',
  totalColor: '#1f2937',
  legendTextColor: '#374151',
  percentageColor: '#6b7280',
  dropdownBackground: '#ffffff',
  dropdownTextColor: '#374151',
  dropdownBorder: '#e5e7eb',
  trackBackground: '#f3f4f6',
};

const DEFAULT_CATEGORIES: SpendingCategory[] = [
  { id: 'housing', label: 'Housing', amount: 1521, color: '#f59e0b' },
  { id: 'debt', label: 'Debt payments', amount: 592, color: '#fbbf24' },
  { id: 'food', label: 'Food', amount: 507, color: '#facc15' },
  { id: 'transportation', label: 'Transportation', amount: 761, color: '#a3e635' },
  { id: 'healthcare', label: 'Healthcare', amount: 845, color: '#4ade80' },
  { id: 'investments', label: 'Investments', amount: 1437, color: '#22c55e' },
  { id: 'other', label: 'Other', amount: 2787, color: '#d1d5db' },
];

const COLOR_MAP: string[] = [
  '#f59e0b',
  '#fbbf24',
  '#facc15',
  '#a3e635',
  '#4ade80',
  '#22c55e',
  '#d1d5db',
];

@Component({
  selector: 'widget-cost-analysis',
  styleUrl: './cost-analysis.css',
  template: `
    <div
      class="cost-analysis-card"
      [style.--card-bg]="resolvedColors().cardBackground"
      [style.--card-border]="resolvedColors().cardBorder"
      [style.--title-color]="resolvedColors().titleColor"
      [style.--subtitle-color]="resolvedColors().subtitleColor"
      [style.--total-color]="resolvedColors().totalColor"
      [style.--legend-text]="resolvedColors().legendTextColor"
      [style.--percentage-color]="resolvedColors().percentageColor"
      [style.--dropdown-bg]="resolvedColors().dropdownBackground"
      [style.--dropdown-text]="resolvedColors().dropdownTextColor"
      [style.--dropdown-border]="resolvedColors().dropdownBorder"
      [style.--track-bg]="resolvedColors().trackBackground"
    >
      <!-- Header -->
      @if (showMonthSelector()) {
        <div class="header">
          <div class="dropdown-wrapper">
            <select
              class="month-dropdown"
              [value]="selectedMonth()"
              (change)="onMonthChange($event)"
              id="cost-analysis-month-selector"
            >
              @for (month of months(); track month.value) {
                <option [value]="month.value">{{ month.label }}</option>
              }
            </select>
            <svg class="dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M3 4.5L6 7.5L9 4.5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      }

      <!-- Total Amount -->
      <div class="total-amount">
        {{ formattedTotalSpending() }}
      </div>

      <!-- Segmented Progress Bar -->
      <div class="progress-track">
        @for (segment of animatedSegments(); track segment.id; let i = $index) {
          <div
            class="progress-segment"
            [class.first]="i === 0"
            [style.--segment-color]="segment.color"
            [style.width.%]="segment.animatedPercentage"
            [class.last]="i === animatedSegments().length - 1"
          >
            <div class="stripe-pattern"></div>
          </div>
        }
      </div>

      <!-- Legend -->
      <div class="legend">
        @for (category of categoriesWithPercentage(); track category.id) {
          <div class="legend-item">
            <div class="legend-left">
              <span class="legend-color" [style.background-color]="category.color"></span>
              <span class="legend-label">{{ category.label }}</span>
            </div>
            <span class="legend-percentage">{{ category.percentage }}%</span>
          </div>
        }
      </div>
    </div>
  `,
})
export class CostAnalysis {
  // Inputs
  readonly totalMonthlySpending = input.required<number>();
  // readonly categories = input<SpendingCategory[]>(DEFAULT_CATEGORIES);

  /** Custom color configuration */
  readonly colors = input<Partial<CostAnalysisColors>>({});

  /** Whether to show month selector dropdown */
  readonly showMonthSelector = input<boolean>(true);

  /** Available month options */
  readonly months = input<MonthOption[]>(DEFAULT_MONTHS);

  /** Currently selected month value */
  private readonly _currentMonth = new Date().getMonth();
  readonly selectedMonth = input<string>(DEFAULT_MONTHS[this._currentMonth].value);

  /** Whether to animate on load */
  readonly allowAnimation = input<boolean>(true);

  /** Animation duration in milliseconds */
  readonly animationDuration = input<number>(600);

  // ====== Outputs ======

  /** Emitted when month selection changes */
  readonly monthChange = output<string>();

  // ====== Private State ======

  private readonly _animatedPercentages = signal<Map<string, number>>(new Map());
  private _hasInitialized = false;

  // ====== Computed Values ======
  protected readonly formattedTotalSpending = computed(() => {
    return this.formatCurrency(this.totalMonthlySpending().toString());
  });

  /** Merge provided colors with defaults */
  readonly resolvedColors = computed(
    (): CostAnalysisColors => ({
      ...DEFAULT_COLORS,
      ...this.colors(),
    }),
  );

  // SERVICES
  private readonly accountsService = inject(AccountsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly transactionsService = inject(TransactionsService);

  // DATA
  private readonly currency = this.accountsService.getDefaultCurrency();
  private readonly categoriesFromService = this.categoriesService.getUserCategories();
  private readonly transactionsFromService = this.transactionsService.getUserTransactions();

  // COMPUTED
  protected readonly loading = computed(() => this.categoriesFromService.isLoading());

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

  /** Calculate percentage for each category based on transaction amounts */
  readonly costAnalysisCategories = computed<CostAnalysisCategory[]>(() => {
    const total = this.totalMonthlySpending();
    if (total === 0) return [];

    const transactions = this.transactions();
    const categories = this.categories();

    // Group transactions by category and calculate totals
    const categoryTotals = new Map<string, number>();

    transactions.forEach((transaction) => {
      if (transaction.type === 'EXPENSE') {
        const currentTotal = categoryTotals.get(transaction.category) || 0;
        categoryTotals.set(transaction.category, currentTotal + transaction.amount);
      }
    });

    // Create category analysis with percentages
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
      .sort((a, b) => b.percentage - a.percentage);

    return categoryAnalysis;
  });

  /** Get categories with percentage for UI rendering (compatible with existing template) */
  readonly categoriesWithPercentage = computed(() => {
    return this.costAnalysisCategories().map((category, index) => ({
      id: category.categoryName,
      label: category.categoryName,
      color: category.color,
      percentage: category.percentage,
    }));
  });

  /** Get animated segment data for rendering */
  readonly animatedSegments = computed(() => {
    const percentages = this._animatedPercentages();
    return this.categoriesWithPercentage().map((cat) => ({
      ...cat,
      animatedPercentage: percentages.get(cat.id) ?? 0,
    }));
  });

  constructor() {
    // console.log("Current month:", this.selectedMonth());
    // Animate percentages when categories change
    effect(() => {
      const categories = this.categoriesWithPercentage();
      const animate = this.allowAnimation();
      const duration = this.animationDuration();

      if (!animate) {
        // No animation - set values immediately
        const percentages = new Map<string, number>();
        categories.forEach((cat) => {
          percentages.set(cat.id, cat.percentage);
        });
        this._animatedPercentages.set(percentages);
        return;
      }

      if (!this._hasInitialized) {
        // First load - animate from 0 to target
        this._hasInitialized = true;
        const initialPercentages = new Map<string, number>();
        categories.forEach((cat) => {
          initialPercentages.set(cat.id, 0);
        });
        this._animatedPercentages.set(initialPercentages);

        // Small delay to ensure initial 0 state renders
        requestAnimationFrame(() => {
          this.animateSegments(categories, duration);
        });
      } else {
        // Subsequent changes - animate to new values
        this.animateSegments(categories, duration);
      }
    });
  }

  /** Handle month dropdown change */
  onMonthChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.monthChange.emit(select.value);
  }

  /** Animate segments from current to target percentages */
  private animateSegments(
    categories: Array<{ id: string; percentage: number }>,
    duration: number,
  ): void {
    const startPercentages = new Map(this._animatedPercentages());
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
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
        // Ensure final values are exact
        const finalPercentages = new Map<string, number>();
        categories.forEach((cat) => {
          finalPercentages.set(cat.id, cat.percentage);
        });
        this._animatedPercentages.set(finalPercentages);
      }
    };

    requestAnimationFrame(animate);
  }

  // Helper Methods
  protected formatCurrency(value: string) {
    return formatCurrency(Number(value), this.currency, 2, true, false);
  }
}
