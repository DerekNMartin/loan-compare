'use client';

import { useMemo, useState, useEffect } from 'react';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Input } from '@/components/ui/input';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Card, CardContent } from '@/components/ui/card';

import { formatCurrency, formatDuration } from '@/lib/utils';

export type LoanType = {
  balance: number;
  interestRate: number;
  monthlyPayment: number;
  totalInterestPaid: number;
  totalPrincipalPaid: number;
  totalPaid: number;
  totalMonths: number;
};

const chartConfig = {
  totalInterest: {
    label: 'Interest Paid',
    color: 'hsl(var(--chart-1))',
  },
  totalPrincipal: {
    label: 'Principal Paid',
    color: 'hsl(var(--chart-2))',
  },
  balance: {
    label: 'Remaining Balance',
    color: 'hsl(var(--chart-3))',
  },
};

function calcPayments(
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

function formatDate(additionalMonths: number) {
  const date = new Date();
  const currentMonth = date.getMonth();
  date.setMonth(currentMonth + additionalMonths);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

type PaymentsViewProps = {
  onLoanChange: (loan: LoanType) => void;
};

export function PaymentsView({ onLoanChange }: PaymentsViewProps) {
  const [loanInput, setLoadInput] = useState({
    balance: 30000,
    interestRate: 10,
    minMonthlyPayment: 1000,
  });

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

  const totalTime = useMemo(() => {
    const months = payments.length;
    const years = Number(months / 12).toFixed(2);
    return { months, years };
  }, [payments]);

  const debtCompletionDate = useMemo(() => {
    return formatDate(payments.length);
  }, [payments]);

  function handleInput(input: string, key: keyof typeof loanInput) {
    const test = { ...loanInput };
    test[key] = Number(input);
    setLoadInput(test);
  }

  const LoanInputs = Object.keys(loanInput).map((key) => {
    const loanInputMap = {
      balance: { label: 'Loan Amount', suffix: '$' },
      interestRate: { label: 'Annual Interest Rate', suffix: '%' },
      minMonthlyPayment: { label: 'Monthly Payment', suffix: '$' },
    };
    const label = loanInputMap[key as keyof typeof loanInput].label;
    const suffix = loanInputMap[key as keyof typeof loanInput].suffix;
    const value = loanInput[key as keyof typeof loanInput];
    return (
      <div key={key} className="flex flex-col sm:w-fit w-full gap-1.5">
        <label className="text-sm text-gray-800" htmlFor={key}>
          {label}
        </label>
        <Input
          suffix={suffix}
          value={value}
          onChange={(e) =>
            handleInput(e.target.value, key as keyof typeof loanInput)
          }
        />
      </div>
    );
  });

  useEffect(() => {
    onLoanChange({
      balance: loanInput.balance,
      interestRate: loanInput.interestRate,
      monthlyPayment: loanInput.minMonthlyPayment,
      totalMonths: totalTime.months,
      totalInterestPaid,
      totalPrincipalPaid,
      totalPaid,
    });
  }, [
    loanInput.balance,
    loanInput.minMonthlyPayment,
    loanInput.interestRate,
    totalInterestPaid,
    totalPrincipalPaid,
    totalPaid,
    totalTime,
    onLoanChange,
  ]);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex gap-4 flex-wrap">{LoanInputs}</div>
      <div>
        You will be debt free in {debtCompletionDate} (
        {formatDuration(totalTime.months)} from now)
      </div>
      <div className="grid grid-rows-3 grid-cols-2 w-fit gap-x-4">
        <span>Interest Paid:</span>
        <span>{formatCurrency(totalInterestPaid)}</span>
        <span>Principal Paid:</span>
        <span>{formatCurrency(totalPrincipalPaid)}</span>
        <span>Total Paid:</span>
        <span>{formatCurrency(totalPaid)}</span>
      </div>
      <Card className="w-full">
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={payments}
              margin={{
                top: 16,
                left: 16,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <YAxis
                dataKey="balance"
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => formatDate(value)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="totalPrincipal"
                type="natural"
                fill="var(--color-totalPrincipal)"
                fillOpacity={0.2}
                stroke="var(--color-totalPrincipal)"
                stackId="b"
              />
              <Area
                dataKey="totalInterest"
                type="natural"
                fill="var(--color-totalInterest)"
                fillOpacity={0.6}
                stroke="var(--color-totalInterest)"
                stackId="a"
              />
              <Area
                dataKey="balance"
                type="natural"
                fill="var(--color-balance)"
                fillOpacity={0.2}
                stroke="var(--color-balance)"
                stackId="c"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
