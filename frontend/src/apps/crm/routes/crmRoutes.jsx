import React from 'react';
import { Route } from 'react-router-dom';
import OnboardingWizard from '../pages/OnboardingWizard';
import CrmDashboard from '../pages/dashboards/CrmDashboard';
import ClientList from '../pages/ClientList';
import ClientCreate from '../pages/ClientCreate';
import ClientDetail from '../pages/ClientDetail';
import ContactList from '../pages/ContactList';
import LeadList from '../pages/LeadList';
import DealsPipeline from '../pages/DealsPipeline';
import TicketList from '../pages/TicketList';
import TicketCreate from '../pages/TicketCreate';
import TicketDetail from '../pages/TicketDetail';
import ContractList from '../pages/ContractList';
import QuoteList from '../pages/QuoteList';
import QuoteDetail from '../pages/QuoteDetail';
import InteractionList from '../pages/InteractionList';
import OrderList from '../pages/OrderList';
import CrmSettings from '../pages/CrmSettings';
import CrmReportPage from '../pages/CrmReportPage';

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

        {/* Keep legacy routes aliased just in case */}
        <Route path="tickets" element={<TicketList />} />
        <Route path="tickets/create" element={<TicketCreate />} />
        <Route path="tickets/:id" element={<TicketDetail />} />
        <Route path="contracts" element={<ContractList />} />
        <Route path="quotes" element={<QuoteList />} />
        <Route path="quotes/:id" element={<QuoteDetail />} />
        <Route path="interactions" element={<InteractionList />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="settings" element={<CrmSettings />} />
        <Route path="reports" element={<CrmReportPage />} />
    </>
);
