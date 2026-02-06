import React from 'react';
import { Route } from 'react-router-dom';
import CrmDashboard from './dashboards/CrmDashboard';
import ClientList from './pages/ClientList';
import ClientCreate from './pages/ClientCreate';
import ClientDetail from './pages/ClientDetail';
import DealsPipeline from './pages/DealsPipeline';
import TicketList from './pages/TicketList';
import TicketCreate from './pages/TicketCreate';
import TicketDetail from './pages/TicketDetail';
import ContractList from './pages/ContractList';
import QuoteList from './pages/QuoteList';
import QuoteDetail from './pages/QuoteDetail';
import InteractionList from './pages/InteractionList';
import OrderList from './pages/OrderList';

export const crmRoutes = (
    <>
        {/* Note: 'overview' is handled by the index route in AppRoutes, but we keep it aliased if needed */}
        <Route path="overview" element={<CrmDashboard />} />
        <Route path="clients" element={<ClientList />} />
        <Route path="clients/create" element={<ClientCreate />} />
        <Route path="clients/:id" element={<ClientDetail />} />
        <Route path="deals" element={<DealsPipeline />} />
        <Route path="tickets" element={<TicketList />} />
        <Route path="tickets/create" element={<TicketCreate />} />
        <Route path="tickets/:id" element={<TicketDetail />} />
        <Route path="contracts" element={<ContractList />} />
        <Route path="quotes" element={<QuoteList />} />
        <Route path="quotes/:id" element={<QuoteDetail />} />
        <Route path="interactions" element={<InteractionList />} />
        <Route path="orders" element={<OrderList />} />
    </>
);

