import React, { Suspense } from 'react';
import './core/config/i18n';
import { createRoot } from 'react-dom/client';
import App from './core/App';
import './core/styles/index.css';

import ErrorBoundary from './core/components/shared/core/ErrorBoundary';
import SuspenseLoader from './core/components/shared/core/SuspenseLoader';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <Suspense fallback={<SuspenseLoader />}>
                <App />
            </Suspense>
        </ErrorBoundary>
    </React.StrictMode>
);
