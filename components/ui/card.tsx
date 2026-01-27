import * as React from 'react'
import clsx from 'clsx'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
    return (
        <div
            className={clsx(
                'rounded-2xl border border-border bg-card text-card-foreground shadow-sm',
                className
            )}
            {...props}
        />
    )
}

/* ---------------- Card Header ---------------- */

export function CardHeader({
                               className,
                               ...props
                           }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={clsx(
                'flex flex-col space-y-1.5 p-6',
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
                'text-lg font-semibold leading-none tracking-tight',
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
                'text-sm text-muted-foreground',
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
            className={clsx(
                'p-6 pt-0',
                className
            )}
            {...props}
        />
    )
}

/* ---------------- Card Footer ---------------- */

export function CardFooter({
                               className,
                               ...props
                           }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={clsx(
                'flex items-center p-6 pt-0',
                className
            )}
            {...props}
        />
    )
}
