import React, { useState, useEffect, useRef } from 'react';
import {
    UseFormRegister,
    FieldErrors,
    UseFormGetValues,
} from 'react-hook-form';
import {
    Button,
    Dialog,
    IconButton,
    Portal,
    Text,
    Wrap,
    WrapItem,
} from '@chakra-ui/react';
import { EventFormField } from './EventFormField';
import { Formfields } from '../types/forms';
import { FaTrashCan } from 'react-icons/fa6';

interface OnlineEventFieldsProps {
    register: UseFormRegister<Formfields>;
    errors: FieldErrors<Formfields>;
    isDisabled: boolean;
    isPublished: boolean;
    isOnlineValue: boolean;
    setValue: (
        name: keyof Formfields,
        value: any,
        options?: { shouldDirty?: boolean }
    ) => void;
    getValues: UseFormGetValues<Formfields>;
}

export const OnlineEventFields: React.FC<OnlineEventFieldsProps> = ({
    register,
    errors,
    isDisabled,
    isPublished,
    isOnlineValue,
    setValue,
    getValues,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOnlineValue) {
            setValue('venue', 11, { shouldDirty: true }); //Online Event is currently venue_id 11 in dev data
        }
    }, [isOnlineValue, setValue]);

    return (
        <>
            <Wrap
                justifyContent="space-between"
                width="calc(100% - 2rem)"
                mt={4}
            >
                <WrapItem
                    display="block"
                    flex={{ base: '1 0 auto', sm: '0 0 auto' }}
                    w={{ base: '100%', sm: 'auto' }}
                >
                    <EventFormField
                        label="Is this an online event?"
                        error={errors.isOnline}
                        htmlFor="isOnline"
                    >
                        <input
                            {...register('isOnline')}
                            type="checkbox"
                            id="isOnline"
                            disabled={
                                isDisabled ||
                                isPublished ||
                                !!getValues('accessLink')
                            }
                        />
                    </EventFormField>
                </WrapItem>
                <WrapItem display="block" flex="max-content">
                    <EventFormField
                        label="Online event access link"
                        error={errors.accessLink}
                        htmlFor="accessLink"
                        focusWarningMessage="This event is already published. Changing the access link will require attendee notifications."
                        shouldWarn={isPublished}
                    >
                        <input
                            {...register('accessLink')}
                            type="text"
                            placeholder="Access link"
                            id="accessLink"
                            disabled={isDisabled || !isOnlineValue}
                        />
                    </EventFormField>
                </WrapItem>
                {getValues('accessLink') && (
                    <WrapItem display="block">
                        <Text fontSize="sm" mb={4}>Clear access link</Text>
                        <IconButton
                            variant="surface"
                            // colorPalette="red"
                            color="fg.error"
                            aria-label="Clear Access Link"
                            onClick={() => setIsOpen(true)}
                        >
                            <FaTrashCan />
                        </IconButton>
                        <Dialog.Root
                            role="alertdialog"
                            open={isOpen}
                            initialFocusEl={() => ref.current}
                        >
                            <Portal>
                                <Dialog.Backdrop>
                                    <Dialog.Content>
                                        <Dialog.Header
                                            fontSize="lg"
                                            fontWeight="bold"
                                        >
                                            Confirm Removal
                                        </Dialog.Header>
                                        <Dialog.Body>
                                            {!isPublished ? (
                                                <Text>
                                                    Are you sure you want to
                                                    remove the access link? This
                                                    cannot be undone.
                                                </Text>
                                            ) : (
                                                <>
                                                    <Text
                                                        color="red.500"
                                                        fontWeight="bold"
                                                    >
                                                        Warning:
                                                    </Text>
                                                    <Text>
                                                        Removing this access
                                                        link will&nbsp;
                                                        <Text
                                                            as="span"
                                                            fontWeight="bold"
                                                        >
                                                            immediately prevent
                                                            all registered
                                                            attendees from
                                                            joining
                                                        </Text>
                                                        &nbsp;the online event. You
                                                        are responsible for&nbsp;
                                                        <Text
                                                            as="span"
                                                            fontWeight="bold"
                                                        >
                                                            promptly notifying
                                                            all attendees
                                                        </Text>
                                                        &nbsp;about this critical
                                                        change.
                                                    </Text>
                                                </>
                                            )}
                                        </Dialog.Body>
                                        <Dialog.Footer>
                                            <Button
                                                variant="outline"
                                                ref={ref}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                bg="red.solid"
                                                onClick={() => {
                                                    setValue('accessLink', '', {
                                                        shouldDirty: true,
                                                    });
                                                    setIsOpen(false);
                                                }}
                                            >
                                                Yes, Remove
                                            </Button>
                                        </Dialog.Footer>
                                    </Dialog.Content>
                                </Dialog.Backdrop>
                            </Portal>
                        </Dialog.Root>
                    </WrapItem>
                )}
            </Wrap>
        </>
    );
};
