'use client'

import * as React from 'react'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { cn } from '@/lib/utils'

export type ToastProps = {
    title: string
    description?: string
    variant?: 'default' | 'destructive' | 'success'
}

export function useToast() {
    const [toasts, setToasts] = React.useState<ToastProps[]>([])

    const toast = (toastData: ToastProps) => {
        setToasts(prev => [...prev, toastData])
        setTimeout(() => {
            setToasts(prev => prev.slice(1))
        }, 3000) // auto-hide after 3s
    }

    const ToastViewport = () => (
        <ToastPrimitives.Provider swipeDirection="right">
            {toasts.map((t, index) => (
                <ToastPrimitives.Root
                    key={index}
                    open
                    className={cn(
                        'p-4 rounded shadow-md mb-2 w-80',
                        t.variant === 'destructive' && 'bg-red-500 text-white',
                        t.variant === 'success' && 'bg-green-500 text-white',
                        t.variant === 'default' && 'bg-gray-100 text-black'
                    )}
                >
                    <ToastPrimitives.Title className="font-bold">{t.title}</ToastPrimitives.Title>
                    {t.description && (
                        <ToastPrimitives.Description>{t.description}</ToastPrimitives.Description>
                    )}
                </ToastPrimitives.Root>
            ))}
            <ToastPrimitives.Viewport className="fixed bottom-4 right-4 flex flex-col gap-2 z-50" />
        </ToastPrimitives.Provider>
    )

    return { toast, ToastViewport }
}
