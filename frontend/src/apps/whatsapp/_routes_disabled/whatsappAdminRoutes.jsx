import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import WhatsAppDashboard from '../pages/dashboards/WhatsAppDashboard';

export const whatsappAdminRoutes = (
    <React.Fragment>
        <Route index element={<WhatsAppDashboard />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
