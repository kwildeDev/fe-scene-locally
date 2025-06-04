import React from 'react';
import { UseFormRegister, FieldErrors, UseFormResetField } from 'react-hook-form';
import { Wrap, WrapItem } from '@chakra-ui/react';
import { EventFormField } from './EventFormField';
import { Formfields } from '../types/forms';

interface DateTimeFieldsProps {
    register: UseFormRegister<Formfields>;
    errors: FieldErrors<Formfields>;
    isDisabled: boolean;
    isPublished: boolean;
    resetField: UseFormResetField<Formfields>;
    startDateValue: string;
    endDateValue: string;
    setValue: (name: keyof Formfields, value: any, options?: { shouldDirty?: boolean }) => void;
}

export const DateTimeFields: React.FC<DateTimeFieldsProps> = ({
    register,
    errors,
    isDisabled,
    isPublished,
    resetField,
    startDateValue,
    endDateValue,
    setValue
}) => {
    React.useEffect(() => {
        resetField('startTime');
    }, [startDateValue, resetField]);

    React.useEffect(() => {
        resetField('endTime');
    }, [endDateValue, resetField]);

    React.useEffect(() => {
        if (startDateValue && !endDateValue) {
            setValue('endDate', startDateValue, { shouldDirty: true });
        }
    }, [startDateValue, endDateValue, setValue]);


    return (
        <>
            <Wrap gap="4" mt={4} justify="space-between">
                <WrapItem display="block" flex="2">
                    <EventFormField 
                        label="Start Date" 
                        error={errors.startDate} 
                        htmlFor="startDate"
                        focusWarningMessage="Changing dates will affect all attendees. Notify them as soon as possible."
                        shouldWarn={isPublished}
                    >
                        <input
                            {...register('startDate')}
                            type="date"
                            id="startDate"
                            disabled={isDisabled}
                        />
                    </EventFormField>
                </WrapItem>
                <WrapItem display="block" flex="2">
                    <EventFormField 
                        label="Start Time" 
                        error={errors.startTime} 
                        htmlFor="startTime"
                        focusWarningMessage="Changing times will affect all attendees. Notify them as soon as possible."
                        shouldWarn={isPublished}
                    >
                        <input
                            {...register('startTime')}
                            type="time"
                            id="startTime"
                            disabled={isDisabled}
                        />
                    </EventFormField>
                </WrapItem>
                <WrapItem display="block" flex="2">
                    <EventFormField 
                        label="End Date" 
                        error={errors.endDate} 
                        htmlFor="endDate"
                        focusWarningMessage="Changing dates will affect all attendees. Notify them as soon as possible."
                        shouldWarn={isPublished}
                    >
                        <input
                            {...register('endDate')}
                            type="date"
                            id="endDate"
                            disabled={isDisabled}
                        />
                    </EventFormField>
                </WrapItem>
                <WrapItem display="block" flex="2">
                    <EventFormField 
                        label="End Time" 
                        error={errors.endTime} 
                        htmlFor="endTime"
                        focusWarningMessage="Changing times will affect all attendees. Notify them as soon as possible."
                        shouldWarn={isPublished}
                    >
                        <input
                            {...register('endTime')}
                            type="time"
                            id="endTime"
                            disabled={isDisabled}
                        />
                    </EventFormField>
                </WrapItem>
            </Wrap>
        </>
    );
};