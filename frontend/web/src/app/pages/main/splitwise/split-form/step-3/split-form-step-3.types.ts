export const PAYMENT_OPTIONS = [ "one", "equal", "custom"] as const;

export type PaymentOption = (typeof PAYMENT_OPTIONS)[number];

export const PAYMENT_OPTIONS_MAP: Record<PaymentOption, string> = {
  one: 'Paid by one',
  equal: 'Split equally',
  custom: 'Custom payment',
};