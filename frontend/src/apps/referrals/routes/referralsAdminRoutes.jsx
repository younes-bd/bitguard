import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import ReferralsDashboard from '../pages/dashboards/ReferralsDashboard';

export const referralsAdminRoutes = (
    <React.Fragment>
        <Route index element={<ReferralsDashboard />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
