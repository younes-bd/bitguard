import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import KnowledgeDashboard from '../pages/dashboards/KnowledgeDashboard';

export const knowledgeAdminRoutes = (
    <React.Fragment>
        <Route index element={<KnowledgeDashboard />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
