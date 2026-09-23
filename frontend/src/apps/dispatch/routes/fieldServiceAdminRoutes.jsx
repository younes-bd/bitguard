import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import DispatchDashboard from '../pages/dashboards/DispatchDashboardPage';

export const fieldServiceAdminRoutes = (
    <React.Fragment>
        <Route index element={<DispatchDashboard />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
