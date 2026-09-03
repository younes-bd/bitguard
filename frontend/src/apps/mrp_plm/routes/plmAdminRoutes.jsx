import React from 'react';
import { Route } from 'react-router-dom';
import PlmDashboard from '../pages/dashboards/PlmDashboard';

export const plmAdminRoutes = (
    <>
        <Route index element={<PlmDashboard />} />
        {/* Add module specific routes here */}
    </>
);

