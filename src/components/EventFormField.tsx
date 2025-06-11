import React, { forwardRef, ReactNode } from 'react';
import { FieldError } from 'react-hook-form';
import { Box, Field, Text } from '@chakra-ui/react';
import { useFocusWarning } from '../hooks/useFocusWarning';

interface EventFormFieldProps {
    label: string;
    children: ReactNode;
    helperText?: string; 
    error?: FieldError;
    htmlFor?: string;
    focusWarningMessage?: string;
    shouldWarn?: boolean;
}

export const EventFormField = forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, EventFormFieldProps>
(
    (
        {
            label,
            children,
            helperText,
            error,
            htmlFor,
            focusWarningMessage,
            shouldWarn = false,
        },
        ref
    ) => {
        const inputElement = React.Children.toArray(children).find(
            (child) => React.isValidElement(child)
        ) as React.ReactElement<any>;

        const { isFocused, focusedMessage, focusProps } =
            shouldWarn && focusWarningMessage
                ? useFocusWarning({
                      message: focusWarningMessage,
                      onFocus: inputElement.props.onFocus,
                      onBlur: inputElement.props.onBlur,
                  })
                : {
                      isFocused: false,
                      focusedMessage: null,
                      focusProps: {},
                  };

        const clonedInput = React.cloneElement(inputElement, {
            ...focusProps,
            ref: (node: any) => {
                if (typeof ref === 'function') ref(node);
                else if (ref) ref.current = node;

                if (typeof inputElement.props.ref === 'function') {
                    inputElement.props.ref(node);
                } else if (inputElement.props.ref) {
                    inputElement.props.ref.current = node;
                }
            },
        });
    
    return (
        <Box flex="1">
            <Field.Root>
            <Field.Label color="gray.fg" htmlFor={htmlFor}>{label}</Field.Label>
            {shouldWarn && isFocused && focusedMessage && (
                <Text color="fg.error" fontSize="sm" mb={1}>
                    {focusedMessage}
                </Text>
            )}
            {clonedInput}
            {helperText && <Text color="fg.muted" fontSize="sm">{helperText}</Text>}
            {error && <Text className="error-message" color="fg.error">{error.message}</Text>}
            </Field.Root>
        </Box>
    );
});