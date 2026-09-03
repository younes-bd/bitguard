import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import EventsDashboard from '../pages/dashboards/EventsDashboard';

export const eventsAdminRoutes = (
    <React.Fragment>
        <Route index element={<EventsDashboard />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
