'use client'

import React from 'react'
export interface TableRowProps
    extends React.HTMLAttributes<HTMLTableRowElement> {}

// Main Table component
export const Table = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border bg-background">
                {children}
            </table>
        </div>
    )
}


// Table subcomponents
export const TableHeader = ({ children }: { children: React.ReactNode }) => {
    return <thead className="bg-muted text-muted-foreground">{children}</thead>
}

export const TableBody = ({ children }: { children: React.ReactNode }) => {
    return <tbody className="divide-y divide-border">{children}</tbody>
}

export const TableRow = React.forwardRef<
    HTMLTableRowElement,
    TableRowProps
>(({ className, ...props }, ref) => {
    return (
        <tr
            ref={ref}
            className={className}
            {...props}
        />
    )
})

export const TableHead = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <th
            className={`px-4 py-2 text-start text-sm font-semibold text-foreground ${className ?? ''}`}
        >
            {children}
        </th>
    )
}

export const TableCell = ({ children, className, colSpan }: { children: React.ReactNode; className?: string; colSpan?: number }) => {
    return (
        <td className={`px-4 py-2 text-sm text-foreground ${className ?? ''}`} colSpan={colSpan}>
            {children}
        </td>
    )
}

// Attach subcomponents for convenience
Table.Header = TableHeader
Table.Body = TableBody
Table.Row = TableRow
Table.Head = TableHead
Table.Cell = TableCell
