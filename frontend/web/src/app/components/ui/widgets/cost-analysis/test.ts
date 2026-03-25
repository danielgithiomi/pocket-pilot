import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { SpendingCategory, CostAnalysisColors, CostAnalysis } from './cost-analysis';

/**
 * ============================================
 * COST ANALYSIS COMPONENT - USAGE EXAMPLES
 * ============================================
 *
 * A segmented progress bar component for displaying
 * spending breakdowns across multiple categories.
 *
 * ============================================
 * API REFERENCE
 * ============================================
 *
 * @input title: string (default: 'Cost analysis')
 *   - Card title text
 *
 * @input subtitle: string (default: 'Spending overview')
 *   - Card subtitle text
 *
 * @input categories: SpendingCategory[]
 *   - Array of spending categories with:
 *     - id: string (unique identifier)
 *     - label: string (display name)
 *     - amount: number (spent amount)
 *     - color: string (hex color for segment)
 *
 * @input currencySymbol: string (default: '$')
 *   - Currency symbol for formatting
 *
 * @input locale: string (default: 'en-US')
 *   - Locale for number formatting
 *
 * @input colors: Partial<CostAnalysisColors>
 *   - Customize all colors of the component
 *
 * @input showMonthSelector: boolean (default: true)
 *   - Whether to show month dropdown
 *
 * @input months: MonthOption[]
 *   - Available month options for dropdown
 *
 * @input selectedMonth: string (default: 'january')
 *   - Currently selected month value
 *
 * @input allowAnimation: boolean (default: true)
 *   - Enable/disable load animation
 *
 * @input animationDuration: number (default: 600)
 *   - Animation duration in milliseconds
 *
 * @output monthChange: EventEmitter<string>
 *   - Emitted when month selection changes
 *
 * ============================================
 */

@Component({
  selector: 'widget-cost-analysis-examples',
  standalone: true,
  imports: [CommonModule, CostAnalysis],
  template: `
    <div class="examples-container">
      <h1>Cost Analysis Component Examples</h1>

      <!-- Example 1: Default (matches reference image) -->
      <section class="example-section">
        <h2>Default - Reference Design</h2>
        <widget-cost-analysis totalMonthlySpending="100.00" (monthChange)="onMonthChange($event)" />
      </section>

      <!-- Example 2: Custom Categories -->
      <section class="example-section">
        <h2>Custom Categories</h2>
        <widget-cost-analysis
          totalMonthlySpending="100.00"
          title="Project Budget"
          subtitle="Q1 2024 allocation"
          [categories]="projectCategories"
          [showMonthSelector]="false"
        />
      </section>

      <!-- Example 3: Euro Currency -->
      <section class="example-section">
        <h2>Euro Currency</h2>
        <widget-cost-analysis
          totalMonthlySpending="100.00"
          title="Monthly Expenses"
          subtitle="European account"
          [categories]="euroCategories"
          currencySymbol="€"
          locale="de-DE"
          [showMonthSelector]="false"
        />
      </section>

      <!-- Example 4: Dark Theme -->
      <section class="example-section dark-bg">
        <h2>Dark Theme</h2>
        <widget-cost-analysis
          totalMonthlySpending="100.00"
          title="Cost analysis"
          subtitle="Dark mode view"
          [colors]="darkThemeColors"
          [showMonthSelector]="false"
        />
      </section>

      <!-- Example 5: Blue Theme -->
      <section class="example-section">
        <h2>Blue Theme</h2>
        <widget-cost-analysis
          totalMonthlySpending="100.00"
          title="Department Spending"
          subtitle="By team allocation"
          [categories]="blueCategories"
          [colors]="blueThemeColors"
          [showMonthSelector]="false"
        />
      </section>

      <!-- Example 6: Minimal (2 categories) -->
      <section class="example-section">
        <h2>Minimal - Two Categories</h2>
        <widget-cost-analysis
          totalMonthlySpending="100.00"
          title="Income vs Expenses"
          subtitle="Monthly comparison"
          [categories]="minimalCategories"
          [showMonthSelector]="false"
        />
      </section>

      <!-- Example 7: No Animation -->
      <section class="example-section">
        <h2>Animation Disabled</h2>
        <widget-cost-analysis
          totalMonthlySpending="100.00"
          title="Static View"
          subtitle="No load animation"
          [allowAnimation]="false"
          [showMonthSelector]="false"
        />
      </section>

      <!-- Example 8: With Month Change Handler -->
      <section class="example-section">
        <h2>Interactive Month Selector</h2>
        <widget-cost-analysis
          totalMonthlySpending="100.00"
          title="Monthly Overview"
          subtitle="Select a month"
          [selectedMonth]="currentMonth()"
          [categories]="getMonthlyData(currentMonth())"
          (monthChange)="updateMonth($event)"
        />
        <p class="selected-info">
          Selected: <strong>{{ currentMonth() | titlecase }}</strong>
        </p>
      </section>

      <!-- Example 9: Vertical Stack (Multiple Cards) -->
      <section class="example-section">
        <h2>Dashboard Layout</h2>
        <div class="dashboard-grid">
          <widget-cost-analysis
            totalMonthlySpending="100.00"
            title="Personal"
            subtitle="Monthly spending"
            [showMonthSelector]="false"
            [animationDuration]="800"
          />
          <widget-cost-analysis
            totalMonthlySpending="100.00"
            title="Business"
            subtitle="Operating costs"
            [categories]="businessCategories"
            [showMonthSelector]="false"
            [animationDuration]="1000"
          />
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .examples-container {
        padding: 2rem;
        max-width: 64rem;
        margin: 0 auto;
        font-family:
          system-ui,
          -apple-system,
          sans-serif;
      }

      h1 {
        font-size: 1.875rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 2rem;
      }

      .example-section {
        margin-bottom: 2.5rem;
        padding: 1.5rem;
        background: #f9fafb;
        border-radius: 0.75rem;
      }

      .example-section h2 {
        font-size: 1.125rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 1rem;
      }

      .dark-bg {
        background: #1f2937;
      }

      .dark-bg h2 {
        color: #f3f4f6;
      }

      .selected-info {
        margin-top: 1rem;
        font-size: 0.875rem;
        color: #6b7280;
      }

      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
        gap: 1.5rem;
      }
    `,
  ],
})
export class CostAnalysisExamplesComponent {
  readonly currentMonth = signal('january');

