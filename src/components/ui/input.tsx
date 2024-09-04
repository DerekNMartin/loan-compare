import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  suffix?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, suffix, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300',
            className
          )}
          ref={ref}
          {...props}
        />
        {suffix && (
          <span className="absolute right-2 top-2.5 text-gray-300 text-sm">
            {suffix}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
