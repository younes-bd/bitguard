import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import FieldServiceDashboard from '../pages/dashboards/FieldServiceDashboard';

export const fieldServiceAdminRoutes = (
    <React.Fragment>
        <Route index element={<FieldServiceDashboard />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
