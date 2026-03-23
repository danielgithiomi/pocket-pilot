import {
  input,
  signal,
  effect,
  computed,
  viewChild,
  Component,
  ElementRef,
  afterNextRender,
} from '@angular/core';

export interface RatioSliderColors {
  /** Start color of the progress/income gradient (default: cyan) */
  progressStartColor: string;
  /** End color of the progress/income gradient (default: blue) */
  progressEndColor: string;
  /** Start color of the track/expenses gradient (default: purple) */
  trackStartColor: string;
  /** End color of the track/expenses gradient (default: magenta) */
  trackEndColor: string;
  /** Card background gradient start (default: dark purple) */
  cardGradientStart: string;
  /** Card background gradient end (default: darker purple) */
  cardGradientEnd: string;
  /** Text color (default: white) */
  textColor: string;
  /** Secondary text color for labels (default: light gray) */
  secondaryTextColor: string;
}

export interface LegendItem {
  label: string;
  color: string;
}

const DEFAULT_COLORS: RatioSliderColors = {
  // Income gradient (foreground progress) - cyan to blue
  progressStartColor: '#00d4ff',
  progressEndColor: '#6290c8',
  // Expenses gradient (background track) - purple to magenta
  trackStartColor: '#6366f1',
  trackEndColor: '#b829dd',
  cardGradientStart: '#1e1b4b',
  cardGradientEnd: '#0f0a1e',
  textColor: 'var(--primary-text)',
  secondaryTextColor: 'var(--muted-text)',
};

@Component({
  selector: 'ratio-slider',
  template: `
    <div class="ratio-slider-card">
      <!-- SVG Circular Progress -->
      <div class="ratio-slider-container">
        <svg
          #svgElement
          [attr.viewBox]="'0 0 ' + svgSize() + ' ' + svgSize()"
          class="ratio-slider-svg"
        >
          <defs>
            <!-- Gradient for background track (Expenses) -->
            <linearGradient [id]="trackGradientId()" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" [attr.stop-color]="resolvedColors().trackStartColor" />
              <stop offset="100%" [attr.stop-color]="resolvedColors().trackEndColor" />
            </linearGradient>
            <!-- Gradient for progress arc (Income) -->
            <linearGradient [id]="gradientId()" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" [attr.stop-color]="resolvedColors().progressStartColor" />
              <stop offset="100%" [attr.stop-color]="resolvedColors().progressEndColor" />
            </linearGradient>
          </defs>

          <!-- Background track (Expenses) -->
          <circle
            [attr.cx]="center()"
            [attr.cy]="center()"
            [attr.r]="radius()"
            fill="none"
            [attr.stroke]="'url(#' + trackGradientId() + ')'"
            [attr.stroke-width]="strokeWidth()"
            stroke-linecap="round"
          />

          <!-- Progress arc -->
          <circle
            #progressCircle
            [attr.cx]="center()"
            [attr.cy]="center()"
            [attr.r]="radius()"
            fill="none"
            [attr.stroke]="'url(#' + gradientId() + ')'"
            [attr.stroke-width]="strokeWidth()"
            stroke-linecap="round"
            [attr.stroke-dasharray]="circumference()"
            [attr.stroke-dashoffset]="strokeDashoffset()"
            class="progress-circle"
            [style.transform-origin]="center() + 'px ' + center() + 'px'"
          />

          <!-- Ball indicator at the end of progress -->
          <circle
            #ballIndicator
            fill="white"
            [attr.r]="ballRadius()"
            class="ball-indicator"
            [attr.cx]="ballPosition().x"
            [attr.cy]="ballPosition().y"
            [class.visible]="animatedValue() > 0"
          />
        </svg>

        <!-- Center content -->
        <div class="ratio-slider-center">
          <span class="ratio-slider-value" [style.color]="resolvedColors().textColor">
            {{ animatedDisplayValue() }}%
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .ratio-slider-card {
        padding: 0.5rem;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 1rem;
      }

      .ratio-slider-title {
        font-size: 0.875rem;
        font-weight: 500;
        margin: 0;
        text-align: center;
        letter-spacing: 0.025em;
      }

      .ratio-slider-container {
        position: relative;
        width: 100%;
        max-width: 160px;
        aspect-ratio: 1;
        padding: 10px;
      }

      .ratio-slider-svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
      }

      .progress-circle {
        filter: drop-shadow(0 1px 2px black);
        transition: stroke-dashoffset 0.02s linear;
      }

      .ball-indicator {
        opacity: 0;
        transition: opacity 0.2s ease;
        filter: drop-shadow(0 0 2px black);
      }

      .ball-indicator.visible {
        opacity: 1;
      }

      .ratio-slider-center {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .ratio-slider-value {
        font-size: 2rem;
        font-weight: 600;
        letter-spacing: -0.025em;
      }

      .ratio-slider-legend {
        display: flex;
        gap: 1.5rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .legend-dot {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
      }

      .legend-label {
        font-size: 0.75rem;
      }
    `,
  ],
})
export class RatioSlider {
  // Input signals
  readonly value = input<number>(0);
  readonly title = input<string>('Ratio Income');
  readonly colors = input<Partial<RatioSliderColors>>({});
  readonly size = input<number>(160);
  readonly legendItems = input<LegendItem[]>([
    { label: 'Income', color: '#6366f1' },
    { label: 'Expenses', color: '#b829dd' },
  ]);
  readonly animationDuration = input<number>(1000);

