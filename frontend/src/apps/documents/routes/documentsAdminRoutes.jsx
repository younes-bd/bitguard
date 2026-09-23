import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import DocumentsDashboard from '../pages/dashboards/DocumentsDashboardPage';
import DocumentSettings from '../pages/settings/DocumentSettingsPage';
import WorkspaceManager from '../pages/settings/WorkspaceManagerPage';
import TagManager from '../pages/settings/TagManagerPage';
import DocumentDetail from '../pages/details/DocumentDetailPage';
import SpreadsheetEditor from '../pages/features/SpreadsheetEditorPage';

export const documentsAdminRoutes = (
    <React.Fragment>
        <Route index element={<DocumentsDashboard />} />
        <Route path="documents" element={<DocumentsDashboard />} />
        <Route path="documents/:id" element={<DocumentDetail />} />
        <Route path="spreadsheet/new" element={<SpreadsheetEditor />} />
        <Route path="spreadsheet/:id" element={<SpreadsheetEditor />} />
        <Route path="workspaces" element={<WorkspaceManager />} />
        <Route path="tags" element={<TagManager />} />
        <Route path="settings" element={<DocumentSettings />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
