'use client';

import { Input } from '@/components/ui/input';
import { useEffect, useMemo, useState } from 'react';

function calcPayments(
  loanAmount: number,
  monthlyPayment: number,
  interestRate: number
) {
  let balance = loanAmount;
  const monthlyInterestRate = interestRate / 12 / 100;
  let month = 1;
  const payments = [];

  while (balance > 0) {
    const interest = balance * monthlyInterestRate;
    let principal = monthlyPayment - interest;

    if (principal > balance) {
      principal = balance;
    }

    balance -= principal;

    payments.push({
      month: month,
      interest: parseFloat(interest.toFixed(2)),
      principal: parseFloat(principal.toFixed(2)),
      balance: parseFloat(balance.toFixed(2)),
    });

    month++;

    if (principal <= 0) break;
  }

  return payments;
}

export default function Home() {
  const [loanInput, setLoadInput] = useState({
    name: '',
    balance: 30000,
    interestRate: 10,
    minMonthlyPayment: 1000,
  });

  // const [payments, setPayments] = useState([]);
  // useEffect(() => {
  //   const payments = calcPayments(
  //     loanInput.balance,
  //     loanInput.minMonthlyPayment,
  //     loanInput.interestRate
  //   );
  //   setPayments(payments);
  // }, [loanInput.balance, loanInput.minMonthlyPayment, loanInput.interestRate]);

  // const payments = calcPayments(
  //   loanInput.balance,
  //   loanInput.minMonthlyPayment,
  //   loanInput.interestRate
  // );

  const payments = useMemo(() => {
    return calcPayments(
      loanInput.balance,
      loanInput.minMonthlyPayment,
      loanInput.interestRate
    );
  }, [loanInput.balance, loanInput.minMonthlyPayment, loanInput.interestRate]);

  const totalInterestPaid = useMemo(() => {
    return payments.reduce((total, { interest }) => (total += interest), 0);
  }, [payments]);

  const totalPrincipalPaid = useMemo(() => {
    return payments.reduce((total, { principal }) => (total += principal), 0);
  }, [payments]);

  const totalPaid = useMemo(() => {
    return totalInterestPaid + totalPrincipalPaid;
  }, [totalInterestPaid, totalPrincipalPaid]);

  function handleInput(input: string, key: keyof typeof loanInput) {
    const test = { ...loanInput };
    if (key === 'name') test.name = input;
    else test[key] = Number(input);
    setLoadInput(test);
  }

  const LoanInputs = Object.keys(loanInput).map((key) => {
    const loanInputLables = {
      name: 'Name',
      balance: 'Balance',
      interestRate: 'Annual Interest Rate',
      minMonthlyPayment: 'Monthly Payment',
    };
    const label = loanInputLables[key as keyof typeof loanInput];
    const value = loanInput[key as keyof typeof loanInput];
    return (
      <div key={key} className="flex flex-col w-full max-w-sm gap-1.5">
        <label className="text-sm text-gray-800" htmlFor={key}>
          {label}
        </label>
        <Input
          value={value}
          onChange={(e) =>
            handleInput(e.target.value, key as keyof typeof loanInput)
          }
        />
      </div>
    );
  });

  return (
    <main className="flex min-h-screen flex-col p-24">
      <div className="flex gap-4">{LoanInputs}</div>
      <p>Total Interest Paid: {totalInterestPaid}</p>
      <p>Total Principal Paid: {totalPrincipalPaid}</p>
      <p>Grand Total Paid: {totalPaid}</p>
    </main>
  );
}
