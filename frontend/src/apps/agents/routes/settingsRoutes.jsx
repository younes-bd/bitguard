import React from 'react';
import { Route } from 'react-router-dom';
import AgentDashboard from '../pages/dashboards/AgentDashboardPage';

export default [
    <Route key="virtual-agents" path="virtual-agents" element={<AgentDashboard />} />
];
