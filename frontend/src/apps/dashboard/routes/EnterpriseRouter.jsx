import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BookOpen, PlusCircle, Globe, LayoutDashboard } from 'lucide-react';

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
import DunningManager from '../../billing/pages/DunningManager';

// Reports
import ReportsDashboard from '../../reports/pages/ReportsDashboard';
import RevenueReport from '../../reports/pages/RevenueReport';
import CrmReport from '../../reports/pages/CrmReport';
import SupportReport from '../../reports/pages/SupportReport';
import SecurityReport from '../../reports/pages/SecurityReport';
import MrrDashboard from '../pages/MrrDashboard';
import ExportPage from '../../reports/pages/ExportPage';
import HrmReport from '../../reports/pages/HrmReport';
import FinanceReport from '../../reports/pages/FinanceReport';
import ProjectsReport from '../../reports/pages/ProjectsReport';

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
import MfaManagement from '../../auth/pages/identity/MfaManagement';
import ApiKeyManagement from '../../auth/pages/identity/ApiKeyManagement';
import ActiveSessions from '../../auth/pages/identity/ActiveSessions';

// ITAM — asset pages
import AssetDashboard from '../../itam/pages/AssetDashboard';
import AssetList from '../../itam/pages/AssetList';
import AssetDetail from '../../itam/pages/AssetDetail';
import AssetDepreciation from '../../itam/pages/AssetDepreciation';
import LicenseManager from '../../itam/pages/LicenseManager';
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
import ProblemsList from '../../itsm/pages/ProblemsList';
import ChangeRequestList from '../../itsm/pages/ChangeRequestList';
import ItsmSettings from '../../itsm/pages/ItsmSettings';

// Blog Manager
import BlogPostList from '../../blog/pages/BlogPostList';
import BlogPostEditor from '../../blog/pages/BlogPostEditor';

// Portal
import PortalDashboard from '../../portal/pages/PortalDashboard';
import PortalClientView from '../../portal/pages/PortalClientView';

