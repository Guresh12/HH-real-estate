export function formatKES(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function parseKES(value: string): number {
  const numStr = value.replace(/[^0-9]/g, '');
  return parseInt(numStr, 10) || 0;
}
