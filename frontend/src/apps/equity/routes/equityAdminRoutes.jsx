import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import EquityDashboardPage from '../pages/EquityDashboardPage';

export const equityAdminRoutes = (
    <React.Fragment>
        <Route index element={<EquityDashboardPage />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
