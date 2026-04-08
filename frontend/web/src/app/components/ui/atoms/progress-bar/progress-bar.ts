import { formatCurrency } from '@libs/utils';
import { CommonModule } from '@angular/common';
import { AccountsService } from '@api/accounts.service';
import { LucideAngularModule, Pencil } from 'lucide-angular';
import { SpendingProgressBarColors, DEFAULT_COLORS, Variant } from './progress-bar.types';
import { Component, computed, effect, input, signal, inject, output } from '@angular/core';

@Component({
  selector: 'atom-progress-bar',
  styleUrl: './progress-bar.css',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div [id]="id()" class="spending-card" [class.vertical]="variant() === 'vertical'">
      <div class="progress-container" [class.vertical]="variant() === 'vertical'">
        <div
          class="progress-track"
          [style.--stripe-color]="resolvedColors().stripeColor"
          [style.background-color]="resolvedColors().trackColor"
          [style.--fill-color]="isExceeded() ? resolvedColors().exceededColor : resolvedColors().fillColor"
          [style.--border-color]="isExceeded() ? resolvedColors().exceededColor : resolvedColors().fillColor"
        >
          <div
            class="progress-fill"
            [class.vertical]="variant() === 'vertical'"
            [style.--progress]="animatedPercentage() + '%'"
          >
            <div class="stripe-pattern"></div>
          </div>

          @if (showPercentage()) {
            <div class="percentage-badge" [class.vertical]="variant() === 'vertical'">
              {{ animatedPercentage() | number: '1.0-0' }}%
            </div>
          }
        </div>

        @if (showValueLabels()) {
          <div class="value-labels" [class.vertical]="variant() === 'vertical'">
            <span class="current-value"
              >At:<span
                [ngClass]="{ 'group-hover:text-error!': isExceeded() }"
                class="group-hover:text-primary font-bold transition-all duration-200"
                >{{ formattedCurrentValue() }}</span
              ></span
            >
            <span class="max-value">{{ formattedMaxValue() }}</span>
          </div>
        }
      </div>

      @if (showEditIcon()) {
        <button (click)="this.editClick.emit()" aria-label="Edit spending limit">
          <lucide-angular
            size="18"
            [img]="editIcon"
            name="edit-limit"
            class="edit-icon"
            [ngClass]="{ 'hover:text-error!': isExceeded() }"
          />
        </button>
      }
    </div>
  `,
})
export class ProgressBar {
  // Input
  readonly id = input.required<string>();
  readonly maxValue = input.required<number>();
  readonly showEditIcon = input<boolean>(true);
  readonly allowAnimation = input<boolean>(true);
  readonly showPercentage = input<boolean>(false);
  readonly showValueLabels = input<boolean>(true);
  readonly variant = input<Variant>('horizontal');
  readonly animationDuration = input<number>(600);
  readonly currentValue = input.required<number>();
  readonly colors = input<Partial<SpendingProgressBarColors>>({});

  // Outputs
  readonly editClick = output<void>();

  // Services
  private readonly accountService = inject(AccountsService);

  // Data
  private readonly currency = this.accountService.getDefaultCurrency();

  // State
  private _hasInitialized = false;
  protected readonly editIcon = Pencil;
  private readonly _animatedPercentage = signal(0);

  // Computed
  protected readonly isExceeded = computed(() => this.currentValue() > this.maxValue());
  readonly resolvedColors = computed<SpendingProgressBarColors>(() => ({
    ...DEFAULT_COLORS,
    ...this.colors(),
  }));

  readonly percentage = computed(() => {
    const max = this.maxValue();
    const current = this.currentValue();
    if (max <= 0) return 0;
    return Math.min(Math.max((current / max) * 100, 0), 100);
  });

  readonly animatedPercentage = computed(() => this._animatedPercentage());

  readonly formattedCurrentValue = computed(() =>
    formatCurrency(this.currentValue(), this.currency, 0, true),
  );

  readonly formattedMaxValue = computed(() =>
    formatCurrency(this.maxValue(), this.currency, 0, true),
  );

  constructor() {
    effect(() => {
      const targetPercentage = this.percentage();
      const duration = this.animationDuration();
      const animate = this.allowAnimation();

      if (!animate) {
        this._animatedPercentage.set(targetPercentage);
        return;
      }

      if (!this._hasInitialized) {
        this._hasInitialized = true;
        this._animatedPercentage.set(0);
        requestAnimationFrame(() => {
          this.animateToValue(0, targetPercentage, duration);
        });
      } else {
        const current = this._animatedPercentage();
        this.animateToValue(current, targetPercentage, duration);
      }
    });
  }

  // Methods
  private animateToValue(start: number, target: number, duration: number): void {
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * eased;

      this._animatedPercentage.set(Math.round(current * 10) / 10);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this._animatedPercentage.set(target);
      }
    };

    requestAnimationFrame(animate);
  }
}
