import {
    Button,
    Dialog,
    Field,
    Input,
    Portal,
    Stack,
    Text,
} from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { postAttendee } from '../api.ts';
import { GoogleCalendarEvent } from './IndividualEvent.tsx';
import { FaGoogle } from 'react-icons/fa';
import { formatDateForGoogleCalendarLocal } from '../utils/utils.ts';
import { useUser } from '../contexts/UserProvider.tsx';

interface SignupCardProps {
    event_id: number;
    title: string;
    googleEventProps: GoogleCalendarEvent;
}

interface SignupCardData {
    user_id: number | null;
    name: string;
    email: string;
    is_registered_user: boolean;
}

const capitaliseFirstCharacter = (
    name: string | null | undefined
): string | null | undefined => {
    if (!name || name.trim() === '') {
        return '';
    }
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

const schema = z.object({
    firstName: z
        .string()
        .min(1, { error: 'First name is required' })
        .transform((val) => capitaliseFirstCharacter(val) || ''),
    lastName: z
        .string()
        .min(1, { error: 'Last name is required' })
        .transform((val) => capitaliseFirstCharacter(val) || ''),
    email: z
        .email({ error: (iss) => iss.input === '' ? 'Email is required' : "Invalid email address" })
        .min(1), 
    });

type Formfields = z.infer<typeof schema>;

const SignupCard: React.FC<SignupCardProps> = ({
    event_id,
    title,
    googleEventProps,
}) => {
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const { user } = useUser();
    const userId: number | null = user?.user_id ?? null;
    const isRegisteredUser: boolean = !!user?.user_id;

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<Formfields>({
        defaultValues: {
            firstName: user?.first_name ?? '',
            lastName: user?.last_name ?? '',
            email: user?.email ?? '',
        },
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        reset({
            firstName: user?.first_name ?? '',
            lastName: user?.last_name ?? '',
            email: user?.email ?? '',
        });
    }, [user, reset]);

    const createGoogleCalendarURL = (googleEventProps: GoogleCalendarEvent) => {
        const formattedStartDate = formatDateForGoogleCalendarLocal(googleEventProps.startTimeUTC, googleEventProps.relevantTimezone);
        const formattedEndDate = formatDateForGoogleCalendarLocal(googleEventProps.endTimeUTC, googleEventProps.relevantTimezone);
        const baseURL = 'https://calendar.google.com/calendar/u/0/r/eventedit';
        const dates = `dates=${formattedStartDate}/${formattedEndDate}`;
        const ctz = `ctz=${encodeURIComponent(googleEventProps.relevantTimezone)}`;
        const text = `text=${encodeURIComponent(googleEventProps.eventTitle)}`;
        const locationParam = googleEventProps.locationName ? `&location=${encodeURIComponent(googleEventProps.locationName)}` : '';
        const details = `details=${encodeURIComponent(googleEventProps.eventDescription)}`;

        return `${baseURL}?${dates}&${ctz}&${text}${locationParam}&${details}`;
    }
    const handleAddToCalendarClick = (googleEventProps: GoogleCalendarEvent) => {
        const googleCalendarURL = createGoogleCalendarURL(googleEventProps);
        window.open(googleCalendarURL, '_blank');
    };

    // const onSubmit: SubmitHandler<Formfields> = (data) => {
    //     const signupCardData: SignupCardData = {
    //         user_id: userId,
    //         name: `${data.firstName} ${data.lastName}`,
    //         email: data.email,
    //         is_registered_user: isRegisteredUser,
    //     };
    //     postAttendee(event_id, signupCardData)
    //         .then((attendee) => {
    //             setIsFormSubmitted(true);
    //             console.log(attendee);
    //         })
    //         .catch((_error) => {
    //             setError('root', {
    //                 message: 'Event registration could not be submitted',
    //             });
    //         });
    // };

    const onSubmit: SubmitHandler<Formfields> = async (data) => {
        const signupCardData: SignupCardData = {
            user_id: userId,
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            is_registered_user: isRegisteredUser,
        };

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await postAttendee(event_id, signupCardData);
            setIsFormSubmitted(true);
        } catch (error) {
            setError('root', {
                message: 'Event registration could not be submitted',
            });
            console.error('Submission error:', error);
        };
    };

    return (
        <Dialog.Root
            closeOnEscape={false}
            closeOnInteractOutside={false}
            modal={true}
        >
            <Dialog.Trigger asChild>
                <Button bg="blue.fg" size="lg">
                    Sign up for this event
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Sign up for {title}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body pb="4">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Stack>
                                    <Field.Root
                                        disabled={
                                            isFormSubmitted || isRegisteredUser
                                        }
                                        invalid={!!errors.firstName}
                                    >
                                        <Field.Label color="gray.fg">First name</Field.Label>
                                        <Input
                                            {...register('firstName')}
                                            type="text"
                                            placeholder="First Name"
                                            color="black"
                                        />
                                        <Field.ErrorText>
                                            {errors.firstName?.message}
                                        </Field.ErrorText>
                                    </Field.Root>
                                    <Field.Root
                                        disabled={
                                            isFormSubmitted || isRegisteredUser
                                        }
                                        invalid={!!errors.lastName}
                                    >
                                        <Field.Label color="gray.fg">Last name</Field.Label>
                                        <Input
                                            {...register('lastName')}
                                            type="text"
                                            placeholder="Last Name"
                                            color="black"
                                        />
                                        <Field.ErrorText>
                                            {errors.lastName?.message}
                                        </Field.ErrorText>
                                    </Field.Root>
                                    <Field.Root
                                        disabled={
                                            isFormSubmitted || isRegisteredUser
                                        }
                                        invalid={!!errors.email}
                                    >
                                        <Field.Label color="gray.fg">Email</Field.Label>
                                        <Input
                                            {...register('email')}
                                            type="text"
                                            placeholder="Email"
                                            color="black"
                                        />
                                        <Field.ErrorText>
                                            {errors.email?.message}
                                        </Field.ErrorText>
                                    </Field.Root>
                                    <Field.Root invalid={!!errors.root}>
                                        <Button
                                            disabled={
                                                isSubmitting || isFormSubmitted
                                            }
                                            type="submit"
                                            maxW="fit-content"
                                            size="lg"
                                            bg="blue.solid"
                                        >
                                            {isFormSubmitted
                                                ? 'Submitted'
                                                : isSubmitting
                                                ? 'Submitting registration...'
                                                : 'Submit'}
                                        </Button>
                                        <Field.ErrorText>
                                            {errors.root?.message}
                                        </Field.ErrorText>
                                    </Field.Root>
                                    {isFormSubmitted && (
                                        <>
                                        <Text
                                            color="fg.success"
                                            fontWeight="semibold"
                                        >
                                            Registration successful. Thank you
                                            for signing up!
                                        </Text>
                                        <Button
                                            onClick={() => handleAddToCalendarClick(googleEventProps)}>
                                            <FaGoogle/>
                                            Add to Google Calendar
                                        </Button>
                                        </>
                                    )}
                                </Stack>
                            </form>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button
                                    disabled={isSubmitting || isFormSubmitted}
                                    variant="subtle"
                                    size="lg"
                                    onClick={() => reset()}
                                >
                                    Cancel
                                </Button>
                            </Dialog.ActionTrigger>
                            <Dialog.ActionTrigger asChild>
                                <Button
                                    disabled={!isFormSubmitted}
                                    size="lg"
                                    bg="blue.solid"
                                    onClick={() => {
                                        reset();
                                        setIsFormSubmitted(false);
                                    }}
                                >
                                    Done
                                </Button>
                            </Dialog.ActionTrigger>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default SignupCard;

