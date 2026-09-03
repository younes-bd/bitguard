import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import DocumentsDashboard from '../pages/dashboards/DocumentsDashboard';
import DocumentSettings from '../pages/settings/DocumentSettings';
import WorkspaceManager from '../pages/settings/WorkspaceManager';
import TagManager from '../pages/settings/TagManager';
import DocumentDetail from '../pages/details/DocumentDetail';
import SpreadsheetEditor from '../pages/features/SpreadsheetEditor';

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
