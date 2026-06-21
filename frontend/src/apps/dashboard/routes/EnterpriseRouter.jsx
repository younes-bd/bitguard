import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BookOpen, PlusCircle, Globe, LayoutDashboard } from 'lucide-react';

// Layouts
import ConsoleLayout from '../../../core/layouts/ConsoleLayout';
import ModuleLayout from '../../../core/layouts/ModuleLayout';

// Dashboards
import DashboardRouter from './DashboardRouter';
import CommandCenter from '../pages/dashboards/CommandCenter';
import SalesDashboard from '../pages/dashboards/SalesDashboard';
import StoreDashboard from '../../store/pages/dashboards/StoreDashboard';
import StoreAdminDashboard from '../../store/pages/dashboards/StoreAdminDashboard';
import CrmDashboard from '../../crm/pages/dashboards/CrmDashboard';
import AccountingDashboard from '../../accounting/pages/dashboards/AccountingDashboard';

import HrmDashboard from '../../hrm/pages/dashboards/HrmDashboard';
import SocDashboard from '../../soc/pages/dashboards/SocDashboard';
import SupportDashboard from '../../support/pages/dashboards/SupportDashboard';
import MarketingDashboard from '../../marketing/pages/dashboards/MarketingDashboard';

// Admin Pages
import UserManagement from '../pages/lists/UserManagement';
import SysadminDashboard from '../../sysadmin/pages/dashboards/SysadminDashboard';
import { sysadminRoutes } from '../../sysadmin/routes/sysadminRoutes';

// Feature Pages - CRM
import ClientDashboard from '../../crm/pages/dashboards/ClientDashboard';
import ClientDetail from '../../crm/pages/profiles/ClientDetail';
import RoleList from '../../auth/pages/identity/RoleList';
import UserList from '../../auth/pages/identity/UserList';

// Billing
import BillingAdminPage from '../../billing/pages/dashboards/BillingAdminPage';
import PlansList from '../../billing/pages/lists/PlansList';
import InvoicesList from '../../billing/pages/lists/InvoicesList';
import BillingSettings from '../../billing/pages/settings/BillingSettings';
import BillingSuccess from '../../billing/pages/features/BillingSuccess';
import BillingCancel from '../../billing/pages/features/BillingCancel';
import DunningManager from '../../billing/pages/lists/DunningManager';

// Analytics
import AnalyticsDashboard from '../../analytics/pages/dashboards/AnalyticsDashboard';
import RevenueReport from '../../analytics/pages/lists/RevenueReport';
import CrmReport from '../../analytics/pages/lists/CrmReport';
import SupportReport from '../../analytics/pages/lists/SupportReport';
import SecurityReport from '../../analytics/pages/lists/SecurityReport';
import MrrDashboard from '../pages/dashboards/MrrDashboard';
import ExportPage from '../../analytics/pages/features/ExportPage';
import HrmReport from '../../analytics/pages/lists/HrmReport';
import FinanceReport from '../../analytics/pages/lists/FinanceReport';
import ProjectsReport from '../../analytics/pages/lists/ProjectsReport';

// Reporting (PDF Engine)
import ReportingDashboard from '../../reporting/pages/dashboards/ReportingDashboard';
import TemplateManager from '../../reporting/pages/templates/TemplateManager';
import GeneratedDocuments from '../../reporting/pages/generated/GeneratedDocuments';
import ReportingSettings from '../../reporting/pages/settings/ReportingSettings';

// Contracts
import { contractsRoutes } from '../../contracts/routes/contractsRoutes';

// Project Management (Dedicated Module)
import ProjectsDashboard from '../../projects/pages/dashboards/ProjectsDashboard';
import { projectsRoutes } from '../../projects/routes/projectsRoutes';

// IAM extra pages
import IamDashboard from '../../auth/pages/identity/IamDashboard';
import TenantList from '../../auth/pages/identity/TenantList';
import IamSettings from '../../auth/pages/identity/IamSettings';
import MfaManagement from '../../auth/pages/identity/MfaManagement';
import ApiKeyManagement from '../../auth/pages/identity/ApiKeyManagement';
import ActiveSessions from '../../auth/pages/identity/ActiveSessions';

