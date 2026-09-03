import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import MassMailingPage from '../pages/MassMailingPage';

export const mass_mailingAdminRoutes = (
    <React.Fragment>
        <Route index element={<MassMailingPage />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
