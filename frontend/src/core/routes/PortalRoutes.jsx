import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PortalLayout from '../layouts/PortalLayout';

import ClientPortalDashboard from '../../apps/portal/pages/dashboards/ClientPortalDashboard';
import PortalOrders from '../../apps/portal/pages/lists/PortalOrders';
import PortalProjects from '../../apps/portal/pages/lists/PortalProjects';
import PortalContracts from '../../apps/portal/pages/lists/PortalContracts';
import PortalSubscriptions from '../../apps/portal/pages/lists/PortalSubscriptions';
import PortalAssets from '../../apps/portal/pages/lists/PortalAssets';
import PortalInvoices from '../../apps/portal/pages/lists/PortalInvoices';
import PortalTickets from '../../apps/portal/pages/lists/PortalTickets';
import PortalAccountDetails from '../../apps/portal/pages/details/PortalAccountDetails';
import PortalQuotes from '../../apps/portal/pages/lists/PortalQuotes';
import PortalTasks from '../../apps/portal/pages/lists/PortalTasks';
import PortalTimesheets from '../../apps/portal/pages/lists/PortalTimesheets';
import PortalPurchases from '../../apps/portal/pages/lists/PortalPurchases';
import PortalLeads from '../../apps/portal/pages/lists/PortalLeads';
import PortalAccountSecurity from '../../apps/portal/pages/details/PortalAccountSecurity';
export const PortalRoutes = () => {
    return (
        <Routes>
            {/* Unified Portal (Main Entry) */}
            <Route element={<PortalLayout />}>
                <Route index element={<ClientPortalDashboard />} />
                <Route path="orders" element={<PortalOrders />} />
                <Route path="projects" element={<PortalProjects />} />
                <Route path="contracts" element={<PortalContracts />} />
                <Route path="subscriptions" element={<PortalSubscriptions />} />
                <Route path="maintenance" element={<PortalAssets />} />
                <Route path="invoices" element={<PortalInvoices />} />
                <Route path="tickets" element={<PortalTickets />} />
                <Route path="account" element={<PortalAccountDetails />} />
                <Route path="security" element={<PortalAccountSecurity />} />
                <Route path="quotes" element={<PortalQuotes />} />
                <Route path="tasks" element={<PortalTasks />} />
                <Route path="timesheets" element={<PortalTimesheets />} />
                <Route path="purchase" element={<PortalPurchases />} />
                <Route path="leads" element={<PortalLeads />} />
            </Route>

        </Routes>
    );
};
