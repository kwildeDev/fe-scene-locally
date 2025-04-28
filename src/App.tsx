import './App.css';
import { ChakraProvider, createSystem, defaultConfig, defineConfig, } from '@chakra-ui/react';
import Layout from './components/Layout';
import Router from './routes/Router';

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
            <Layout>
                <Router />
            </Layout>
        </ChakraProvider>
    );
};

export default App;
