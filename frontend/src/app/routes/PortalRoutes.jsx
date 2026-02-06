import React from 'react';
import { Route } from 'react-router-dom';
import ProductLayout from '../../layouts/ProductLayout';

import { crmRoutes } from '../../features/crm/routes';
import { erpRoutes } from '../../features/erp/routes';
import { socRoutes } from '../../features/security/routes';

import CrmDashboard from '../../features/crm/dashboards/CrmDashboard';
import ErpDashboard from '../../features/erp/dashboards/ErpDashboard';
import SocDashboard from '../../features/security/dashboards/SocDashboard';

import SubscriptionGuard from '../../shared/core/auth/SubscriptionGuard';

export const PortalRoutes = (
    <Route element={<ProductLayout />}>
        {/* 
            Unified Portal Routes 
            Accessible to all authenticated non-admin users (Business & Personal)
        */}

        {/* SaaS Products - Access controlled by subscription/purchases */}

        <Route element={<SubscriptionGuard requiredProduct="crm" />}>
            {crmRoutes}
            <Route path="crm" element={<CrmDashboard />} />
        </Route>

        <Route element={<SubscriptionGuard requiredProduct="erp" />}>
            {erpRoutes}
            <Route path="erp" element={<ErpDashboard />} />
        </Route>

        <Route element={<SubscriptionGuard requiredProduct="soc" />}>
            {socRoutes}
            <Route path="soc" element={<SocDashboard />} />
        </Route>
    </Route>
);