  // View children
  readonly progressCircle = viewChild<ElementRef<SVGCircleElement>>('progressCircle');
  readonly ballIndicator = viewChild<ElementRef<SVGCircleElement>>('ballIndicator');

  // Internal signals
  private readonly instanceId = signal(Math.random().toString(36).substring(2, 9));
  readonly animatedValue = signal(0);
  readonly animatedDisplayValue = signal(0);

  // Computed values
  readonly resolvedColors = computed<RatioSliderColors>(() => ({
    ...DEFAULT_COLORS,
    ...this.colors(),
  }));

  readonly gradientId = computed(() => `progress-gradient-${this.instanceId()}`);
  readonly trackGradientId = computed(() => `track-gradient-${this.instanceId()}`);
  readonly svgSize = computed(() => this.size());
  readonly center = computed(() => this.svgSize() / 2);
  readonly strokeWidth = computed(() => this.svgSize() * 0.1);
  readonly radius = computed(() => (this.svgSize() - this.strokeWidth()) / 2 - 3);
  readonly circumference = computed(() => 2 * Math.PI * this.radius());
  readonly ballRadius = computed(() => this.strokeWidth() / 2 + 2);

  readonly strokeDashoffset = computed(() => {
    const progress = this.animatedValue() / 100;
    return this.circumference() * (1 - progress);
  });

  readonly ballPosition = computed(() => {
    const progress = this.animatedValue() / 100;
    // The SVG is rotated -90deg, so the stroke starts at the top (12 o'clock)
    // and progresses clockwise. The ball needs to follow the same coordinate system.
    // In the rotated SVG space, angle 0 is at the right (3 o'clock in normal coords)
    // so progress * 2π gives us the arc angle in the rotated space.
    const angle = progress * 2 * Math.PI;
    // Since SVG is rotated -90deg, we calculate in the original coordinate space
    // then the rotation handles the visual positioning
    const x = this.center() + this.radius() * Math.cos(angle);
    const y = this.center() + this.radius() * Math.sin(angle);
    return { x, y };
  });

  readonly cardBackground = computed(() => {
    const colors = this.resolvedColors();
    return `linear-gradient(135deg, ${colors.cardGradientStart} 0%, ${colors.cardGradientEnd} 100%)`;
  });

  private animationFrameId: number | null = null;

  constructor() {
    // Effect to animate when value changes
    effect(() => {
      const targetValue = Math.min(100, Math.max(0, this.value()));
      this.animateToValue(targetValue);
    });

    // Cleanup on destroy
    afterNextRender(() => {
      return () => {
        if (this.animationFrameId !== null) {
          cancelAnimationFrame(this.animationFrameId);
        }
      };
    });
  }

  private animateToValue(targetValue: number): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const startValue = this.animatedValue();
    const startTime = performance.now();
    const duration = this.animationDuration();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      const currentValue = startValue + (targetValue - startValue) * easeOutCubic;
      this.animatedValue.set(currentValue);
      this.animatedDisplayValue.set(Math.round(currentValue));

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        this.animatedValue.set(targetValue);
        this.animatedDisplayValue.set(Math.round(targetValue));
        this.animationFrameId = null;
      }
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }
}
