import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
  };
  return new Intl.NumberFormat('en-IN', options).format(amount);
}

export function formatDuration(totalMonths: number) {
  const years = Number(Number(totalMonths / 12).toFixed());
  const months = totalMonths % 12;
  const yearsText = years
    ? `${Number(years).toFixed()} year${years > 1 ? 's' : ''}`
    : null;
  const monthsText = months ? `${months} month${months > 1 ? 's' : ''}` : null;
  return yearsText && monthsText
    ? `${yearsText} and ${monthsText}`
    : yearsText || monthsText;
}
