import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import BillingAdminPage from '../pages/dashboards/BillingAdminPage';
import PlansList from '../pages/lists/PlansListPage';
import InvoicesList from '../pages/lists/InvoicesListPage';
import BillingSettings from '../pages/settings/BillingSettingsPage';
import BillingSuccess from '../pages/features/BillingSuccessPage';
import BillingCancel from '../pages/features/BillingCancelPage';
import DunningManager from '../pages/lists/DunningManagerPage';

export const billingAdminRoutes = (
    <React.Fragment>
        <Route index element={<BillingAdminPage />} />
        <Route path="overview" element={<BillingAdminPage />} />
        <Route path="plans" element={<PlansList />} />
        <Route path="invoices" element={<InvoicesList />} />
        <Route path="dunning" element={<DunningManager />} />
        <Route path="settings" element={<BillingSettings />} />
        <Route path="success" element={<BillingSuccess />} />
        <Route path="cancel" element={<BillingCancel />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
