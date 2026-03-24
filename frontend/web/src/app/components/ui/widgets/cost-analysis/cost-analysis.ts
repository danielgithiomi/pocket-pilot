import { MonthOption } from '@global/types';
import { DEFAULT_MONTHS } from '@global/constants';
import { Component, computed, effect, input, output, signal } from '@angular/core';

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
        {{ totalMonthlySpending() }}
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
  readonly totalMonthlySpending = input.required<string>();
  readonly categories = input<SpendingCategory[]>(DEFAULT_CATEGORIES);

  /** Currency symbol */
  readonly currencySymbol = input<string>('$');

  /** Locale for number formatting */
  readonly locale = input<string>('en-US');

  /** Custom color configuration */
  readonly colors = input<Partial<CostAnalysisColors>>({});

  /** Whether to show month selector dropdown */
  readonly showMonthSelector = input<boolean>(true);

  /** Available month options */
  readonly months = input<MonthOption[]>(DEFAULT_MONTHS);

  /** Currently selected month value */
  readonly selectedMonth = input<string>('january');

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

  /** Merge provided colors with defaults */
  readonly resolvedColors = computed(
    (): CostAnalysisColors => ({
      ...DEFAULT_COLORS,
      ...this.colors(),
    }),
  );

  /** Calculate total amount from all categories */
  readonly totalAmount = computed(() => {
    return this.categories().reduce((sum, cat) => sum + cat.amount, 0);
  });

  /** Format total as currency string */
  readonly formattedTotal = computed(() => {
    const total = this.totalAmount();
    const formatted = total.toLocaleString(this.locale(), {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `${this.currencySymbol()}${formatted}`;
  });

  /** Calculate percentage for each category */
  readonly categoriesWithPercentage = computed(() => {
    const total = this.totalAmount();
    if (total === 0) return [];

    return this.categories().map((cat) => ({
      ...cat,
      percentage: Math.round((cat.amount / total) * 100),
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
}
