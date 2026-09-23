import React from 'react';
import { Route } from 'react-router-dom';
import QualityDashboard from '../pages/dashboards/QualityDashboardPage';

export const qualityAdminRoutes = (
    <>
        <Route index element={<QualityDashboard />} />
        {/* Add module specific routes here */}
    </>
);

