import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemporaryAlertProps {
    className?: string;
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export const TemporaryAlert: React.FC<TemporaryAlertProps> = ({
    className,
    message,
    type,
    isVisible,
    onClose,
    duration = 3000,
}) => {
    const [isShowing, setIsShowing] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsShowing(true);
            const timer = setTimeout(() => {
                setIsShowing(false);
                setTimeout(onClose, 300); // Esperar a que termine la animación
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const IconComponent = type === 'success' ? CheckCircle : XCircle;
    const variant = type === 'success' ? 'default' : 'destructive';

    return (
        <div className={cn(
            "fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out",
            isShowing ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
            className
        )}>
            <Alert variant={variant} className="min-w-[300px] shadow-lg">
                <div className="flex items-start gap-3">
                    <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <AlertDescription className="flex-1">
                        {message}
                    </AlertDescription>
                    <button
                        onClick={() => {
                            setIsShowing(false);
                            setTimeout(onClose, 300);
                        }}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </Alert>
        </div>
    );
}; 