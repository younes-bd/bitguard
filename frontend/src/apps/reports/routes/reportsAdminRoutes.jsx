import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import ReportsDashboard from '../pages/dashboards/ReportsDashboardPage';
import TemplateManager from '../pages/templates/TemplateManagerPage';
import GeneratedDocuments from '../pages/generated/GeneratedDocumentsPage';
import ReportsSettings from '../pages/settings/ReportsSettingsPage';

export const reportsAdminRoutes = (
    <React.Fragment>
        <Route index element={<ReportsDashboard />} />
        <Route path="templates" element={<TemplateManager />} />
        <Route path="generated" element={<GeneratedDocuments />} />
        <Route path="settings" element={<ReportsSettings />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
