import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductLayout from '../layouts/ProductLayout';
import { crmRoutes } from '../../apps/crm/routes/crmRoutes';
import { accountingRoutes } from '../../apps/accounting/routes/accountingRoutes';
import { socRoutes } from '../../apps/soc/routes/socRoutes';
import { hrmRoutes } from '../../apps/hrm/routes/hrmRoutes';
import { purchaseRoutes } from '../../apps/purchase/routes/purchaseRoutes';
import { inventoryRoutes } from '../../apps/inventory/routes/inventoryRoutes';
import { supportRoutes } from '../../apps/support/routes/supportRoutes';
import { marketingRoutes } from '../../apps/marketing/routes/marketingRoutes';

import CrmDashboard from '../../apps/crm/pages/dashboards/CrmDashboard';
import AccountingDashboard from '../../apps/accounting/pages/dashboards/AccountingDashboard';
import SocDashboard from '../../apps/soc/pages/dashboards/SocDashboard';
import HrmDashboard from '../../apps/hrm/pages/dashboards/HrmDashboard';

import SupportDashboard from '../../apps/support/pages/dashboards/SupportDashboard';
import MarketingDashboard from '../../apps/marketing/pages/dashboards/MarketingDashboard';
import ClientPortalDashboard from '../../apps/portal/pages/dashboards/ClientPortalDashboard';

import SubscriptionGuard from '../api/auth/SubscriptionGuard';


export const PortalRoutes = () => {
    return (
        <Routes>
            {/* Unified Portal (Main Entry) */}
            <Route element={<ProductLayout />}>
                <Route index element={<ClientPortalDashboard />} />
                <Route path="support" element={<SupportDashboard />} />
                {supportRoutes}
            </Route>

            {/* SaaS Products - Protected by SubscriptionGuard */}
            <Route path="crm" element={<SubscriptionGuard requiredProduct="crm"><ProductLayout /></SubscriptionGuard>}>
                <Route index element={<CrmDashboard />} />
                {crmRoutes}
            </Route>

            <Route path="accounting" element={<SubscriptionGuard requiredProduct="accounting"><ProductLayout /></SubscriptionGuard>}>
                <Route index element={<AccountingDashboard />} />
                {accountingRoutes}
            </Route>

            <Route path="soc" element={<SubscriptionGuard requiredProduct="soc"><ProductLayout /></SubscriptionGuard>}>
                <Route index element={<SocDashboard />} />
                {socRoutes}
            </Route>

            <Route path="hrm" element={<SubscriptionGuard requiredProduct="hrm"><ProductLayout /></SubscriptionGuard>}>
                <Route index element={<HrmDashboard />} />
                {hrmRoutes}
            </Route>

            <Route path="purchase" element={<SubscriptionGuard requiredProduct="purchase"><ProductLayout /></SubscriptionGuard>}>
                {purchaseRoutes}
            </Route>
            
            <Route path="inventory" element={<SubscriptionGuard requiredProduct="inventory"><ProductLayout /></SubscriptionGuard>}>
                {inventoryRoutes}
            </Route>

            <Route path="marketing" element={<SubscriptionGuard requiredProduct="marketing"><ProductLayout /></SubscriptionGuard>}>
                <Route index element={<MarketingDashboard />} />
                {marketingRoutes}
            </Route>
        </Routes>
    );
};
