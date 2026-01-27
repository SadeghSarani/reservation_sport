import * as React from 'react'
import clsx from 'clsx'

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = 'text', ...props }, ref) => {
        return (
            <input
                ref={ref}
                type={type}
                className={clsx(
                    'flex h-11 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm',
                    'text-foreground placeholder:text-muted-foreground',
                    'transition-colors duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    className
                )}
                {...props}
            />
        )
    }
)

Input.displayName = 'Input'
