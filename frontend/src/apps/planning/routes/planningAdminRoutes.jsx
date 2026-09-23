import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import PlanningDashboard from '../pages/dashboards/PlanningDashboardPage';
// Ensure these pages exist or we will create them next
import ScheduleByEmployee from '../pages/features/ScheduleByEmployeePage';
import ScheduleByRole from '../pages/features/ScheduleByRolePage';
import ScheduleByProject from '../pages/features/ScheduleByProjectPage';
import PlanningAnalysis from '../pages/features/PlanningAnalysisPage';
import PlanningSettings from '../pages/features/PlanningSettingsPage';
import PlanningRoles from '../pages/features/PlanningRolesPage';

export const planningAdminRoutes = (
    <>
        <Route index element={<PlanningDashboard />} />
        <Route path="schedule/employee" element={<ScheduleByEmployee />} />
        <Route path="schedule/role" element={<ScheduleByRole />} />
        <Route path="schedule/project" element={<ScheduleByProject />} />
        <Route path="reports" element={<PlanningAnalysis />} />
        <Route path="settings" element={<PlanningSettings />} />
        <Route path="roles" element={<PlanningRoles />} />
    </>
);

