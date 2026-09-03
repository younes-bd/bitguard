import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import ReportingDashboard from '../pages/dashboards/ReportingDashboard';
import TemplateManager from '../pages/templates/TemplateManager';
import GeneratedDocuments from '../pages/generated/GeneratedDocuments';
import ReportingSettings from '../pages/settings/ReportingSettings';

export const reportingAdminRoutes = (
    <React.Fragment>
        <Route index element={<ReportingDashboard />} />
        <Route path="templates" element={<TemplateManager />} />
        <Route path="generated" element={<GeneratedDocuments />} />
        <Route path="settings" element={<ReportingSettings />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
