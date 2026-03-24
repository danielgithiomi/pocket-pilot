export function splitTransactionId(id: string): string {
  return id.split('-')[0];
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatFullDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}

export function formatCurrency(
  amount: number,
  currency: Intl.NumberFormatOptions['currency'],
  fractionDigits: number = 2,
  showSymbol: boolean = false,
  narrow: boolean = true
): string {
  return new Intl.NumberFormat('en-US', {
    currency: currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
    style: showSymbol ? 'currency' : 'decimal',
    currencyDisplay: narrow ? 'narrowSymbol' : 'code',
  }).format(amount);
}

export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