export const EnterpriseRoutes = () => {
    return (
        <Routes>
            {/* Main Platform Console (Command Center) */}
            <Route element={<ConsoleLayout />}>
                <Route index element={<DashboardRouter />} />
                <Route path="dashboard" element={<DashboardRouter />} />
                <Route path="notifications" element={<NotificationCenter />} />
                <Route path="sales" element={<SalesDashboard />} />
                <Route path="clients" element={<ClientDashboard />} />
                <Route path="clients/:id" element={<ClientDetail />} />
                <Route path="users" element={<UserManagement />} />
            </Route>

            {/* Platform Admin Module */}
            <Route path="system" element={<ModuleLayout title="Platform Administration" items={productMenu.system[0].items} accentColor="slate" />}>
                <Route index element={<SysadminDashboard />} />
                {sysadminRoutes}
            </Route>

            {/* Commerce Module */}
            <Route path="store" element={<ModuleLayout title="Commerce" items={productMenu.store[0].items} accentColor="indigo" />}>
                <Route index element={<StoreDashboard />} />
                <Route path="dashboard" element={<StoreDashboard />} />
                {storeRoutes}
            </Route>

            {/* Sales & CRM Module */}
            <Route path="crm" element={<ModuleLayout title="Sales & CRM" items={productMenu.crm[0].items} accentColor="blue" />}>
                <Route index element={<CrmDashboard />} />
                {crmRoutes}
            </Route>

            {/* Finance & Operations Module */}
            <Route path="erp" element={<ModuleLayout title="Finance & Operations" items={productMenu.erp} accentColor="emerald" />}>
                <Route index element={<ErpDashboard />} />
                {erpRoutes}
            </Route>

            {/* Security Operations Center */}
            <Route path="security" element={<ModuleLayout title="Security Operations Center" items={productMenu.security[0].items} accentColor="red" />}>
                <Route index element={<SocDashboard />} />
                {socRoutes}
            </Route>
            <Route path="soc" element={<Navigate to="../security" replace />} />

            {/* Procurement Module */}
            <Route path="scm" element={<ModuleLayout title="Procurement" items={productMenu.scm[0].items} accentColor="orange" />}>
                <Route index element={<ScmDashboard />} />
                {scmRoutes}
            </Route>

            {/* People & HR Module */}
            <Route path="hrm" element={<ModuleLayout title="People & HR" items={productMenu.hrm[0].items} accentColor="pink" />}>
                <Route index element={<HrmDashboard />} />
                {hrmRoutes}
            </Route>

            {/* Service Desk Module */}
            <Route path="support" element={<ModuleLayout title="Service Desk" items={productMenu.support[0].items} accentColor="teal" />}>
                <Route index element={<SupportDashboard />} />
                {supportRoutes}
            </Route>

            {/* Marketing Automation Module */}
            <Route path="marketing" element={<ModuleLayout title="Marketing Automation" items={productMenu.marketing[0].items} accentColor="yellow" />}>
                <Route index element={<MarketingDashboard />} />
                {marketingRoutes}
            </Route>

            {/* Identity & Access Module */}
            <Route path="iam" element={<ModuleLayout title="Identity & Access" items={productMenu.iam[0].items} accentColor="violet" />}>
                {identityRoutes}
            </Route>

            {/* Billing Module */}
            <Route path="billing" element={<ModuleLayout title="Billing" items={productMenu.billing[0].items} accentColor="emerald" />}>
                <Route index element={<BillingAdminPage />} />
                <Route path="overview" element={<BillingAdminPage />} />
                <Route path="plans" element={<PlansList />} />
                <Route path="invoices" element={<InvoicesList />} />
                <Route path="dunning" element={<DunningManager />} />
                <Route path="settings" element={<BillingSettings />} />
                <Route path="success" element={<BillingSuccess />} />
                <Route path="cancel" element={<BillingCancel />} />
            </Route>

            {/* Analytics & Reports Module */}
            <Route path="reports" element={<ModuleLayout title="Analytics & Reports" items={productMenu.reports[0].items} accentColor="violet" />}>
                <Route index element={<ReportsDashboard />} />
                <Route path="mrr" element={<MrrDashboard />} />
                <Route path="revenue" element={<RevenueReport />} />
                <Route path="crm" element={<CrmReport />} />
                <Route path="support" element={<SupportReport />} />
                <Route path="security" element={<SecurityReport />} />
                <Route path="hrm" element={<HrmReport />} />
                <Route path="finance" element={<FinanceReport />} />
                <Route path="projects" element={<ProjectsReport />} />
                <Route path="export" element={<ExportPage />} />
            </Route>

            {/* Contract Management Module */}
            <Route path="contracts" element={<ModuleLayout title="Contract Management" items={productMenu.contracts[0].items} accentColor="amber" />}>
                <Route index element={<ContractList />} />
                <Route path="list" element={<ContractList />} />
                <Route path="quotes" element={<QuoteList />} />
                <Route path="sla-tiers" element={<SlaTiersPage />} />
                <Route path="sla-breaches" element={<SlaBreachesPage />} />
                <Route path="settings" element={<ContractSettings />} />
            </Route>

            {/* Asset Management Module (ITAM) */}
            <Route path="itam" element={<ModuleLayout title="Asset Management" items={productMenu.itam[0].items} accentColor="teal" />}>
                <Route index element={<AssetDashboard />} />
                <Route path="assets" element={<AssetList />} />
                <Route path="assets/:id" element={<AssetDetail />} />
                <Route path="depreciation" element={<AssetDepreciation />} />
                <Route path="licenses" element={<LicenseManager />} />
                <Route path="settings" element={<ItamSettings />} />
            </Route>

            {/* Projects Module */}
            <Route path="projects" element={<ModuleLayout title="Project Management" items={productMenu.projects} accentColor="cyan" />}>
                {projectsRoutes}
            </Route>

            {/* CMS / Website Builder */}
            <Route path="cms/*" element={<CMSRoutes />} />

            {/* Document Management */}
            <Route path="documents" element={<ModuleLayout title="Document Management" items={productMenu.documents[0].items} accentColor="cyan" />}>
                <Route index element={<DocumentsDashboard />} />
                <Route path="settings" element={<DocumentSettings />} />
            </Route>

            {/* Approval Center */}
            <Route path="approvals" element={<ModuleLayout title="Approval Center" items={productMenu.approvals[0].items} accentColor="amber" />}>
                <Route index element={<ApprovalsDashboard />} />
                <Route path="settings" element={<ApprovalSettings />} />
            </Route>

            {/* Operations (ITSM) */}
            <Route path="itsm" element={<ModuleLayout title="Operations (ITSM)" items={productMenu.itsm[0].items} accentColor="indigo" />}>
                <Route index element={<ItsmDashboard />} />
                <Route path="requests" element={<ItsmDashboard />} />
                <Route path="changes" element={<ChangeRequestList />} />
                <Route path="problems" element={<ProblemsList />} />
                <Route path="settings" element={<ItsmSettings />} />
            </Route>

            {/* Blog Manager */}
            <Route path="blog" element={<ModuleLayout title="Blog Manager" items={[{ label: 'All Posts', icon: BookOpen, path: '/admin/blog' }, { label: 'New Post', icon: PlusCircle, path: '/admin/blog/new' }]} accentColor="sky" />}>
                <Route index element={<BlogPostList />} />
                <Route path="new" element={<BlogPostEditor />} />
                <Route path=":id/edit" element={<BlogPostEditor />} />
            </Route>

            {/* Portal Manager */}
            <Route path="portal" element={<ModuleLayout title="Client Portal" items={[{ label: 'Overview', icon: LayoutDashboard, path: '/admin/portal' }]} accentColor="indigo" />}>
                <Route index element={<PortalDashboard />} />
                <Route path=":clientId" element={<PortalClientView />} />
            </Route>

            {/* Fallback to dashboard */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
    );
};