  // Custom project categories
  readonly projectCategories: SpendingCategory[] = [
    { id: 'development', label: 'Development', amount: 45000, color: '#3b82f6' },
    { id: 'design', label: 'Design', amount: 15000, color: '#8b5cf6' },
    { id: 'marketing', label: 'Marketing', amount: 20000, color: '#ec4899' },
    { id: 'infrastructure', label: 'Infrastructure', amount: 12000, color: '#14b8a6' },
    { id: 'misc', label: 'Miscellaneous', amount: 8000, color: '#6b7280' },
  ];

  // Euro categories
  readonly euroCategories: SpendingCategory[] = [
    { id: 'rent', label: 'Miete', amount: 1200, color: '#f59e0b' },
    { id: 'utilities', label: 'Nebenkosten', amount: 250, color: '#eab308' },
    { id: 'groceries', label: 'Lebensmittel', amount: 450, color: '#84cc16' },
    { id: 'transport', label: 'Transport', amount: 120, color: '#22c55e' },
    { id: 'entertainment', label: 'Unterhaltung', amount: 180, color: '#06b6d4' },
  ];

  // Blue themed categories
  readonly blueCategories: SpendingCategory[] = [
    { id: 'engineering', label: 'Engineering', amount: 85000, color: '#1e40af' },
    { id: 'product', label: 'Product', amount: 45000, color: '#2563eb' },
    { id: 'sales', label: 'Sales', amount: 55000, color: '#3b82f6' },
    { id: 'support', label: 'Support', amount: 25000, color: '#60a5fa' },
    { id: 'operations', label: 'Operations', amount: 30000, color: '#93c5fd' },
  ];

  // Minimal two-category setup
  readonly minimalCategories: SpendingCategory[] = [
    { id: 'income', label: 'Income', amount: 7500, color: '#22c55e' },
    { id: 'expenses', label: 'Expenses', amount: 4200, color: '#ef4444' },
  ];

  // Business categories
  readonly businessCategories: SpendingCategory[] = [
    { id: 'payroll', label: 'Payroll', amount: 120000, color: '#6366f1' },
    { id: 'office', label: 'Office', amount: 15000, color: '#8b5cf6' },
    { id: 'software', label: 'Software', amount: 8000, color: '#a855f7' },
    { id: 'travel', label: 'Travel', amount: 12000, color: '#c084fc' },
    { id: 'other', label: 'Other', amount: 5000, color: '#e9d5ff' },
  ];

  // Dark theme colors
  readonly darkThemeColors: Partial<CostAnalysisColors> = {
    cardBackground: '#1f2937',
    cardBorder: '#374151',
    titleColor: '#f9fafb',
    subtitleColor: '#9ca3af',
    totalColor: '#ffffff',
    legendTextColor: '#e5e7eb',
    percentageColor: '#9ca3af',
    dropdownBackground: '#374151',
    dropdownTextColor: '#f3f4f6',
    dropdownBorder: '#4b5563',
    trackBackground: '#374151',
  };

  // Blue theme colors
  readonly blueThemeColors: Partial<CostAnalysisColors> = {
    cardBackground: '#eff6ff',
    cardBorder: '#bfdbfe',
    titleColor: '#1e40af',
    subtitleColor: '#3b82f6',
    totalColor: '#1e3a8a',
    legendTextColor: '#1e40af',
    percentageColor: '#3b82f6',
  };

  // Simulated monthly data
  getMonthlyData(month: string): SpendingCategory[] {
    const multiplier = this.getMonthMultiplier(month);
    return [
      { id: 'housing', label: 'Housing', amount: Math.round(1521 * multiplier), color: '#f59e0b' },
      {
        id: 'debt',
        label: 'Debt payments',
        amount: Math.round(592 * multiplier),
        color: '#fbbf24',
      },
      { id: 'food', label: 'Food', amount: Math.round(507 * multiplier), color: '#facc15' },
      {
        id: 'transportation',
        label: 'Transportation',
        amount: Math.round(761 * multiplier),
        color: '#a3e635',
      },
      {
        id: 'healthcare',
        label: 'Healthcare',
        amount: Math.round(845 * multiplier),
        color: '#4ade80',
      },
      {
        id: 'investments',
        label: 'Investments',
        amount: Math.round(1437 * multiplier),
        color: '#22c55e',
      },
      { id: 'other', label: 'Other', amount: Math.round(2787 * multiplier), color: '#d1d5db' },
    ];
  }

  private getMonthMultiplier(month: string): number {
    const multipliers: Record<string, number> = {
      january: 1.0,
      february: 0.9,
      march: 1.1,
      april: 0.95,
      may: 1.05,
      june: 1.2,
      july: 1.15,
      august: 1.1,
      september: 0.85,
      october: 0.9,
      november: 1.3,
      december: 1.5,
    };
    return multipliers[month] || 1.0;
  }

  onMonthChange(month: string): void {
    console.log('Month changed:', month);
  }

  updateMonth(month: string): void {
    this.currentMonth.set(month);
  }
}
