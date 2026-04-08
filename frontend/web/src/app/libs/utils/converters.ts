export function convertDaysToYearsAndMonths(days: number): string {
  if (days < 30) return `${days} days`;

  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} months`;
  }

  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  return `${years} yrs ${months} months`;
}
