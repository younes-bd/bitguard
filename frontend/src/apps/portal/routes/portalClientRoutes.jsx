import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PortalLayout from '../layouts/PortalLayout';

// Dashboards
import ClientPortalDashboard from '../pages/client/dashboards/ClientPortalDashboard';

// Lists
import PortalInvoices from '../pages/client/lists/PortalInvoices';
import PortalTickets from '../pages/client/lists/PortalTickets';
import PortalOrders from '../pages/client/lists/PortalOrders';
import PortalProjects from '../pages/client/lists/PortalProjects';
import PortalContracts from '../pages/client/lists/PortalContracts';
import PortalSubscriptions from '../pages/client/lists/PortalSubscriptions';
import PortalAssets from '../pages/client/lists/PortalAssets';
import PortalQuotes from '../pages/client/lists/PortalQuotes';
import PortalTasks from '../pages/client/lists/PortalTasks';
import PortalTimesheets from '../pages/client/lists/PortalTimesheets';
import PortalPurchases from '../pages/client/lists/PortalPurchases';
import PortalLeads from '../pages/client/lists/PortalLeads';

// Details
import ClientPortalInvoice from '../pages/client/details/ClientPortalInvoice';
import PortalInvoiceDetail from '../pages/client/details/PortalInvoiceDetail';
import PortalTicketDetail from '../pages/client/details/PortalTicketDetail';

// Settings & Account
import PortalAccountDetails from '../pages/client/details/PortalAccountDetails';

export const portalClientRoutes = () => {
    return (
        <Routes>
            {/* Public token-based invoice view — no layout wrapper */}
            <Route path="invoice/:token" element={<ClientPortalInvoice />} />

            {/* Client-facing portal — uses PortalLayout */}
            <Route element={<PortalLayout />}>
                <Route index element={<ClientPortalDashboard />} />
                <Route path="invoices" element={<PortalInvoices />} />
                <Route path="invoices/:id" element={<PortalInvoiceDetail />} />
                <Route path="tickets" element={<PortalTickets />} />
                <Route path="tickets/:id" element={<PortalTicketDetail />} />
                <Route path="orders" element={<PortalOrders />} />
                <Route path="projects" element={<PortalProjects />} />
                <Route path="contracts" element={<PortalContracts />} />
                <Route path="subscriptions" element={<PortalSubscriptions />} />
                <Route path="assets" element={<PortalAssets />} />
                <Route path="quotes" element={<PortalQuotes />} />
                <Route path="tasks" element={<PortalTasks />} />
                <Route path="timesheets" element={<PortalTimesheets />} />
                <Route path="purchase" element={<PortalPurchases />} />
                <Route path="leads" element={<PortalLeads />} />
                <Route path="account" element={<PortalAccountDetails />} />
                <Route path="*" element={<Navigate to="/portal" replace />} />
            </Route>
        </Routes>
    );
};
