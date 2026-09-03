import React from 'react';
import { Route } from 'react-router-dom';
import FrontdeskDashboard from '../pages/dashboards/FrontdeskDashboard';

export const frontdeskAdminRoutes = (
    <>
        <Route index element={<FrontdeskDashboard />} />
    </>
);
