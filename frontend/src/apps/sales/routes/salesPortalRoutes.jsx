import React from 'react';
import { Route } from 'react-router-dom';
import PortalQuotesPage from '../pages/portal/PortalQuotesPage';
import PortalOrdersPage from '../pages/portal/PortalOrdersPage';

export const salesPortalRoutes = (
    <React.Fragment>
        <Route path='quotes' element={<PortalQuotesPage />} />
        <Route path='orders' element={<PortalOrdersPage />} />
    </React.Fragment>
);
