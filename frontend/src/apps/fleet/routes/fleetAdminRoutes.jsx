import React from 'react';
import { Route } from 'react-router-dom';
import FleetDashboard from '../pages/dashboards/FleetDashboard';

export const fleetAdminRoutes = (
    <>
        <Route index element={<FleetDashboard />} />
        {/* Add module specific routes here */}
    </>
);

