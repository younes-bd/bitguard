import React, { Suspense } from 'react';
import './core/config/i18n';
import { createRoot } from 'react-dom/client';
import App from './core/App';
import './apps/shell/styles/index.css';

import ErrorBoundary from './apps/shell/components/layout/ErrorBoundary';
import SuspenseLoader from './apps/shell/components/layout/SuspenseLoader';

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
