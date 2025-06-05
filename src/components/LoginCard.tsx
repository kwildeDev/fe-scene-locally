import { Button, Dialog, Field, Input, Portal, Stack } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserContext } from '../contexts/userContext.ts';
import { useContext, useState } from 'react';
import { getUserDetails, loginUser, LoginData } from '../api.ts';
import { useNavigate, useLocation } from 'react-router-dom';

const schema = z.object({
    email: z.string().email(),
    password: z.string(),
});

type Formfields = z.infer<typeof schema>;

const LoginCard: React.FC = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const context = useContext(UserContext);
    const user = context?.user;
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
        loginUser(loginData)
            .then((token) => {
                if (typeof token === 'string') {
                    localStorage.setItem('jwtToken', token);
                } else {
                    throw new Error('Invalid token type received');
                }
                return getUserDetails(token);
            })
            .then((userData) => {
                if (context && context.setUser) {
                    context.setUser({
                        user_id: userData.user_id,
                        email: userData.email,
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        role: userData.role,
                        organisation_id: userData.organisation_id,
                        organisation_name: userData.organisation_name
                    });
                }
                setIsLoggingIn(false);
            })
            .catch((error) => {
                setError('root', {
                    message: `${error?.msg || 'An unexpected error occurred during login.'}`,
                });
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
