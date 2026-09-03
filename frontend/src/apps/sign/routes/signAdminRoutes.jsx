import React from 'react';
import { Route } from 'react-router-dom';

import ContractList from '../pages/lists/ContractList';
import SlaBreachesPage from '../pages/dashboards/SlaBreachesPage';
import SignSettings from '../pages/settings/SignSettings';
import SignDashboard from '../pages/dashboards/SignDashboard';
import ContractDetail from '../pages/details/ContractDetail';
import SlaManager from '../pages/lists/SlaManager';

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
