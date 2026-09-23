import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PortalLayout from '../layouts/PortalLayout';

// Dashboards
import ClientPortalDashboard from '../pages/client/dashboards/ClientPortalDashboardPage';

// Lists
import PortalInvoices from '../pages/client/lists/PortalInvoicesPage';
import PortalTickets from '../pages/client/lists/PortalTicketsPage';
import PortalOrders from '../pages/client/lists/PortalOrdersPage';
import PortalProjects from '../pages/client/lists/PortalProjectsPage';
import PortalContracts from '../pages/client/lists/PortalContractsPage';
import PortalSubscriptions from '../pages/client/lists/PortalSubscriptionsPage';
import PortalAssets from '../pages/client/lists/PortalAssetsPage';
import PortalQuotes from '../pages/client/lists/PortalQuotesPage';
import PortalTasks from '../pages/client/lists/PortalTasksPage';
import PortalTimesheets from '../pages/client/lists/PortalTimesheetsPage';
import PortalProcurements from '../pages/client/lists/PortalProcurementsPage';
import PortalLeads from '../pages/client/lists/PortalLeadsPage';

// Details
import ClientPortalInvoice from '../pages/client/details/ClientPortalInvoicePage';
import PortalInvoiceDetail from '../pages/client/details/PortalInvoiceDetailPage';
import PortalTicketDetail from '../pages/client/details/PortalTicketDetailPage';

// Settings & Account
import PortalAccountDetails from '../pages/client/details/PortalAccountDetailsPage';

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
                <Route path="procurement" element={<PortalProcurements />} />
                <Route path="leads" element={<PortalLeads />} />
                <Route path="account" element={<PortalAccountDetails />} />
                <Route path="*" element={<Navigate to="/portal" replace />} />
            </Route>
        </Routes>
    );
};
