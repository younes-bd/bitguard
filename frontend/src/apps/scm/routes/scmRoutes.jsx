import React from 'react';
import { Route } from 'react-router-dom';
import ScmDashboard from '../pages/dashboards/ScmDashboard';
import InventoryList from '../pages/InventoryList';
import VendorList from '../pages/VendorList';
import PurchaseOrderList from '../pages/PurchaseOrderList';
import ScmSettings from '../pages/ScmSettings';
import ScmReportPage from '../pages/ScmReportPage';

export const scmRoutes = (
    <>
        <Route index element={<ScmDashboard />} />
        <Route path="overview" element={<ScmDashboard />} />
        <Route path="inventory" element={<InventoryList />} />
        <Route path="vendors" element={<VendorList />} />
        <Route path="purchase-orders" element={<PurchaseOrderList />} />
        <Route path="settings" element={<ScmSettings />} />
        <Route path="reports" element={<ScmReportPage />} />
    </>
);
