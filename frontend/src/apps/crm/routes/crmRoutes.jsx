import React from 'react';
import { Route } from 'react-router-dom';
import OnboardingWizard from '../pages/modals/OnboardingWizard';
import CrmDashboard from '../pages/dashboards/CrmDashboard';
import ClientList from '../pages/lists/ClientList';
import ClientCreate from '../pages/profiles/ClientCreate';
import ClientDetail from '../pages/profiles/ClientDetail';
import ContactList from '../pages/lists/ContactList';
import LeadList from '../pages/lists/LeadList';
import DealsPipeline from '../pages/dashboards/DealsPipeline';
import ContractList from '../pages/lists/ContractList';
import QuoteList from '../pages/lists/QuoteList';
import QuoteDetail from '../pages/profiles/QuoteDetail';
import InteractionList from '../pages/lists/InteractionList';
import OrderList from '../pages/lists/OrderList';
import CrmSettings from '../pages/settings/CrmSettings';
import CrmReportPage from '../pages/dashboards/CrmReportPage';
import SalesCollateral from '../pages/dashboards/SalesCollateral';


export const crmRoutes = (
    <>
        <Route path="overview" element={<CrmDashboard />} />
        <Route path="clients" element={<ClientList />} />
        <Route path="onboarding" element={<OnboardingWizard />} />
        <Route path="clients/create" element={<ClientCreate />} />
        <Route path="clients/:id" element={<ClientDetail />} />

        {/* Dedicated views for each CRM entity */}
        <Route path="contacts" element={<ContactList />} />
        <Route path="leads" element={<LeadList />} />
        <Route path="deals" element={<DealsPipeline />} />

        <Route path="activities" element={<InteractionList />} />
        <Route path="collateral" element={<SalesCollateral />} />

        {/* Keep legacy routes aliased just in case */}
        <Route path="contracts" element={<ContractList />} />
        <Route path="quotes" element={<QuoteList />} />
        <Route path="quotes/:id" element={<QuoteDetail />} />
        <Route path="interactions" element={<InteractionList />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="settings" element={<CrmSettings />} />
        <Route path="reports" element={<CrmReportPage />} />
    </>
);
