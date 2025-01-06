'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Input } from '@/components/ui/input';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Card, CardContent } from '@/components/ui/card';

import { formatCurrency, formatDuration, paymentFigures } from '@/lib/utils';

export type LoanType = {
  balance: number;
  interestRate: number;
  monthlyPayment: number;
};

export type PaymentsViewProps = {
  loan: LoanType;
  onLoanChange: (loan: LoanType) => void;
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

function formatDate(additionalMonths: number) {
  const date = new Date();
  const currentMonth = date.getMonth();
  date.setMonth(currentMonth + additionalMonths);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function PaymentsView({ loan, onLoanChange }: PaymentsViewProps) {
  const {
    payments,
    totalInterestPaid,
    totalPrincipalPaid,
    totalPaid,
    totalMonths,
  } = paymentFigures(loan.balance, loan.monthlyPayment, loan.interestRate);

  const debtCompletionDate = formatDate(payments.length);

  const loanInputMap = {
    balance: { label: 'Loan Amount', suffix: '$', value: loan.balance },
    monthlyPayment: {
      label: 'Monthly Payment',
      suffix: '$',
      value: loan.monthlyPayment,
    },
    interestRate: {
      label: 'Annual Interest Rate',
      suffix: '%',
      value: loan.interestRate,
    },
  };

  function handleInput(input: string, key: keyof LoanType) {
    const newLoanValues = { ...loan };
    newLoanValues[key] = Number(input);
    onLoanChange(newLoanValues);
  }

  const LoanInputs = Object.keys(loanInputMap).map((key) => {
    const label = loanInputMap[key as keyof typeof loanInputMap].label;
    const suffix = loanInputMap[key as keyof typeof loanInputMap].suffix;
    const value = loanInputMap[key as keyof typeof loanInputMap].value;
    return (
      <div key={key} className="flex flex-col sm:w-fit w-full gap-1.5">
        <label className="text-sm text-gray-800" htmlFor={key}>
          {label}
        </label>
        <Input
          suffix={suffix}
          value={value}
          onChange={(e) => handleInput(e.target.value, key as keyof LoanType)}
        />
      </div>
    );
  });

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex gap-4 flex-wrap">{LoanInputs}</div>
      <div>
        You will be debt free in {debtCompletionDate} (
        {formatDuration(totalMonths)} from now)
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
