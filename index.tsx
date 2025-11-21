import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initSentry } from './utils/sentry';

// Initialize error tracking (only in production with DSN configured)
initSentry();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

// Detectar si hay contenido prerenderizado
const hasPrerenderedContent = rootElement.hasChildNodes();

if (hasPrerenderedContent) {
  // En producción con prerender: hidratar el HTML existente
  ReactDOM.hydrateRoot(
    rootElement,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // En desarrollo sin prerender: renderizar normalmente
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
