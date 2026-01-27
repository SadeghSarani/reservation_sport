import React from "react";
import clsx from "clsx";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info";

interface BadgeProps {
    variant?: BadgeVariant;
    children: React.ReactNode;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
};

export function Badge({
                          variant = "default",
                          children,
                          className,
                      }: BadgeProps) {
    return (
        <span
            className={clsx(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                variantStyles[variant],
                className
            )}
        >
      {children}
    </span>
    );
}
