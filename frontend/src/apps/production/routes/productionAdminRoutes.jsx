import React from 'react';
import { Route } from 'react-router-dom';
import ProductionDashboard from '../pages/dashboards/ProductionDashboardPage';

export const productionAdminRoutes = (
    <>
        <Route index element={<ProductionDashboard />} />
    </>
);
