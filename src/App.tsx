import './App.css';
import {
    ChakraProvider,
    createSystem,
    defaultConfig,
    defineConfig,
} from '@chakra-ui/react';
import Layout from './components/Layout';
import Router from './routes/Router';
import { UserContext, UserContextType, User } from './contexts/userContext';
import { useState } from 'react';

const config = defineConfig({
    theme: {
        tokens: {
            colors: {},
        },
    },
});

const system = createSystem(defaultConfig, config);

const App: React.FC = () => {
    
    // Simulate logged-in user
    const [user, setUser] = useState<User | null>({
        user_id: 7,
        email: 'attendee1@example.com',
        first_name: 'Oliver',
        last_name: 'Evans',
        role: 'attendee',
        organisation_id: null,
    });
    

    /*
    // Simulate logged-out user
    const [user, setUser] = useState<User | null>(null);
    */

    const userContextValue: UserContextType = {
        user,
        setUser,
    };

    return (
        <UserContext.Provider value={userContextValue}>
            <ChakraProvider value={system}>
                <Layout>
                    <Router />
                </Layout>
            </ChakraProvider>
        </UserContext.Provider>
    );
};

export default App;
