import './App.css';
import { Route, Routes } from 'react-router-dom';
import EventList from './components/EventList';
import IndividualEvent from './components/IndividualEvent';
import Header from './components/Header';
import {
    ChakraProvider,
    Container,
    createSystem,
    defaultConfig,
    defineConfig,
} from '@chakra-ui/react';


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
            <Header />
            <Container>
            <Routes>
                <Route
                    path="/"
                    element={<EventList />}
                />
                <Route
                    path="/events/:event_id"
                    element={<IndividualEvent />}
                />
            </Routes>
            </Container>
        </ChakraProvider>
    );
};

export default App;
