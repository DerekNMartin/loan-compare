import { LoanType } from '@/components/paymentsView';
import { formatCurrency, formatDuration, paymentFigures } from '@/lib/utils';

export function ComparisonSummary({
  loanA,
  loanB,
}: {
  loanA?: LoanType;
  loanB?: LoanType;
}) {
  if (!loanA || !loanB) return null;

  const paymentsA = paymentFigures(
    loanA.balance,
    loanA.monthlyPayment,
    loanA.interestRate
  );
  const paymentsB = paymentFigures(
    loanB.balance,
    loanB.monthlyPayment,
    loanB.interestRate
  );

  const differenceInterestPaid =
    paymentsA.totalInterestPaid > paymentsB.totalInterestPaid
      ? paymentsA.totalInterestPaid - paymentsB.totalInterestPaid
      : paymentsB.totalInterestPaid - paymentsA.totalInterestPaid;

  const differenceMonths =
    paymentsA.totalMonths > paymentsB.totalMonths
      ? paymentsA.totalMonths - paymentsB.totalMonths
      : paymentsB.totalMonths - paymentsA.totalMonths;
  if (!differenceInterestPaid && !differenceMonths) return null;
  return (
    <section className="text-center">
      <p className="text-xl font-bold">
        You would pay {formatCurrency(differenceInterestPaid)} more in interest,
        and it would take you {formatDuration(differenceMonths)} longer to pay
        off.
      </p>
    </section>
  );
}
