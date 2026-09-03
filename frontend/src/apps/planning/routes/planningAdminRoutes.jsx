import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import PlanningDashboard from '../pages/dashboards/PlanningDashboard';
// Ensure these pages exist or we will create them next
import ScheduleByEmployee from '../pages/features/ScheduleByEmployee';
import ScheduleByRole from '../pages/features/ScheduleByRole';
import ScheduleByProject from '../pages/features/ScheduleByProject';
import PlanningAnalysis from '../pages/features/PlanningAnalysis';
import PlanningSettings from '../pages/features/PlanningSettings';
import PlanningRoles from '../pages/features/PlanningRoles';

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

