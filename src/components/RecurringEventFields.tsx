import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { Box } from '@chakra-ui/react';
import { EventFormField } from './EventFormField';
import { Formfields } from '../types/forms';

interface RecurringEventFieldsProps {
    register: UseFormRegister<Formfields>;
    errors: FieldErrors<Formfields>;
    isDisabled: boolean;
    isPublished: boolean;
    watch: UseFormWatch<Formfields>;
}

export const RecurringEventFields: React.FC<RecurringEventFieldsProps> = ({
    register,
    errors,
    isDisabled,
    isPublished,
    watch,
}) => {
    const isRecurring = watch('isRecurring');

    return (
        <Box mt={4}>
            <EventFormField label="Is this a recurring event?" error={errors.isRecurring} htmlFor='isRecurring'>
                <input
                    {...register('isRecurring')}
                    id='isRecurring'
                    type="checkbox"
                    disabled={isDisabled || isPublished}
                />
            </EventFormField>

            {isRecurring && (
                <>
                    <EventFormField
                        label="Frequency"
                        error={errors.recurringFrequency}
                        htmlFor='recurringFrequency'
                        focusWarningMessage="This event is already published. Changing the frequency may impact attendees who planned around the original schedule."
                        shouldWarn={isPublished}
                    >
                        <select
                            {...register('recurringFrequency')}
                            id='recurringFrequency'
                            disabled={isDisabled}
                        >
                            <option value="">Select frequency</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Fortnightly">Fortnightly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </EventFormField>
                    <EventFormField
                        label="Day"
                        error={errors.recurringDay}
                        htmlFor='recurringDay'
                        focusWarningMessage="This event is already published. Changing the day may impact attendees who planned around the original schedule."
                        shouldWarn={isPublished}
                    >
                        <select
                            {...register('recurringDay')}
                            id='recurringDay'
                            disabled={isDisabled}
                        >
                            <option value="">Select day</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                        </select>
                    </EventFormField>
                </>
            )}
        </Box>
    );
};