export interface SpendingProgressBarColors {
  /** Fill color for the progress bar (default: '#a3e635' - lime green) */
  fillColor: string;
  /** Stripe color overlay (default: 'rgba(255,255,255,0.3)') */
  stripeColor: string;
  /** Background track color (default: '#e5e7eb' - gray-200) */
  trackColor: string;
  /** Color when exceeded (default: '#ef4444' - red) */
  exceededColor: string;
}

export const DEFAULT_COLORS: SpendingProgressBarColors = {
  fillColor: 'var(--primary)',
  exceededColor: 'var(--expense)',
  trackColor: 'var(--body-background)',
  stripeColor: 'var(--alternate-background)',
};

export type Variant = 'horizontal' | 'vertical';
