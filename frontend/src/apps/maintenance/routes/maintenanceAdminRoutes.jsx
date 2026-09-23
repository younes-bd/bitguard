import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import AssetDashboard from '../pages/dashboards/AssetDashboardPage';
import AssetList from '../pages/lists/AssetListPage';
import AssetDetail from '../pages/details/AssetDetailPage';
import AssetDepreciation from '../pages/features/AssetDepreciationPage';
import LicenseManager from '../pages/lists/LicenseManagerPage';
import ItamSettings from '../pages/settings/ItamSettingsPage';

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
