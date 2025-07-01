import { useState } from 'react';
import { AlertState } from '@/types/models';

interface ExportConfig {
    [key: string]: string;
}

interface UseExportOptions {
    onError?: (error: string) => void;
    errorMessage?: string;
}

export function useExport(
    exportConfig: ExportConfig,
    options: UseExportOptions = {}
) {
    const [exportLoading, setExportLoading] = useState(false);
    const [alert, setAlert] = useState<AlertState>({
        isVisible: false,
        message: '',
        type: 'success',
    });

    const handleExport = (format: string) => {
        const exportUrl = exportConfig[format];

        if (exportUrl) {
            setExportLoading(true);
            window.open(exportUrl, '_blank');
            setExportLoading(false);
        } else {
            const errorMsg = options.errorMessage || 'Formato no soportado';
            setAlert({
                isVisible: true,
                message: errorMsg,
                type: 'error',
            });
            options.onError?.(errorMsg);
        }
    };

    const handleAlertClose = () => {
        setAlert({ isVisible: false, message: '', type: 'success' });
    };

    return {
        exportLoading,
        alert,
        handleExport,
        handleAlertClose,
    };
} 