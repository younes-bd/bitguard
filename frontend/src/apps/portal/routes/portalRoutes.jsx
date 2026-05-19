import React from 'react';
import { Route } from 'react-router-dom';
import PortalLayout from '../layouts/PortalLayout';
import PortalDashboard from '../pages/PortalDashboard';
import PortalTickets from '../pages/PortalTickets';
import PortalInvoices from '../pages/PortalInvoices';

export const PortalRoutes = (
    <Route path="/portal" element={<PortalLayout />}>
        <Route index element={<PortalDashboard />} />
        <Route path="tickets" element={<PortalTickets />} />
        <Route path="invoices" element={<PortalInvoices />} />
        <Route path="contracts" element={
            <div className="p-4 text-white space-y-2">
                <h2 className="text-xl font-bold">My Contracts</h2>
                <p className="text-slate-400">Your active service contracts will appear here.</p>
            </div>
        } />
        <Route path="billing" element={
            <div className="p-4 text-white space-y-2">
                <h2 className="text-xl font-bold">Billing</h2>
                <p className="text-slate-400">Invoice history and subscription management.</p>
            </div>
        } />
    </Route>
);
