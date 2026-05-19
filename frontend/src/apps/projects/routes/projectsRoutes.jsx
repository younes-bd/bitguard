import React from 'react';
import { Route } from 'react-router-dom';
import ProjectsDashboard from '../pages/ProjectsDashboard';
import KanbanBoard from '../pages/KanbanBoard';
import ProjectDetail from '../pages/ProjectDetail';
import ProjectReports from '../pages/ProjectReports';
import ResourceManagement from '../pages/ResourceManagement';
import GlobalTimeTracking from '../pages/GlobalTimeTracking';

export const projectsRoutes = (
    <>
        <Route index element={<ProjectsDashboard />} />
        <Route path="resources" element={<ResourceManagement />} />
        <Route path="time" element={<GlobalTimeTracking />} />
        <Route path="reports" element={<ProjectReports />} />
        <Route path=":id" element={<ProjectDetail />} />
        <Route path=":id/kanban" element={<KanbanBoard />} />
        <Route path="kanban" element={<KanbanBoard />} />
    </>
);
