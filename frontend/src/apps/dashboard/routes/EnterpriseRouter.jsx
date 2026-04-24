import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// Layouts
import ConsoleLayout from '../../../core/layouts/ConsoleLayout';
import ModuleLayout from '../../../core/layouts/ModuleLayout';

// Dashboards
import DashboardRouter from './DashboardRouter';
import CommandCenter from '../pages/CommandCenter';
import SalesDashboard from '../pages/SalesDashboard';
import StoreDashboard from '../../store/pages/dashboards/StoreDashboard';
import StoreAdminDashboard from '../../store/pages/dashboards/StoreAdminDashboard';
import CrmDashboard from '../../crm/pages/dashboards/CrmDashboard';
import ErpDashboard from '../../erp/pages/dashboards/ErpDashboard';
import ScmDashboard from '../../scm/pages/dashboards/ScmDashboard';
import HrmDashboard from '../../hrm/pages/dashboards/HrmDashboard';
import SocDashboard from '../../soc/pages/dashboards/SocDashboard';
import SupportDashboard from '../../support/pages/SupportDashboard';
import MarketingDashboard from '../../marketing/pages/MarketingDashboard';

// Admin Pages
import UserManagement from '../pages/UserManagement';
import SysadminDashboard from '../../sysadmin/pages/SysadminDashboard';
import { sysadminRoutes } from '../../sysadmin/routes/sysadminRoutes';

// Feature Pages - CRM
import ClientDashboard from '../../crm/pages/ClientDashboard';
import ClientDetail from '../../crm/pages/ClientDetail';
import RoleList from '../../auth/pages/identity/RoleList';
import UserList from '../../auth/pages/identity/UserList';

// Billing
import BillingAdminPage from '../../billing/pages/BillingAdminPage';
import PlansList from '../../billing/pages/PlansList';
import InvoicesList from '../../billing/pages/InvoicesList';
import BillingSettings from '../../billing/pages/BillingSettings';
import BillingSuccess from '../../billing/pages/BillingSuccess';
import BillingCancel from '../../billing/pages/BillingCancel';

// Reports
import ReportsDashboard from '../../reports/pages/ReportsDashboard';
import RevenueReport from '../../reports/pages/RevenueReport';
import CrmReport from '../../reports/pages/CrmReport';
import SupportReport from '../../reports/pages/SupportReport';
import SecurityReport from '../../reports/pages/SecurityReport';
import MrrDashboard from '../pages/MrrDashboard';
import ExportPage from '../../reports/pages/ExportPage';

// Contracts
import ContractList from '../../crm/pages/ContractList';
import QuoteList from '../../crm/pages/QuoteList';
import SlaTiersPage from '../../crm/pages/SlaTiersPage';
import SlaBreachesPage from '../../crm/pages/SlaBreachesPage';
import ContractSettings from '../../crm/pages/ContractSettings';

// Project Management (Dedicated Module)
import ProjectsDashboard from '../../projects/pages/ProjectsDashboard';
import { projectsRoutes } from '../../projects/routes/projectsRoutes';

// IAM extra pages
import IamDashboard from '../../auth/pages/identity/IamDashboard';
import TenantList from '../../auth/pages/identity/TenantList';
import AuditLogPage from '../../auth/pages/identity/AuditLogPage';
import IamSettings from '../../auth/pages/identity/IamSettings';

// ITAM — asset pages
import AssetDashboard from '../../itam/pages/AssetDashboard';
import AssetList from '../../itam/pages/AssetList';
import ItamSettings from '../../itam/pages/ItamSettings';

// Module Routes
import { crmRoutes } from '../../crm/routes/crmRoutes';
import { erpRoutes } from '../../erp/routes/erpRoutes';
import { scmRoutes } from '../../scm/routes/scmRoutes';
import { hrmRoutes } from '../../hrm/routes/hrmRoutes';
import { socRoutes } from '../../soc/routes/socRoutes';
import { identityRoutes } from '../../auth/routes/identityRoutes';
import { storeRoutes } from '../../store/routes/storeRoutes';
import { supportRoutes } from '../../support/routes/supportRoutes';
import { marketingRoutes } from '../../marketing/routes/marketingRoutes';
import { productMenu } from '../../../core/api/menu';
import NotificationCenter from '../pages/NotificationCenter';
import CMSRoutes from '../../cms/routes/CMSRoutes';

