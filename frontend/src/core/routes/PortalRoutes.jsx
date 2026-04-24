import React from 'react';
import { Route } from 'react-router-dom';
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

export const PortalRoutes = (
    <Route element={<ProductLayout />}>
        {/* 
            Unified Portal Routes 
            Accessible to all authenticated non-admin users (Business & Personal)
        */}
        <Route path="/portal" element={<ProtectedRoute><ClientPortalDashboard /></ProtectedRoute>} />

        {/* SaaS Products - Access controlled by subscription/purchases */}

        <Route path="/crm" element={<ProtectedRoute><SubscriptionGuard requiredProduct="crm"><ProductLayout /></SubscriptionGuard></ProtectedRoute>}>
            <Route index element={<CrmDashboard />} />
            {crmRoutes}
        </Route>

        <Route path="/erp" element={<ProtectedRoute><SubscriptionGuard requiredProduct="erp"><ProductLayout /></SubscriptionGuard></ProtectedRoute>}>
            <Route index element={<ErpDashboard />} />
            {erpRoutes}
        </Route>

        <Route path="/soc" element={<ProtectedRoute><SubscriptionGuard requiredProduct="soc"><ProductLayout /></SubscriptionGuard></ProtectedRoute>}>
            <Route index element={<SocDashboard />} />
            {socRoutes}
        </Route>

        <Route path="/hrm" element={<ProtectedRoute><SubscriptionGuard requiredProduct="hrm"><ProductLayout /></SubscriptionGuard></ProtectedRoute>}>
            <Route index element={<HrmDashboard />} />
            {hrmRoutes}
        </Route>

        <Route path="/scm" element={<ProtectedRoute><SubscriptionGuard requiredProduct="scm"><ProductLayout /></SubscriptionGuard></ProtectedRoute>}>
            <Route index element={<ScmDashboard />} />
            {scmRoutes}
        </Route>

        <Route path="/portal/support" element={<ProtectedRoute><ProductLayout /></ProtectedRoute>}>
            <Route index element={<SupportDashboard />} />
            {supportRoutes}
        </Route>

        <Route path="/marketing" element={<ProtectedRoute><ProductLayout /></ProtectedRoute>}>
            <Route index element={<MarketingDashboard />} />
            {marketingRoutes}
        </Route>
    </Route>
);
