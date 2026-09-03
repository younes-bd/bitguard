import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import EsgDashboardPage from '../pages/EsgDashboardPage';

export const esgAdminRoutes = (
    <React.Fragment>
        <Route index element={<EsgDashboardPage />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
