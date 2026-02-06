import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// Layouts
import ConsoleLayout from '../../layouts/ConsoleLayout';
import CrmLayout from '../../layouts/CrmLayout';
import ErpLayout from '../../layouts/ErpLayout';
import StoreAdminLayout from '../../layouts/StoreAdminLayout';
import IdentityLayout from '../../layouts/IdentityLayout';
import AdminModuleLayout from '../../layouts/AdminModuleLayout';
import SecurityLayout from '../../layouts/SecurityLayout'; // Fix: Import Added

// Dashboards
import DashboardRouter from '../../shared/core/routing/DashboardRouter';
import CommandCenter from '../../features/admin/CommandCenter';
import SalesDashboard from '../../features/admin/pages/SalesDashboard';
import StoreDashboard from '../../features/store/dashboards/StoreDashboard'; // Not used in admin routes?
import StoreAdminDashboard from '../../features/store/dashboards/StoreAdminDashboard';
import CrmDashboard from '../../features/crm/dashboards/CrmDashboard';
import ErpDashboard from '../../features/erp/dashboards/ErpDashboard';
import SocDashboard from '../../features/security/dashboards/SocDashboard';

// Admin Pages
import UserManagement from '../../features/admin/pages/UserManagement';
import PlatformSettings from '../../features/admin/pages/PlatformSettings';
import SystemLogs from '../../features/admin/pages/SystemLogs';

// Feature Pages
import ClientDashboard from '../../features/crm/pages/ClientDashboard';
import ClientProfile from '../../features/crm/pages/ClientProfile';
import StoreProducts from '../../features/store/pages/StoreProducts';
import StoreOrders from '../../features/store/pages/StoreOrders';
import StoreCustomers from '../../features/store/pages/StoreCustomers';
import StoreSettings from '../../features/store/pages/StoreSettings';
import IAMLayout from '../../features/identity/pages/IAMLayout';
import RoleList from '../../features/identity/pages/RoleList';
import UserList from '../../features/identity/pages/UserList';

// Routes
import { crmRoutes } from '../../features/crm/routes';
import { erpRoutes } from '../../features/erp/routes';
import { storeRoutes } from '../../features/store/routes';
import { socRoutes } from '../../features/security/routes';
import { identityRoutes } from '../../features/identity/routes';

export const AppRoutes = (
    <>
        {/* Main Platform Console (Command Center) */}
        <Route path="/admin" element={<ConsoleLayout />}>
            <Route index element={<DashboardRouter />} />
            {/* Note: /admin index is the main dashboard with tiles linking to modules */}
        </Route>

        {/* System Admin Module (Users, Logs, Settings) - Uses dedicated Layout */}
        <Route path="/admin" element={<AdminModuleLayout />}>
            <Route path="users" element={<UserManagement />} />
            <Route path="roles" element={<CommandCenter />} />
            <Route path="system" element={<CommandCenter />} />
            <Route path="logs" element={<SystemLogs />} />
            <Route path="settings" element={<PlatformSettings />} />
        </Route>

        {/* Other Admin Dashboard Views */}
        <Route path="/admin" element={<ConsoleLayout />}> {/* Re-using ConsoleLayout for these specific dashboards */}
            <Route path="sales" element={<SalesDashboard />} />
            <Route path="clients" element={<ClientDashboard />} />
            <Route path="clients/:id" element={<ClientProfile />} />
        </Route>

        {/* Store Admin Module - Uses StoreAdminLayout */}
        <Route path="/admin/store" element={<StoreAdminLayout />}>
            <Route index element={<StoreAdminDashboard />} />
            <Route path="products" element={<StoreProducts />} />
            <Route path="orders" element={<StoreOrders />} />
            <Route path="customers" element={<StoreCustomers />} />
            <Route path="settings" element={<StoreSettings />} />
        </Route>

        {/* CRM Module - Uses CrmLayout */}
        <Route path="/admin/crm" element={<CrmLayout />}>
            <Route index element={<CrmDashboard />} />
            {crmRoutes}
        </Route>

        {/* ERP Module - Uses ErpLayout */}
        <Route path="/admin/erp" element={<ErpLayout />}>
            <Route index element={<ErpDashboard />} />
            {erpRoutes}
        </Route>

        {/* Security (SOC) Module - Uses SecurityLayout (Dedicated) */}
        <Route path="/admin/security" element={<SecurityLayout />}>
            <Route index element={<SocDashboard />} />
            {socRoutes}
        </Route>

        {/* Identity & Access Module - Uses IdentityLayout */}
        <Route path="/admin/identity" element={<IdentityLayout />}>
            {identityRoutes}
        </Route>

        {/* Industry Standard IAM Admin */}
        <Route path="/admin/iam" element={<IAMLayout />}>
            <Route index element={<Navigate to="roles" replace />} />
            <Route path="roles" element={<RoleList />} />
            <Route path="users" element={<UserList />} />
            <Route path="tenants" element={<Navigate to="/admin/tenants" replace />} />
        </Route>
    </>
);
