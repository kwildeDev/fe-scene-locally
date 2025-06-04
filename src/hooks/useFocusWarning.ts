import { useState, useCallback } from 'react';

interface UseFocusWarningOptions {
    onFocus?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    message?: string;
}

interface UseFocusWarningReturn {
    isFocused: boolean;
    focusedMessage: string | null;
    focusProps: {
        onFocus: (event: React.FocusEvent<any>) => void;
        onBlur: (event: React.FocusEvent<any>) => void;
    };
}

export const useFocusWarning = (options?: UseFocusWarningOptions): UseFocusWarningReturn => {
    const [isFocused, setIsFocused] = useState(false);
    const message = options?.message || null;

    const handleFocus = useCallback((event: React.FocusEvent<any>) => {
        console.log("Focused on:", event.target);
        setIsFocused(true);
        options?.onFocus?.(event);
    }, [options?.onFocus]);

    const handleBlur = useCallback((event: React.FocusEvent<any>) => {
        setIsFocused(false);
        options?.onBlur?.(event);
    }, [options?.onBlur]);

    return {
        isFocused,
        focusedMessage: isFocused ? message : null,
        focusProps: {
            onFocus: handleFocus,
            onBlur: handleBlur,
        },
    };
};