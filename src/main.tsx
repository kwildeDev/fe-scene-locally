import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
          <App />
    </BrowserRouter>
  </StrictMode>,
)

// Is Theme actually supposed to wrap around the App?