// Audit
import AuditLogList from '../../audit/pages/lists/AuditLogList';

// ITAM — asset pages
import AssetDashboard from '../../assets/pages/dashboards/AssetDashboard';
import AssetList from '../../assets/pages/lists/AssetList';
import AssetDetail from '../../assets/pages/details/AssetDetail';
import AssetDepreciation from '../../assets/pages/features/AssetDepreciation';
import LicenseManager from '../../assets/pages/lists/LicenseManager';
import ItamSettings from '../../assets/pages/settings/ItamSettings';

// Module Routes
import { crmRoutes } from '../../crm/routes/crmRoutes';
import { accountingRoutes } from '../../accounting/routes/accountingRoutes';
import { purchaseRoutes } from '../../purchase/routes/purchaseRoutes';
import { inventoryRoutes } from '../../inventory/routes/inventoryRoutes';
import { salesRoutes } from '../../sales/routes/salesRoutes';
import { hrmRoutes } from '../../hrm/routes/hrmRoutes';
import { socRoutes } from '../../soc/routes/socRoutes';
import { identityRoutes } from '../../auth/routes/identityRoutes';
import { storeRoutes } from '../../store/routes/storeRoutes';
import { supportRoutes } from '../../support/routes/supportRoutes';
import { marketingRoutes } from '../../marketing/routes/marketingRoutes';
import { productMenu } from '../../../core/api/menu';
import NotificationCenter from '../pages/features/NotificationCenter';

// Discuss (Internal Chat)
import DiscussDashboard from '../../discuss/pages/DiscussDashboard';
import CMSRoutes from '../../cms/routes/CMSRoutes';

// Future Enhancement Modules
import EDMSDashboard from '../../edms/pages/dashboards/EDMSDashboard';
import DocumentSettings from '../../edms/pages/settings/DocumentSettings';
import WorkspaceManager from '../../edms/pages/settings/WorkspaceManager';
import TagManager from '../../edms/pages/settings/TagManager';
import DocumentDetail from '../../edms/pages/details/DocumentDetail';
import ApprovalsDashboard from '../../approvals/pages/dashboards/ApprovalsDashboard';
import ApprovalSettings from '../../approvals/pages/settings/ApprovalSettings';
import ItsmDashboard from '../../services/pages/dashboards/ItsmDashboard';
import ProblemsList from '../../services/pages/lists/ProblemsList';
import ChangeRequestList from '../../services/pages/lists/ChangeRequestList';
import ItsmSettings from '../../services/pages/settings/ItsmSettings';
import ITServiceCatalog from '../../services/pages/lists/ITServiceCatalog';
import ServiceRequestsTracker from '../../services/pages/lists/ServiceRequestsTracker';

// Blog Manager
import BlogPostList from '../../blog/pages/lists/BlogPostList';
import BlogPostEditor from '../../blog/pages/features/BlogPostEditor';

// Portal
import PortalDashboard from '../../portal/pages/dashboards/PortalDashboard';
import PortalClientView from '../../portal/pages/details/PortalClientView';

