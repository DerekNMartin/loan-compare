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

export function calcPayments(
  loanAmount: number,
  monthlyPayment: number,
  interestRate: number
) {
  let balance = loanAmount;
  const monthlyInterestRate = interestRate / 12 / 100;
  let month = 1;
  let totalInterest = 0;
  let totalPrincipal = 0;
  const payments = [];

  while (balance > 0) {
    const interest = balance * monthlyInterestRate;
    let principal = monthlyPayment - interest;
    totalInterest += interest;
    totalPrincipal += principal;

    if (principal > balance) {
      principal = balance;
    }

    balance -= principal;

    payments.push({
      month: month,
      interest: parseFloat(interest.toFixed(2)),
      totalInterest: parseFloat(totalInterest.toFixed(2)),
      principal: parseFloat(principal.toFixed(2)),
      totalPrincipal: parseFloat(totalPrincipal.toFixed(2)),
      balance: parseFloat(balance.toFixed(2)),
    });

    month++;

    if (principal <= 0) break;
  }

  return payments;
}
export function paymentFigures(
  balance: number,
  minMonthlyPayment: number,
  interestRate: number
) {
  const payments = calcPayments(balance, minMonthlyPayment, interestRate);

  const totalInterestPaid = payments.reduce(
    (total, { interest }) => (total += interest),
    0
  );

  const totalPrincipalPaid = payments.reduce(
    (total, { principal }) => (total += principal),
    0
  );

  const totalPaid = totalInterestPaid + totalPrincipalPaid;

  const totalMonths = payments.length;
  const totalYears = Number(totalMonths / 12).toFixed(2);

  return {
    payments,
    totalInterestPaid,
    totalPrincipalPaid,
    totalPaid,
    totalMonths,
    totalYears,
  };
}
