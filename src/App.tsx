import './App.css';
import {
    ChakraProvider,
    createSystem,
    defaultConfig,
    defineConfig,
} from '@chakra-ui/react';
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
    
    const [user, setUser] = useState<User | null>(null);

    const userContextValue: UserContextType = {
    user,
    setUser,
};

    return (
        <UserContext.Provider value={userContextValue}>
            <ChakraProvider value={system}>
                <Router />
            </ChakraProvider>
        </UserContext.Provider>
    );
};

export default App;
