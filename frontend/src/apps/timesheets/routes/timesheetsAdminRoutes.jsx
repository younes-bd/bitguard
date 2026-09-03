import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import TimesheetsPage from '../pages/TimesheetsPage';

export const timesheetsAdminRoutes = (
    <React.Fragment>
        <Route index element={<TimesheetsPage />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
