import * as React from 'react'
import clsx from 'clsx'

/* ---------------- Types ---------------- */

export type CardVariant = 'default' | 'elevated' | 'flat' | 'outlined' | 'ghost'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: CardVariant
    hoverable?: boolean
    clickable?: boolean
}

/* ---------------- Variant styles ---------------- */

const variantStyles: Record<CardVariant, string> = {
    default:  'border border-border/60 bg-card shadow-sm',
    elevated: 'border border-border/30 bg-card shadow-md shadow-black/[0.06]',
    flat:     'border border-border/40 bg-muted/30 shadow-none',
    outlined: 'border-2 border-border bg-transparent shadow-none',
    ghost:    'border-transparent bg-transparent shadow-none',
}

/* ---------------- Card ---------------- */

export function Card({
                         className,
                         variant = 'default',
                         hoverable = false,
                         clickable = false,
                         ...props
                     }: CardProps) {
    return (
        <div
            className={clsx(
                'rounded-xl text-card-foreground transition-all duration-200',
                variantStyles[variant],
                hoverable && 'hover:shadow-md hover:border-border hover:-translate-y-0.5',
                clickable && 'cursor-pointer active:scale-[0.99] hover:shadow-md hover:border-border hover:-translate-y-0.5 select-none',
                className
            )}
            {...props}
        />
    )
}

/* ---------------- Card Header ---------------- */

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    divided?: boolean
}

export function CardHeader({ className, divided = false, ...props }: CardHeaderProps) {
    return (
        <div
            className={clsx(
                'flex flex-col space-y-1 p-5',
                divided && 'border-b border-border/50 pb-4',
                className
            )}
            {...props}
        />
    )
}

/* ---------------- Card Title ---------------- */

export function CardTitle({
                              className,
                              ...props
                          }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            className={clsx(
                'text-base font-semibold leading-snug tracking-tight text-foreground',
                className
            )}
            {...props}
        />
    )
}

/* ---------------- Card Description ---------------- */

export function CardDescription({
                                    className,
                                    ...props
                                }: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={clsx(
                'text-sm text-muted-foreground leading-relaxed',
                className
            )}
            {...props}
        />
    )
}

/* ---------------- Card Content ---------------- */

export function CardContent({
                                className,
                                ...props
                            }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={clsx('p-5 pt-0', className)}
            {...props}
        />
    )
}

/* ---------------- Card Footer ---------------- */

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    divided?: boolean
}

export function CardFooter({ className, divided = false, ...props }: CardFooterProps) {
    return (
        <div
            className={clsx(
                'flex items-center gap-2 p-5 pt-0',
                divided && 'border-t border-border/50 pt-4 mt-1',
                className
            )}
            {...props}
        />
    )
}