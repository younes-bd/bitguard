import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import AssetDashboard from '../pages/dashboards/AssetDashboard';
import AssetList from '../pages/lists/AssetList';
import AssetDetail from '../pages/details/AssetDetail';
import AssetDepreciation from '../pages/features/AssetDepreciation';
import LicenseManager from '../pages/lists/LicenseManager';
import ItamSettings from '../pages/settings/ItamSettings';

export const maintenanceAdminRoutes = (
    <React.Fragment>
        <Route index element={<AssetDashboard />} />
        <Route path="maintenance" element={<AssetList />} />
        <Route path="assets/:id" element={<AssetDetail />} />
        <Route path="depreciation" element={<AssetDepreciation />} />
        <Route path="licenses" element={<LicenseManager />} />
        <Route path="settings" element={<ItamSettings />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