import FinancialsDashboard from '../../accounting/pages/dashboards/FinancialsDashboard';

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
            <Route path="system" element={<ModuleLayout title="Platform Administration" sections={productMenu.system} accentColor="slate" />}>
                <Route index element={<SysadminDashboard />} />
                {sysadminRoutes}
            </Route>

            {/* Commerce Module */}
            <Route path="store" element={<ModuleLayout title="Commerce & Storefront" sections={productMenu.store} accentColor="indigo" />}>
                <Route index element={<StoreDashboard />} />
                <Route path="dashboard" element={<StoreDashboard />} />
                {storeRoutes}
            </Route>

            {/* Sales & CRM Module */}
            <Route path="crm" element={<ModuleLayout title="Sales & CRM" sections={productMenu.crm} accentColor="blue" />}>
                <Route index element={<CrmDashboard />} />
                {crmRoutes}
            </Route>

            {/* Accounting & Financials Module */}
            <Route path="accounting" element={<ModuleLayout title="Finance & Accounting" sections={productMenu.accounting} accentColor="emerald" />}>
                <Route index element={<FinancialsDashboard />} />
                {accountingRoutes}
            </Route>

            {/* Security Operations Center */}
            <Route path="security" element={<ModuleLayout title="Security Operations (SecOps)" sections={productMenu.security} accentColor="red" />}>
                <Route index element={<SocDashboard />} />
                {socRoutes}
            </Route>

            {/* Sales Module */}
            <Route path="sales" element={<ModuleLayout title="Sales" sections={productMenu.sales} accentColor="blue" />}>
                {salesRoutes}
            </Route>

            {/* Purchase Module */}
            <Route path="purchase" element={<ModuleLayout title="Purchase" sections={productMenu.purchase} accentColor="orange" />}>
                {purchaseRoutes}
            </Route>

            {/* Inventory Module */}
            <Route path="inventory" element={<ModuleLayout title="Inventory" sections={productMenu.inventory} accentColor="amber" />}>
                {inventoryRoutes}
            </Route>


            {/* People & HR Module */}
            <Route path="hrm" element={<ModuleLayout title="Human Capital Management" sections={productMenu.hrm} accentColor="pink" />}>
                <Route index element={<HrmDashboard />} />
                {hrmRoutes}
            </Route>

            {/* Service Desk Module */}
            <Route path="support" element={<ModuleLayout title="IT Service Desk" sections={productMenu.support} accentColor="teal" />}>
                <Route index element={<SupportDashboard />} />
                {supportRoutes}
            </Route>

            {/* Marketing Automation Module */}
            <Route path="marketing" element={<ModuleLayout title="Marketing Automation" sections={productMenu.marketing} accentColor="yellow" />}>
                <Route index element={<MarketingDashboard />} />
                {marketingRoutes}
            </Route>

            {/* Identity & Access Module */}
            <Route path="iam" element={<ModuleLayout title="Identity & Access Management" sections={productMenu.iam} accentColor="violet" />}>
                {identityRoutes}
            </Route>

            {/* Audit Log Module */}
            <Route path="audit" element={<ModuleLayout title="Audit Logs" items={[{ label: 'Logs', path: '/admin/audit' }]} accentColor="emerald" />}>
                <Route index element={<AuditLogList />} />
            </Route>

            {/* Billing Module */}
            <Route path="billing" element={<ModuleLayout title="Subscription Billing" sections={productMenu.billing} accentColor="emerald" />}>
                <Route index element={<BillingAdminPage />} />
                <Route path="overview" element={<BillingAdminPage />} />
                <Route path="plans" element={<PlansList />} />
                <Route path="invoices" element={<InvoicesList />} />
                <Route path="dunning" element={<DunningManager />} />
                <Route path="settings" element={<BillingSettings />} />
                <Route path="success" element={<BillingSuccess />} />
                <Route path="cancel" element={<BillingCancel />} />
            </Route>

            {/* Analytics Module */}
            <Route path="analytics" element={<ModuleLayout title="Enterprise Analytics" sections={productMenu.analytics} accentColor="violet" />}>
                <Route index element={<AnalyticsDashboard />} />
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

            {/* Reporting & Documents Module */}
            <Route path="reporting" element={<ModuleLayout title="Document Reporting Engine" sections={productMenu.reporting} accentColor="blue" />}>
                <Route index element={<ReportingDashboard />} />
                <Route path="templates" element={<TemplateManager />} />
                <Route path="generated" element={<GeneratedDocuments />} />
                <Route path="settings" element={<ReportingSettings />} />
            </Route>

            {/* Discuss / Internal Chat */}
            <Route path="discuss" element={<ModuleLayout title="Discuss" items={[{ label: 'Workspace', path: '/admin/discuss' }]} accentColor="purple" />}>
                <Route index element={<DiscussDashboard />} />
            </Route>

            {/* Contract Management Module */}
            <Route path="contracts" element={<ModuleLayout title="Contracts & SLAs" sections={productMenu.contracts} accentColor="amber" />}>
                {contractsRoutes}
            </Route>

            {/* Asset Management Module */}
            <Route path="assets" element={<ModuleLayout title="Asset Management" sections={productMenu.assets} accentColor="teal" />}>
                <Route index element={<AssetDashboard />} />
                <Route path="assets" element={<AssetList />} />
                <Route path="assets/:id" element={<AssetDetail />} />
                <Route path="depreciation" element={<AssetDepreciation />} />
                <Route path="licenses" element={<LicenseManager />} />
                <Route path="settings" element={<ItamSettings />} />
            </Route>

            {/* Projects Module */}
            <Route path="projects" element={<ModuleLayout title="Project Portfolio Management" sections={productMenu.projects} accentColor="cyan" />}>
                {projectsRoutes}
            </Route>

            {/* CMS / Website Builder */}
            <Route path="cms/*" element={<CMSRoutes />} />

            {/* EDMS Module */}
            <Route path="edms" element={<ModuleLayout title="Document Management" sections={productMenu.edms} accentColor="cyan" />}>
                <Route index element={<EDMSDashboard />} />
                <Route path="documents" element={<EDMSDashboard />} />
                <Route path="documents/:id" element={<DocumentDetail />} />
                <Route path="workspaces" element={<WorkspaceManager />} />
                <Route path="tags" element={<TagManager />} />
                <Route path="settings" element={<DocumentSettings />} />
            </Route>

            {/* Approval Center */}
            <Route path="approvals" element={<ModuleLayout title="Approval Center" sections={productMenu.approvals} accentColor="amber" />}>
                <Route index element={<ApprovalsDashboard />} />
                <Route path="settings" element={<ApprovalSettings />} />
            </Route>

            {/* Operations (Services) */}
            <Route path="services" element={<ModuleLayout title="Service Operations" sections={productMenu.services} accentColor="indigo" />}>
                <Route index element={<ItsmDashboard />} />
                <Route path="catalog" element={<ITServiceCatalog />} />
                <Route path="requests" element={<ServiceRequestsTracker />} />
                {/* <Route path="changes" element={<ChangeRequestList />} /> */}
                {/* <Route path="problems" element={<ProblemsList />} /> */}
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

            {/* NEW MISSING ODOO APPS (Frontend Placeholders) */}
            <Route path="rental" element={<ModuleLayout title="Rental" sections={productMenu.rental} accentColor="blue" />} />
            <Route path="spreadsheet" element={<ModuleLayout title="Spreadsheet" sections={productMenu.spreadsheet} accentColor="emerald" />} />
            <Route path="quality" element={<ModuleLayout title="Quality" sections={productMenu.quality} accentColor="emerald" />} />
            <Route path="plm" element={<ModuleLayout title="PLM" sections={productMenu.plm} accentColor="blue" />} />
            <Route path="appraisals" element={<ModuleLayout title="Appraisals" sections={productMenu.appraisals} accentColor="amber" />} />
            <Route path="referrals" element={<ModuleLayout title="Referrals" sections={productMenu.referrals} accentColor="sky" />} />
            <Route path="social" element={<ModuleLayout title="Social Marketing" sections={productMenu.social} accentColor="sky" />} />
            <Route path="sms" element={<ModuleLayout title="SMS Marketing" sections={productMenu.sms} accentColor="teal" />} />
            <Route path="events" element={<ModuleLayout title="Events" sections={productMenu.events} accentColor="purple" />} />
            <Route path="surveys" element={<ModuleLayout title="Surveys" sections={productMenu.surveys} accentColor="emerald" />} />
            <Route path="elearning" element={<ModuleLayout title="eLearning" sections={productMenu.elearning} accentColor="indigo" />} />
            <Route path="livechat" element={<ModuleLayout title="Live Chat" sections={productMenu.livechat} accentColor="rose" />} />
            <Route path="knowledge" element={<ModuleLayout title="Knowledge" sections={productMenu.knowledge} accentColor="emerald" />} />
            <Route path="whatsapp" element={<ModuleLayout title="WhatsApp" sections={productMenu.whatsapp} accentColor="emerald" />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
    );
};
