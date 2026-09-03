import React from 'react';
import { Route } from 'react-router-dom';
import ShopFloorDashboard from '../pages/dashboards/ShopFloorDashboard';

export const shop_floorAdminRoutes = (
    <>
        <Route index element={<ShopFloorDashboard />} />
    </>
);
