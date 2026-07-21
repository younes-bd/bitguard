import React from 'react';
import { Route } from 'react-router-dom';
import ProjectsDashboard from '../pages/dashboards/ProjectsDashboard';
import ProjectDashboard from '../pages/dashboards/ProjectDashboard';
import ProjectList from '../pages/core/ProjectList';
import KanbanBoard from '../pages/features/KanbanBoard';
import ProjectDetail from '../pages/details/ProjectDetail';
import ProjectReports from '../pages/features/ProjectReports';
import ResourceManagement from '../pages/features/ResourceManagement';
import GlobalTimeTracking from '../pages/features/GlobalTimeTracking';
import TimesheetList from '../pages/lists/TimesheetList';
import GanttView from '../pages/features/GanttView';
import SprintBoard from '../pages/features/SprintBoard';

export const projectsRoutes = (
    <>
        <Route index element={<ProjectsDashboard />} />
        <Route path="list" element={<ProjectList />} />
        <Route path="resources" element={<ResourceManagement />} />
        <Route path="timesheets" element={<TimesheetList />} />
        <Route path="reports" element={<ProjectReports />} />
        <Route path="gantt" element={<GanttView />} />
        <Route path="sprints" element={<SprintBoard />} />
        <Route path=":id" element={<ProjectDetail />} />
        <Route path=":id/kanban" element={<KanbanBoard />} />
        <Route path=":id/dashboard" element={<ProjectDashboard />} />
        <Route path="kanban" element={<KanbanBoard />} />
    </>
);
