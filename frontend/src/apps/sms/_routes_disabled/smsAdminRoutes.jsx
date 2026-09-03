import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import SmsDashboard from '../pages/dashboards/SmsDashboard';

export const smsAdminRoutes = (
    <React.Fragment>
        <Route index element={<SmsDashboard />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
