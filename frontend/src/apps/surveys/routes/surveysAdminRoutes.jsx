import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import SurveysDashboard from '../pages/dashboards/SurveysDashboard';

export const surveysAdminRoutes = (
    <React.Fragment>
        <Route index element={<SurveysDashboard />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
