import React from 'react';
import { Route } from 'react-router-dom';
import MrpDashboard from '../pages/dashboards/MrpDashboard';
import ManufacturingOrderList from '../pages/lists/ManufacturingOrderList';
import ManufacturingOrderDetail from '../pages/details/ManufacturingOrderDetail';
import BomList from '../pages/lists/BomList';
import BomDetail from '../pages/details/BomDetail';

export const mrpRoutes = (
    <>
        <Route path="overview" element={<MrpDashboard />} />
        <Route path="orders" element={<ManufacturingOrderList />} />
        <Route path="orders/:id" element={<ManufacturingOrderDetail />} />
        <Route path="boms" element={<BomList />} />
        <Route path="boms/:id" element={<BomDetail />} />
    </>
);
