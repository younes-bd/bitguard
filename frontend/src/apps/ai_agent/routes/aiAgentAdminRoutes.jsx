import React from 'react';
import { Route } from 'react-router-dom';
import AgentDashboard from '../pages/dashboards/AgentDashboard';
import AgentForm from '../pages/forms/AgentForm';
import AgentLogs from '../pages/dashboards/AgentLogs';
import UsageDashboard from '../pages/dashboards/UsageDashboard';

export const aiAgentAdminRoutes = (
    <>
        <Route index element={<AgentDashboard />} />
        <Route path="agents" element={<AgentDashboard />} />
        <Route path="agents/new" element={<AgentForm />} />
        <Route path="agents/:id" element={<AgentForm />} />
        <Route path="logs" element={<AgentLogs />} />
        <Route path="usage" element={<UsageDashboard />} />
    </>
);
