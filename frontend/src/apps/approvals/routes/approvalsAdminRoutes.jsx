import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import ApprovalsDashboard from '../pages/dashboards/ApprovalsDashboardPage';
import ApprovalSettings from '../pages/settings/ApprovalSettingsPage';

export const approvalsAdminRoutes = (
    <React.Fragment>
        <Route index element={<ApprovalsDashboard />} />
        <Route path="settings" element={<ApprovalSettings />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
