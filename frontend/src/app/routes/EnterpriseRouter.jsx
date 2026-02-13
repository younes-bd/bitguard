import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// Layouts
import ConsoleLayout from '../../layouts/ConsoleLayout';
import ModuleLayout from '../../shared/core/layouts/ModuleLayout'; // New Consolidated Layout
// import StoreAdminLayout from '../../layouts/StoreAdminLayout'; // Deprecated
// import IdentityLayout from '../../layouts/IdentityLayout'; // Deprecated
// Deprecated: CrmLayout, ErpLayout, SecurityLayout, AdminModuleLayout

// Dashboards
import DashboardRouter from '../../shared/core/routing/DashboardRouter';
import CommandCenter from '../../features/admin/CommandCenter';
import SalesDashboard from '../../features/admin/pages/SalesDashboard';
import StoreDashboard from '../../features/store/dashboards/StoreDashboard'; // Not used in admin routes?
import StoreAdminDashboard from '../../features/store/dashboards/StoreAdminDashboard';
import CrmDashboard from '../../features/crm/dashboards/CrmDashboard';
import ErpDashboard from '../../features/erp/dashboards/ErpDashboard';
import ScmDashboard from '../../features/scm/dashboards/ScmDashboard';
import HrmDashboard from '../../features/hrm/dashboards/HrmDashboard';
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
// import IAMLayout from '../../features/identity/pages/IAMLayout'; // Deprecated in favor of ModuleLayout
import RoleList from '../../features/identity/pages/RoleList';
import UserList from '../../features/identity/pages/UserList';

// Routes
import { crmRoutes } from '../../features/crm/routes';
import { erpRoutes } from '../../features/erp/routes';
import { scmRoutes } from '../../features/scm/routes';
import { hrmRoutes } from '../../features/hrm/routes';
import { socRoutes } from '../../features/security/routes';
import { identityRoutes } from '../../features/identity/routes';

// Menu Configurations (passed to ModuleLayout)
import { productMenu } from '../../shared/core/config/menu';

export const EnterpriseRouter = (
    <>
        {/* Main Platform Console (Command Center) */}
        <Route path="/admin" element={<ConsoleLayout />}>
            <Route index element={<DashboardRouter />} />
            {/* Note: /admin index is the main dashboard with tiles linking to modules */}
        </Route>

        {/* System Admin Module (Users, Logs, Settings) */}
        <Route path="/admin" element={<ModuleLayout title="System Administration" items={[]} accentColor="slate" />}>
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

        {/* Store Admin Module */}
        <Route path="/admin/store" element={<ModuleLayout title="Store Management" items={productMenu.store[0].items} accentColor="indigo" />}>
            <Route index element={<StoreAdminDashboard />} />
            <Route path="products" element={<StoreProducts />} />
            <Route path="orders" element={<StoreOrders />} />
            <Route path="customers" element={<StoreCustomers />} />
            <Route path="settings" element={<StoreSettings />} />
        </Route>

        {/* CRM Module */}
        <Route path="/admin/crm" element={<ModuleLayout title="CRM Suite" items={productMenu.crm[0].items} accentColor="blue" />}>
            <Route index element={<CrmDashboard />} />
            {crmRoutes}
        </Route>

        {/* ERP Module */}
        <Route path="/admin/erp" element={<ModuleLayout title="Enterprise Resource Planning" items={productMenu.erp[0].items} accentColor="emerald" />}>
            <Route index element={<ErpDashboard />} />
            {erpRoutes}
        </Route>

        {/* Security (SOC) Module */}
        <Route path="/admin/security" element={<ModuleLayout title="Security Operations" items={productMenu.security[0].items} accentColor="red" />}>
            <Route index element={<SocDashboard />} />
            {socRoutes}
        </Route>

        {/* Identity & Access Module - Consolidated into IAM */}
        {/* <Route path="/admin/identity" ... /> Deprecated */}

        {/* SCM Module (Supply Chain) */}
        <Route path="/admin/scm" element={<ModuleLayout title="Supply Chain Management" items={productMenu.scm[0].items} accentColor="orange" />}>
            <Route index element={<div className="p-8 text-white"><h2>Supply Chain Dashboard</h2></div>} />
            {scmRoutes}
        </Route>

        {/* HRM Module (Human Capital) */}
        <Route path="/admin/hrm" element={<ModuleLayout title="Human Capital Management" items={productMenu.hrm[0].items} accentColor="pink" />}>
            <Route index element={<div className="p-8 text-white"><h2>Human Capital Dashboard</h2></div>} />
            {hrmRoutes}
        </Route>

        {/* IAM (Identity) Module */}
        <Route path="/admin/iam" element={<ModuleLayout title="Identity & Access" items={productMenu.iam[0].items} accentColor="violet" />}>
            <Route index element={<Navigate to="roles" replace />} />
            <Route path="roles" element={<RoleList />} />
            <Route path="users" element={<UserList />} />
            {/* <Route path="tenants" ... /> // Pending feature */}
        </Route>
    </>
);
