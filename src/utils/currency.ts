import { Currency } from '../types/finance';

export function formatCurrency(amount: number, currency: Currency): string {
  if (currency === 'USD') {
    const val = amount / 84;
    return `$${val >= 1000 ? Math.round(val).toLocaleString() : val.toFixed(val % 1 === 0 ? 0 : 1)}`;
  }
  if (currency === 'EUR') {
    const val = amount / 90;
    return `€${val >= 1000 ? Math.round(val).toLocaleString() : val.toFixed(val % 1 === 0 ? 0 : 1)}`;
  }
  // Default INR
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatCompact(amount: number, currency: Currency): string {
  if (currency === 'USD') {
    const val = amount / 84;
    return `$${(val / 1000).toFixed(1)}k`;
  }
  if (currency === 'EUR') {
    const val = amount / 90;
    return `€${(val / 1000).toFixed(1)}k`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }
  return `₹${amount}`;
}
