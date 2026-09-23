import React from 'react';
import { Route } from 'react-router-dom';
import ManufacturingDashboard from '../pages/dashboards/ManufacturingDashboardPage';
import ManufacturingOrderList from '../pages/lists/ManufacturingOrderListPage';
import ManufacturingOrderDetail from '../pages/details/ManufacturingOrderDetailPage';
import BomList from '../pages/lists/BomListPage';
import BomDetail from '../pages/details/BomDetailPage';
import WorkOrderList from '../pages/lists/WorkOrderListPage';
import WorkOrderDetail from '../pages/details/WorkOrderDetailPage';

export const manufacturingAdminRoutes = (
    <>
        <Route path="overview" element={<ManufacturingDashboard />} />
        <Route path="orders" element={<ManufacturingOrderList />} />
        <Route path="orders/:id" element={<ManufacturingOrderDetail />} />
        <Route path="boms" element={<BomList />} />
        <Route path="boms/:id" element={<BomDetail />} />
        <Route path="work-orders" element={<WorkOrderList />} />
        <Route path="work-orders/:id" element={<WorkOrderDetail />} />
    </>
);
