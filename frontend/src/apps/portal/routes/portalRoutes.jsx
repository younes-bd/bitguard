import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PortalLayout from '../layouts/PortalLayout';

// Base Core Portal Elements
import ClientPortalDashboard from '../pages/client/dashboards/ClientPortalDashboardPage';
import ClientPortalInvoice from '../pages/client/details/ClientPortalInvoicePage';
import PortalAccountDetails from '../pages/client/details/PortalAccountDetailsPage';

import { TenantModuleGuard } from '@/core/guards/TenantModuleGuard';

// Dynamically discover all L3 portal routes (Rule 67)
const routeModules = import.meta.glob('../../apps/*/routes/*PortalRoutes.jsx', { eager: true });

export const portalRoutes = () => {
    return (
        <Routes>
            {/* Public token-based invoice view — no layout wrapper */}
            <Route path="invoice/:token" element={<ClientPortalInvoice />} />

            {/* Client-facing portal — uses PortalLayout */}
            <Route element={<PortalLayout />}>
                <Route index element={<ClientPortalDashboard />} />
                
                {/* Dynamically injected L3 Domain Routes */}
                {Object.entries(routeModules).map(([path, module]) => {
                    const parts = path.split('/');
                    const appName = parts[3];
                    
                    const exportName = Object.keys(module)[0];
                    const RoutesElement = module[exportName];
                    if (!RoutesElement) return null;

                    return (
                        <Route key={appName} element={<TenantModuleGuard moduleName={appName} />}>
                            {RoutesElement}
                        </Route>
                    );
                })}

                <Route path="account" element={<PortalAccountDetails />} />
                <Route path="*" element={<Navigate to="/portal" replace />} />
            </Route>
        </Routes>
    );
};
