import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './core/App';
import './core/styles/index.css';

import ErrorBoundary from './core/components/shared/core/ErrorBoundary';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>
);
