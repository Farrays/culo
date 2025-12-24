import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initSentry } from './utils/sentry';
import { initializeAnalytics, trackEvent } from './utils/analytics';
import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

// Initialize error tracking (only in production with DSN configured)
initSentry();

// Initialize analytics based on existing consent (if any)
// This runs on page load to restore analytics if user previously consented
initializeAnalytics();

// Core Web Vitals monitoring
function sendToAnalytics(metric: Metric) {
  // Send metrics to Google Analytics (trackEvent checks consent internally)
  trackEvent(metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_category: 'Web Vitals',
    event_label: metric.id,
    non_interaction: true,
  });

  // Send to Sentry (if configured) - Sentry is considered essential for error tracking
  if (window.Sentry && import.meta.env.PROD) {
    window.Sentry.captureMessage(`Web Vital: ${metric.name}`, {
      level: 'info',
      tags: {
        'web-vital': metric.name,
        rating: metric.rating,
      },
      contexts: {
        'web-vitals': {
          value: metric.value,
          delta: metric.delta,
          id: metric.id,
        },
      },
    });
  }
}

// Monitor all Core Web Vitals (FID replaced with INP in web-vitals v4+)
onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onFCP(sendToAnalytics);
onLCP(sendToAnalytics);
onTTFB(sendToAnalytics);

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
