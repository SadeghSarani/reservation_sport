'use client'

import React, { forwardRef } from 'react'
import clsx from 'clsx'

interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={clsx(
                    'w-full rounded-md border border-border bg-background p-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
                    className
                )}
                {...props}
            />
        )
    }
)

Textarea.displayName = 'Textarea'
