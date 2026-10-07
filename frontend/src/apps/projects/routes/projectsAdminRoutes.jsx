import React from 'react';
import { Route } from 'react-router-dom';
import ProjectsDashboard from '../pages/dashboards/ProjectsDashboardPage';
import ProjectDashboard from '../pages/dashboards/ProjectDashboardPage';
import ProjectList from '../pages/core/ProjectListPage';
import KanbanBoard from '../pages/features/KanbanBoardPage';
import ProjectDetail from '../pages/details/ProjectDetailPage';
import ProjectReports from '../pages/features/ProjectReportsPage';
import ResourceManagement from '../pages/features/ResourceManagementPage';
import GlobalTimeTracking from '../pages/features/GlobalTimeTrackingPage';
import TimesheetList from '../pages/lists/TimesheetListPage';
import GanttView from '../pages/features/GanttViewPage';
import SprintBoard from '../pages/features/SprintBoardPage';

export const projectsAdminRoutes = (
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
