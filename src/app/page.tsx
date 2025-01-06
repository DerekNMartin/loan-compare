'use client';

import { useState } from 'react';

import { PaymentsView, LoanType } from '@/components/paymentsView';
import { ComparisonSummary } from '@/components/ComparisonSummary';

export default function Home() {
  const defaultLoan = {
    balance: 30000,
    interestRate: 10,
    monthlyPayment: 1000,
  };

  const [loanA, setLoanA] = useState<LoanType>(defaultLoan);
  const [loanB, setLoanB] = useState<LoanType>(defaultLoan);

  return (
    <main className="min-h-screen md:p-24 p-8 flex flex-col gap-8">
      <section className="flex justify-between md:gap-24 gap-8 md:flex-row flex-col">
        <PaymentsView loan={loanA} onLoanChange={setLoanA} />
        <PaymentsView loan={loanB} onLoanChange={setLoanB} />
      </section>
      <ComparisonSummary loanA={loanA} loanB={loanB} />
    </main>
  );
}
