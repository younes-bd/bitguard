import React from 'react';
import { Route } from 'react-router-dom';

import ContractList from '../pages/lists/ContractListPage';
import SlaBreachesPage from '../pages/dashboards/SlaBreachesPage';
import SignSettings from '../pages/settings/SignSettingsPage';
import SignDashboard from '../pages/dashboards/SignDashboardPage';
import ContractDetail from '../pages/details/ContractDetailPage';
import SlaManager from '../pages/lists/SlaManagerPage';

export const signAdminRoutes = (
    <>
        <Route index element={<SignDashboard />} />
        <Route path="list" element={<ContractList />} />
        <Route path="list/:id" element={<ContractDetail />} />
        <Route path="sla-tiers" element={<SlaManager />} />
        <Route path="sla-breaches" element={<SlaBreachesPage />} />
        <Route path="settings" element={<SignSettings />} />
    </>
);
