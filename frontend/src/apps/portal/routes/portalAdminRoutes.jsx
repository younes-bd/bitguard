import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import PortalDashboard from '../pages/admin/dashboards/PortalDashboardPage';
import PortalAccessManager from '../pages/admin/lists/PortalAccessManagerPage';
import PortalShareManager from '../pages/admin/lists/PortalShareManagerPage';
import PortalClientView from '../pages/admin/details/PortalClientViewPage';

export const portalAdminRoutes = (
    <React.Fragment>
        <Route index element={<PortalDashboard />} />
        <Route path="access" element={<PortalAccessManager />} />
        <Route path="shares" element={<PortalShareManager />} />
        <Route path=":clientId" element={<PortalClientView />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