// Future Enhancement Modules
import DocumentsDashboard from '../../documents/pages/DocumentsDashboard';
import DocumentSettings from '../../documents/pages/DocumentSettings';
import ApprovalsDashboard from '../../approvals/pages/ApprovalsDashboard';
import ApprovalSettings from '../../approvals/pages/ApprovalSettings';
import ItsmDashboard from '../../itsm/pages/ItsmDashboard';
import ItsmSettings from '../../itsm/pages/ItsmSettings';

export const EnterpriseRouter = (
    <>
        {/* Main Platform Console (Command Center) */}
        <Route path="/admin" element={<ConsoleLayout />}>
            <Route index element={<DashboardRouter />} />
        </Route>

        {/* Platform Admin Module */}
        <Route path="/admin/system" element={<ModuleLayout title="Platform Administration" items={productMenu.system[0].items} accentColor="slate" />}>
            <Route index element={<SysadminDashboard />} />
            {sysadminRoutes}
        </Route>
        
        <Route path="/admin" element={<ModuleLayout title="Platform Administration" items={productMenu.system[0].items} accentColor="slate" />}>
            <Route path="users" element={<UserManagement />} />
        </Route>

        {/* Other Admin Dashboard Views */}
        <Route path="/admin" element={<ConsoleLayout />}>
            <Route path="sales" element={<SalesDashboard />} />
            <Route path="clients" element={<ClientDashboard />} />
            <Route path="clients/:id" element={<ClientDetail />} />
        </Route>

        {/* Commerce Module */}
        <Route path="/admin/store" element={<ModuleLayout title="Commerce" items={productMenu.store[0].items} accentColor="indigo" />}>
            <Route index element={<StoreDashboard />} />
            <Route path="dashboard" element={<StoreDashboard />} />
            {storeRoutes}
        </Route>

        {/* Sales & CRM Module */}
        <Route path="/admin/crm" element={<ModuleLayout title="Sales & CRM" items={productMenu.crm[0].items} accentColor="blue" />}>
            <Route index element={<CrmDashboard />} />
            {crmRoutes}
        </Route>

        {/* Finance & Operations Module */}
        <Route path="/admin/erp" element={<ModuleLayout title="Finance & Operations" items={productMenu.erp[0].items} accentColor="emerald" />}>
            <Route index element={<ErpDashboard />} />
            {erpRoutes}
        </Route>

        {/* Security Operations Center */}
        <Route path="/admin/security" element={<ModuleLayout title="Security Operations Center" items={productMenu.security[0].items} accentColor="red" />}>
            <Route index element={<SocDashboard />} />
            {socRoutes}
        </Route>
        <Route path="/admin/soc" element={<Navigate to="/admin/security" replace />} />

        {/* Procurement Module */}
        <Route path="/admin/scm" element={<ModuleLayout title="Procurement" items={productMenu.scm[0].items} accentColor="orange" />}>
            {scmRoutes}
        </Route>

        {/* People & HR Module */}
        <Route path="/admin/hrm" element={<ModuleLayout title="People & HR" items={productMenu.hrm[0].items} accentColor="pink" />}>
            {hrmRoutes}
        </Route>

        {/* Service Desk Module */}
        <Route path="/admin/support" element={<ModuleLayout title="Service Desk" items={productMenu.support[0].items} accentColor="teal" />}>
            <Route index element={<SupportDashboard />} />
            {supportRoutes}
        </Route>

        {/* Marketing Automation Module */}
        <Route path="/admin/marketing" element={<ModuleLayout title="Marketing Automation" items={productMenu.marketing[0].items} accentColor="yellow" />}>
            <Route index element={<MarketingDashboard />} />
            {marketingRoutes}
        </Route>

        {/* Identity & Access Module */}
        <Route path="/admin/iam" element={<ModuleLayout title="Identity & Access" items={productMenu.iam[0].items} accentColor="violet" />}>
            <Route index element={<IamDashboard />} />
            <Route path="roles" element={<RoleList />} />
            <Route path="users" element={<UserList />} />
            <Route path="tenants" element={<TenantList />} />
            <Route path="audit" element={<AuditLogPage />} />
            <Route path="settings" element={<IamSettings />} />
        </Route>

        {/* Billing Module */}
        <Route path="/admin/billing" element={<ModuleLayout title="Billing" items={productMenu.billing[0].items} accentColor="emerald" />}>
            <Route index element={<BillingAdminPage />} />
            <Route path="overview" element={<BillingAdminPage />} />
            <Route path="plans" element={<PlansList />} />
            <Route path="invoices" element={<InvoicesList />} />
            <Route path="settings" element={<BillingSettings />} />
            <Route path="success" element={<BillingSuccess />} />
            <Route path="cancel" element={<BillingCancel />} />
        </Route>

        {/* Analytics & Reports Module */}
        <Route path="/admin/reports" element={<ModuleLayout title="Analytics & Reports" items={productMenu.reports[0].items} accentColor="violet" />}>
            <Route index element={<ReportsDashboard />} />
            <Route path="mrr" element={<MrrDashboard />} />
            <Route path="revenue" element={<RevenueReport />} />
            <Route path="crm" element={<CrmReport />} />
            <Route path="support" element={<SupportReport />} />
            <Route path="security" element={<SecurityReport />} />
            <Route path="export" element={<ExportPage />} />
        </Route>

        {/* Contract Management Module */}
        <Route path="/admin/contracts" element={<ModuleLayout title="Contract Management" items={productMenu.contracts[0].items} accentColor="amber" />}>
            <Route index element={<ContractList />} />
            <Route path="list" element={<ContractList />} />
            <Route path="quotes" element={<QuoteList />} />
            <Route path="sla-tiers" element={<SlaTiersPage />} />
            <Route path="sla-breaches" element={<SlaBreachesPage />} />
            <Route path="settings" element={<ContractSettings />} />
        </Route>

        {/* Asset Management Module (ITAM) */}
        <Route path="/admin/itam" element={<ModuleLayout title="Asset Management" items={productMenu.itam[0].items} accentColor="teal" />}>
            <Route index element={<AssetDashboard />} />
            <Route path="assets" element={<AssetList />} />
            <Route path="settings" element={<ItamSettings />} />
        </Route>

        {/* Projects Module */}
        <Route path="/admin/projects" element={<ModuleLayout title="Project Management" items={productMenu.projects[0].items} accentColor="cyan" />}>
            {projectsRoutes}
        </Route>

        {/* Notifications Center */}
        <Route path="/admin/notifications" element={<ConsoleLayout />}>
            <Route index element={<NotificationCenter />} />
        </Route>

        {/* CMS / Website Builder */}
        <Route path="/admin/cms/*" element={<CMSRoutes />} />

        {/* ── Future Enhancement Modules ── */}

        {/* Document Management */}
        <Route path="/admin/documents" element={<ModuleLayout title="Document Management" items={productMenu.documents[0].items} accentColor="cyan" />}>
            <Route index element={<DocumentsDashboard />} />
            <Route path="settings" element={<DocumentSettings />} />
        </Route>

        {/* Approval Center */}
        <Route path="/admin/approvals" element={<ModuleLayout title="Approval Center" items={productMenu.approvals[0].items} accentColor="amber" />}>
            <Route index element={<ApprovalsDashboard />} />
            <Route path="settings" element={<ApprovalSettings />} />
        </Route>

        {/* Change Management (ITSM) */}
        <Route path="/admin/itsm" element={<ModuleLayout title="Change Management" items={productMenu.itsm[0].items} accentColor="indigo" />}>
            <Route index element={<ItsmDashboard />} />
            <Route path="settings" element={<ItsmSettings />} />
        </Route>
    </>
);
