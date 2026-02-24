import { ButtonType } from './button.types';
import { Component, computed, input, output } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary';

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
      <span class="relative z-0">
        @if (hasProjectedContent()) {
          <ng-content></ng-content>
        } @else {
          {{ label() }}
        }
      </span>
    </button>
  `,
  styleUrl: './button.css',
})
export class Button {
  // =========================
  // Inputs (Signals API - Angular v21 style)
  // =========================
  id = input.required<string>();
  label = input<string>('');
  type = input<ButtonType>('button');
  variant = input<ButtonVariant>('primary');
  isLoading = input<boolean>(false);
  disabled = input<boolean>(false);
  className = input<string>('');

  // =========================
  // Outputs
  // =========================
  clicked = output<void>();

  // =========================
  // Computed Values
  // =========================
  prefixedId = computed(() => `btn-${this.id()}`);

  buttonClasses = computed(() => {
    const base = 'button overflow-hidden relative transition-all duration-200';

    const variantClasses = this.variant() === 'primary' ? 'bg-primary' : 'bg-inverted-background';

    const loadingClasses = this.isLoading() ? 'opacity-85 cursor-progress' : '';

    const disabledClasses = this.disabled() ? 'opacity-85 cursor-not-allowed' : 'hover:scale-101';

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
