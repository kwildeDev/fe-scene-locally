import { Button, Dialog, Field, Input, Portal, Stack } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { LoginData } from '../api.ts';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserProvider.tsx';

const schema = z.object({
    email: z.string().email(),
    password: z.string(),
});

type Formfields = z.infer<typeof schema>;

const LoginCard: React.FC = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user, login } = useUser();
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
    
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm<Formfields>({
        defaultValues: {
            email: user?.email,
        },
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<Formfields> = (data) => {
        const loginData: LoginData = {
            email: data.email,
            password: data.password,
        };
        setIsLoggingIn(true);
        login(loginData)
            .then(() => {
                setIsLoggingIn(false);
            })
            .catch((error) => {
                setError('root', {
                    message: `${(error as any)?.msg || 'An unexpected error occurred during login.'}`,
                });
                setIsLoggingIn(false);
            });
    };

    return (
        <Dialog.Root
            defaultOpen={!user && pathname === "/users/me"}
            closeOnEscape={false}
            closeOnInteractOutside={false}
            modal={true}
        >
            {pathname !== "/users/me" && (
            <Dialog.Trigger asChild>
                <Button size="md" colorPalette="blue">
                    Sign In
                </Button>
            </Dialog.Trigger>
            )}
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Welcome Back</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body pb="4">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Stack>
                                    <Field.Root invalid={!!errors.email}>
                                        <Field.Label>Email</Field.Label>
                                        <Input
                                            {...register('email')}
                                            type="text"
                                            placeholder="Email"
                                            required
                                            autoComplete='email'
                                        />
                                        <Field.ErrorText>
                                            {errors.email?.message}
                                        </Field.ErrorText>
                                    </Field.Root>
                                    <Field.Root invalid={!!errors.password}>
                                        <Field.Label>Password</Field.Label>
                                        <Input
                                            {...register('password')}
                                            type="password"
                                            placeholder="Password"
                                            required
                                            autoComplete='current-password'
                                        />
                                        <Field.ErrorText>
                                            {errors.password?.message}
                                        </Field.ErrorText>
                                    </Field.Root>
                                    <Field.Root invalid={!!errors.root}>
                                        <Button
                                            disabled={isLoggingIn}
                                            loading={isLoggingIn}
                                            type="submit"
                                            bg="blue.solid"
                                            size="lg"
                                        >
                                            Log In
                                        </Button>
                                        <Field.ErrorText>
                                            {errors.root?.message}
                                        </Field.ErrorText>
                                    </Field.Root>
                                </Stack>
                            </form>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button
                                    variant="subtle"
                                    size="lg"
                                    onClick={() => {
                                        reset();
                                        if (pathname === "/users/me") {
                                            navigate("/");
                                        } 
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Dialog.ActionTrigger>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default LoginCard;
