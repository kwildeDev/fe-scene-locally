import './App.css';
import {
    ChakraProvider,
    createSystem,
    defaultConfig,
    defineConfig,
} from '@chakra-ui/react';
import Router from './routes/Router';
import { UserProvider } from './contexts/UserProvider';

const config = defineConfig({
    theme: {
        tokens: {
            colors: {},
        },
    },
});

const system = createSystem(defaultConfig, config);

const App: React.FC = () => {

    return (
        <ChakraProvider value={system}>
            <UserProvider>
                <Router />
            </UserProvider>
        </ChakraProvider>
    );
};

export default App;
