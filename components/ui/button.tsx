import React from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
        "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outline:
        "border border-gray-300 text-gray-700 hover:bg-gray-100",
    danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost:
         "bg-gray-200 text-black hover:bg-gray-500 focus:ring-black"
};

const sizeStyles: { sm: string; md: string; lg: string, icon : string } = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    icon: "w-8 h-8 p-1 flex items-center justify-center"
};

export function Button({
                           variant = "primary",
                           size = "md",
                           className,
                           children,
                           ...props
                       }: ButtonProps) {
    return (
        <button
            {...props}
            className={clsx(
                "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
        >
            {children}
        </button>
    );
}
