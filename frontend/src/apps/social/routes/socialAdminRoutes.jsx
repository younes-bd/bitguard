import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import SocialDashboard from '../pages/dashboards/SocialDashboard';

export const socialAdminRoutes = (
    <React.Fragment>
        <Route index element={<SocialDashboard />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
