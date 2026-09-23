import React from 'react';
import { Route } from 'react-router-dom';
import AmazonDashboard from '../pages/dashboards/AmazonDashboardPage';

export const amazonAdminRoutes = (
    <>
        <Route index element={<AmazonDashboard />} />
    </>
);
