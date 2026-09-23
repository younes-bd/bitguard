import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import LiveChatDashboard from '../pages/dashboards/LiveChatDashboardPage';

export const messagingAdminRoutes = (
    <React.Fragment>
        <Route index element={<LiveChatDashboard />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
