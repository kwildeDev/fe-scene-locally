import './App.css';
import { Route, Routes } from 'react-router-dom';
import EventList from './components/EventList';
import Header from './components/Header';
import { ChakraProvider, createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {}
    },
  },
})

const system = createSystem(defaultConfig, config)

const App: React.FC = () => {
    return (
        <ChakraProvider value={system}>
        <Header/>
        <Routes>
            <Route
                path="/"
                element={<EventList />}
            />
        </Routes>
        </ChakraProvider>
    );
};

export default App;
