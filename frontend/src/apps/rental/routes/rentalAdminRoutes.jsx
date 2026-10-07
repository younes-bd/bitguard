import React from 'react';
import { Route } from 'react-router-dom';
import RentalDashboard from '../pages/dashboards/RentalDashboardPage';

export const rentalAdminRoutes = (
    <>
        <Route index element={<RentalDashboard />} />
        {/* Add module specific routes here */}
    </>
);

