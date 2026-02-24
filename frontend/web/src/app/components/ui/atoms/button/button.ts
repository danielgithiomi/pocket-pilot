import { NgClass } from '@angular/common';
import { ButtonType, ButtonVariant } from './button.types';
import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'atom-button',
  standalone: true,
  template: `
    <button
      [type]="type()"
      [id]="prefixedId()"
      (click)="handleClick()"
      [class]="buttonClasses()"
      [disabled]="disabled() || isLoading()"
    >
      <!-- Loader Overlay -->
      @if (isLoading()) {
        <div class="absolute inset-0 grid place-items-center z-1" [class]="loaderOverlayClasses()">
          <div class="loader"></div>
        </div>
      }

      <!-- Label / Content -->
      <span class="relative z-0" [ngClass]="variant() == 'primary' ? 'text-white' : 'text-black'">
        @if (hasProjectedContent()) {
          <ng-content></ng-content>
        } @else {
          {{ label() }}
        }
      </span>
    </button>
  `,
  styleUrl: './button.css',
  imports: [NgClass],
})
export class Button {
  // =========================
  // Inputs (Signals API - Angular v21 style)
  // =========================
  label = input<string>('');
  id = input.required<string>();
  className = input<string>('');
  disabled = input<boolean>(false);
  isLoading = input<boolean>(false);
  type = input<ButtonType>('button');
  variant = input<ButtonVariant>('primary');

  // =========================
  // Outputs
  // =========================
  clicked = output<void>();

  // =========================
  // Computed Values
  // =========================
  prefixedId = computed(() => `btn-${this.id()}`);

  buttonClasses = computed(() => {
    const base = 'button overflow-hidden relative transition-all duration-250';

    const loadingClasses = this.isLoading() ? 'opacity-80 cursor-progress' : '';
    const variantClasses =
      this.variant() === 'primary' ? 'bg-primary' : 'bg-inverted-background text-white';
    const disabledClasses = this.disabled() ? 'opacity-80 cursor-not-allowed' : 'hover:scale-101';

    return [base, variantClasses, loadingClasses, disabledClasses, this.className()]
      .filter(Boolean)
      .join(' ');
  });

  loaderOverlayClasses = computed(() => {
    return this.variant() === 'primary' ? 'bg-primary' : 'bg-inverted-background';
  });

  // =========================
  // Methods
  // =========================
  handleClick(): void {
    if (this.disabled() || this.isLoading()) return;
    this.clicked.emit();
  }

  hasProjectedContent(): boolean {
    // Allows label OR ng-content (like React children)
    return false;
  }
}
