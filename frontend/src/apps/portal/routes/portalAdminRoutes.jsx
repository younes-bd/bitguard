import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import PortalDashboard from '../pages/admin/dashboards/PortalDashboard';
import PortalAccessManager from '../pages/admin/lists/PortalAccessManager';
import PortalShareManager from '../pages/admin/lists/PortalShareManager';
import PortalClientView from '../pages/admin/details/PortalClientView';

export const portalAdminRoutes = (
    <React.Fragment>
        <Route index element={<PortalDashboard />} />
        <Route path="access" element={<PortalAccessManager />} />
        <Route path="shares" element={<PortalShareManager />} />
        <Route path=":clientId" element={<PortalClientView />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
