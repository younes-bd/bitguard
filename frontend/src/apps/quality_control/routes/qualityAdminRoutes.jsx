import React from 'react';
import { Route } from 'react-router-dom';
import QualityDashboard from '../pages/dashboards/QualityDashboard';

export const qualityAdminRoutes = (
    <>
        <Route index element={<QualityDashboard />} />
        {/* Add module specific routes here */}
    </>
);

