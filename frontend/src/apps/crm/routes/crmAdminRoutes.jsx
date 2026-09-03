import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import OnboardingWizard from '../pages/modals/OnboardingWizard';
import CrmDashboard from '../pages/dashboards/CrmDashboard';
import ClientList from '../pages/lists/ClientList';
import ClientCreate from '../pages/profiles/ClientCreate';
import ClientDetail from '../pages/profiles/ClientDetail';
import ContactList from '../pages/lists/ContactList';

// New Phase 2 Components
import LeadList from '../pages/lists/LeadList';
import LeadDetail from '../pages/LeadDetail';
import Pipeline from '../pages/features/Pipeline';
import DealDetail from '../pages/DealDetail';

import InteractionList from '../pages/lists/InteractionList';
import OrderList from '../pages/lists/OrderList';
import CrmSettings from '../pages/settings/CrmSettings_new';
import CrmReportPage from '../pages/dashboards/CrmReportPage';
import SalesCollateral from '../pages/dashboards/SalesCollateral';
import Forecast from '../pages/dashboards/Forecast';
import LeadsReport from '../pages/dashboards/LeadsReport';
import ActivitiesReport from '../pages/dashboards/ActivitiesReport';
import PipelineSettings from '../pages/settings/PipelineSettings';
import LostReasons from '../pages/settings/LostReasons';
import TeamList from '../pages/lists/TeamList';

export const crmAdminRoutes = (
    <>
        <Route index element={<CrmDashboard />} />
        <Route path="overview" element={<CrmDashboard />} />
        <Route path="clients" element={<ClientList />} />
        <Route path="onboarding" element={<OnboardingWizard />} />
        <Route path="clients/create" element={<ClientCreate />} />
        <Route path="clients/:id" element={<ClientDetail />} />

        {/* Dedicated views for each CRM entity */}
        <Route path="contacts" element={<ContactList />} />
        <Route path="leads" element={<LeadList />} />
        <Route path="leads/:id" element={<LeadDetail />} />
        <Route path="pipeline" element={<Pipeline />} />
        <Route path="deals" element={<Pipeline />} />
        <Route path="deals/:id" element={<DealDetail />} />

        <Route path="activities" element={<InteractionList />} />
        <Route path="collateral" element={<SalesCollateral />} />

        {/* Keep legacy routes aliased just in case */}
        <Route path="contracts" element={<Navigate to="/admin/contracts" replace />} />
        <Route path="quotes" element={<Navigate to="/admin/sales/quotes" replace />} />
        <Route path="quotes/:id" element={<Navigate to="/admin/sales/quotes" replace />} />
        <Route path="interactions" element={<InteractionList />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="settings" element={<CrmSettings />} />
        <Route path="reports" element={<CrmReportPage />} />
        
        {/* Missing Phase 3 Routes */}
        <Route path="forecast" element={<Forecast />} />
        <Route path="leads-report" element={<LeadsReport />} />
        <Route path="activities-report" element={<ActivitiesReport />} />
        <Route path="pipeline-settings" element={<PipelineSettings />} />
        <Route path="lost-reasons" element={<LostReasons />} />
        
        {/* Teams and Mining */}
        <Route path="teams" element={<TeamList />} />
        <Route path="mining" element={<SalesCollateral />} />
    </>
);
