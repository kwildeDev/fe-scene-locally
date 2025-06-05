import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, UserContextType } from './userContext';
import { loginUser as apiLoginUser, getUserDetails, LoginData } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

export const UserContext = createContext<UserContextType | undefined>(
    undefined
);

interface UserProviderProps {
    children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);

    const login = (data: LoginData): Promise<void> => {
        return apiLoginUser(data)
            .then((token) => {
                if (typeof token === 'string') {
                    localStorage.setItem('jwtToken', token);
                    return getUserDetails(token);
                } else {
                    throw new Error(
                        'Invalid token type received from login API'
                    );
                }
            })
            .then((userData) => {
                setUser(userData);
                console.log('Login successful, user state updated.');
            })
            .catch((error) => {
                console.error('Login failed in UserProvider:', error);
                localStorage.removeItem('jwtToken');
                setUser(null);
                throw error;
            });
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        setUser(null);
        console.log('User logged out, token removed.');
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');

        if (storedToken) {
            console.log(
                'UserProvider: Found token in localStorage, attempting re-authentication...'
            );
            getUserDetails(storedToken)
                .then((userData) => {
                    console.log('UserProvider: Re-authentication successful.');
                    setUser(userData);
                })
                .catch((error) => {
                    console.error(
                        'UserProvider: Re-authentication failed:',
                        error
                    );
                    localStorage.removeItem('jwtToken');
                    setUser(null);
                })
                .finally(() => {
                    setLoadingUser(false);
                });
        } else {
            console.log('UserProvider: No token found. User is logged out.');
            setLoadingUser(false);
        }
    }, []);

    const userContextValue: UserContextType & {
        login: typeof login;
        logout: typeof logout;
    } = {
        user,
        setUser,
        login,
        logout,
    };

    if (loadingUser) {
        return <LoadingSpinner />;
    }

    return (
        <UserContext.Provider value={userContextValue}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
