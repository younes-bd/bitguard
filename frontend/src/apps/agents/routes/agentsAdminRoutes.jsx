import React from 'react';
import { Route } from 'react-router-dom';
import AgentDashboard from '../pages/dashboards/AgentDashboardPage';
import AgentForm from '../pages/forms/AgentFormPage';
import AgentLogs from '../pages/dashboards/AgentLogsPage';
import UsageDashboard from '../pages/dashboards/UsageDashboardPage';

export const agentsAdminRoutes = (
    <>
        <Route index element={<AgentDashboard />} />
        <Route path="agents" element={<AgentDashboard />} />
        <Route path="agents/new" element={<AgentForm />} />
        <Route path="agents/:id" element={<AgentForm />} />
        <Route path="logs" element={<AgentLogs />} />
        <Route path="usage" element={<UsageDashboard />} />
    </>
);
