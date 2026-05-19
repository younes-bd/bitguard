import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductLayout from '../layouts/ProductLayout';
import { crmRoutes } from '../../apps/crm/routes/crmRoutes';
import { erpRoutes } from '../../apps/erp/routes/erpRoutes';
import { socRoutes } from '../../apps/soc/routes/socRoutes';
import { hrmRoutes } from '../../apps/hrm/routes/hrmRoutes';
import { scmRoutes } from '../../apps/scm/routes/scmRoutes';
import { supportRoutes } from '../../apps/support/routes/supportRoutes';
import { marketingRoutes } from '../../apps/marketing/routes/marketingRoutes';

import CrmDashboard from '../../apps/crm/pages/dashboards/CrmDashboard';
import ErpDashboard from '../../apps/erp/pages/dashboards/ErpDashboard';
import SocDashboard from '../../apps/soc/pages/dashboards/SocDashboard';
import HrmDashboard from '../../apps/hrm/pages/dashboards/HrmDashboard';
import ScmDashboard from '../../apps/scm/pages/dashboards/ScmDashboard';
import SupportDashboard from '../../apps/support/pages/SupportDashboard';
import MarketingDashboard from '../../apps/marketing/pages/MarketingDashboard';
import ClientPortalDashboard from '../../apps/portal/pages/ClientPortalDashboard';

import SubscriptionGuard from '../api/auth/SubscriptionGuard';
import ProtectedRoute from '../api/auth/ProtectedRoute';



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

            <Route path="erp" element={<SubscriptionGuard requiredProduct="erp"><ProductLayout /></SubscriptionGuard>}>
                <Route index element={<ErpDashboard />} />
                {erpRoutes}
            </Route>

            <Route path="soc" element={<SubscriptionGuard requiredProduct="soc"><ProductLayout /></SubscriptionGuard>}>
                <Route index element={<SocDashboard />} />
                {socRoutes}
            </Route>

            <Route path="hrm" element={<SubscriptionGuard requiredProduct="hrm"><ProductLayout /></SubscriptionGuard>}>
                <Route index element={<HrmDashboard />} />
                {hrmRoutes}
            </Route>

            <Route path="scm" element={<SubscriptionGuard requiredProduct="scm"><ProductLayout /></SubscriptionGuard>}>
                <Route index element={<ScmDashboard />} />
                {scmRoutes}
            </Route>

            <Route path="marketing" element={<ProductLayout />}>
                <Route index element={<MarketingDashboard />} />
                {marketingRoutes}
            </Route>
        </Routes>
    );
};
