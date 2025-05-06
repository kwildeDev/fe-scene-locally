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
import { UserContext } from '../contexts/userContext.ts';
import { useContext, useState } from 'react';
import { postAttendee } from '../api.ts';
import { GoogleCalendarEvent } from './IndividualEvent.tsx';
import supabase from '../utils/supabaseClient.ts';


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
    name: string | undefined
): string | undefined => {
    if (!name) {
        return name;
    }
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

const schema = z.object({
    firstName: z.string().transform(capitaliseFirstCharacter),
    lastName: z.string().transform(capitaliseFirstCharacter),
    email: z.string().email(),
});

type Formfields = z.infer<typeof schema>;

const SignupCard: React.FC<SignupCardProps> = ({
    event_id,
    title,
    googleEventProps,
}) => {
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const context = useContext(UserContext);
    const user = context?.user;
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
            firstName: user?.first_name,
            lastName: user?.last_name,
            email: user?.email,
        },
        resolver: zodResolver(schema),
    });

    const handleAddToCalendarClick = async (googleEventProps) => {
        try {
            const response = await fetch(
                'https://ocqrrsxycaqegtbztqal.supabase.co/functions/v1/add-to-calendar',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    
                    //headers: {
                    //    Authorization: `Bearer ${
                    //        supabase.auth.getSession().data.session.access_token
                    //    }`,
                    //    'Content-Type': 'application/json',
                    //},
                    body: JSON.stringify(googleEventProps),
                }
            );
            const result = await response.json();
            console.log('Event added:', result);
        }
        catch (error) {
            console.error('Failed to add event:', error);
        }
    };

    const onSubmit: SubmitHandler<Formfields> = (data) => {
        const signupCardData: SignupCardData = {
            user_id: userId,
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            is_registered_user: isRegisteredUser,
        };
        postAttendee(event_id, signupCardData)
            .then((attendee) => {
                setIsFormSubmitted(true);
                console.log(attendee);
            })
            .catch((error) => {
                setError('root', {
                    message: 'Event registration could not be submitted',
                });
            });
    };

    return (
        <Dialog.Root
            closeOnEscape={false}
            closeOnInteractOutside={false}
            modal={true}
        >
            <Dialog.Trigger asChild>
                <Button bg="blue.solid" size="lg">
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
                                        <Field.Label>First name</Field.Label>
                                        <Input
                                            {...register('firstName')}
                                            type="text"
                                            placeholder="First Name"
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
                                        <Field.Label>Last name</Field.Label>
                                        <Input
                                            {...register('lastName')}
                                            type="text"
                                            placeholder="Last Name"
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
                                        <Field.Label>Email</Field.Label>
                                        <Input
                                            {...register('email')}
                                            type="text"
                                            placeholder="Email"
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
                                            color="green"
                                            fontWeight="semibold"
                                        >
                                            Registration successful. Thank you
                                            for signing up!
                                        </Text>
                                        <Button
                                            onClick={handleAddToCalendarClick}>
                                            Add to calendar
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

/*

const addToCalendar = async (googleEventProps) => {
  try {
    const response = await fetch("https://ocqrrsxycaqegtbztqal.supabase.co/functions/v1/add-to-calendar", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${supabase.auth.getSession().data.session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(googleEventProps),
    });

    const result = await response.json();
    console.log("Event added:", result);
  } catch (error) {
    console.error("Failed to add event:", error);
  }
};

*/
