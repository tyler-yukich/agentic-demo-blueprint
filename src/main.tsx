import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/app.css';

const rootElement = document.getElementById('root')!;
rootElement.classList.add('readycurrent-root');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
