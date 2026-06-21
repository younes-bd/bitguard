import React from 'react';
import { Route } from 'react-router-dom';

import ContractList from '../../crm/pages/lists/ContractList';
import QuoteList from '../../crm/pages/lists/QuoteList';
import SlaManager from '../pages/lists/SlaManager';
import SlaBreachesPage from '../../crm/pages/dashboards/SlaBreachesPage';
import ContractSettings from '../../crm/pages/settings/ContractSettings';
import ContractsDashboard from '../pages/dashboards/ContractsDashboard';
import ContractDetail from '../pages/details/ContractDetail';

export const contractsRoutes = (
    <>
        <Route index element={<ContractsDashboard />} />
        <Route path="list" element={<ContractList />} />
        <Route path="list/:id" element={<ContractDetail />} />
        <Route path="quotes" element={<QuoteList />} />
        <Route path="sla-tiers" element={<SlaManager />} />
        <Route path="sla-breaches" element={<SlaBreachesPage />} />
        <Route path="settings" element={<ContractSettings />} />
    </>
);
