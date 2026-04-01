export interface SpendingProgressBarColors {
  fillColor: string;
  trackColor: string;
  stripeColor: string;
  exceededColor: string;
}

export const DEFAULT_COLORS: SpendingProgressBarColors = {
  fillColor: 'var(--primary)',
  exceededColor: 'var(--expense)',
  trackColor: 'var(--body-background)',
  stripeColor: 'var(--alternate-background)',
};

export type Variant = 'horizontal' | 'vertical';
