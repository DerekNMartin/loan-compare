'use client';

import { useMemo, useState } from 'react';

import { PaymentsView, LoanType } from '@/components/paymentsView';

import { formatCurrency, formatDuration } from '@/lib/utils';

export default function Home() {
  const [loanA, setLoanA] = useState<LoanType>();
  const [loanB, setLoanB] = useState<LoanType>();

  const summary = useMemo(() => {
    if (!loanA || !loanB) return null;
    const differenceInterestPaid =
      loanA.totalInterestPaid > loanB.totalInterestPaid
        ? loanA.totalInterestPaid - loanB.totalInterestPaid
        : loanB.totalInterestPaid - loanA.totalInterestPaid;

    const differenceMonths =
      loanA.totalMonths > loanB.totalMonths
        ? loanA.totalMonths - loanB.totalMonths
        : loanB.totalMonths - loanA.totalMonths;
    if (!differenceInterestPaid && !differenceMonths) return null;
    return (
      <section className="text-center">
        <p className="text-xl font-bold">
          You would pay {formatCurrency(differenceInterestPaid)} more in
          interest, and it would take you {formatDuration(differenceMonths)}{' '}
          longer to pay off.
        </p>
      </section>
    );
  }, [loanA, loanB]);

  return (
    <main className="min-h-screen md:p-24 p-8 flex flex-col gap-8">
      <section className="flex justify-between md:gap-24 gap-8 md:flex-row flex-col">
        <PaymentsView onLoanChange={setLoanA} />
        <PaymentsView onLoanChange={setLoanB} />
      </section>
      {summary}
    </main>
  );
}
