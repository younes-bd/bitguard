import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BookOpen, PlusCircle, Globe, LayoutDashboard, Users } from 'lucide-react';
import ModuleLayout from '../../../core/layouts/ModuleLayout';
import BackendLayout from '../../../core/layouts/BackendLayout';
import PlaceholderPage from '../../../core/components/PlaceholderPage';

// Dashboards
import DashboardRouter from './DashboardRouter';
import CommandCenter from '../pages/dashboards/CommandCenter';
import SalesDashboard from '../pages/dashboards/SalesDashboard';
import EcommerceDashboard from '../../ecommerce/pages/admin/EcommerceDashboard';
import StoreAdminDashboard from '../../ecommerce/pages/admin/StoreAdminDashboard';
import CrmDashboard from '../../crm/pages/dashboards/CrmDashboard';
import AccountingDashboard from '../../accounting/pages/dashboards/AccountingDashboard';
import HrAttendanceDashboard from '../../hr_attendance/pages/dashboards/AttendancesDashboard';
import PayrollDashboard from '../../payroll/pages/dashboards/PayrollDashboard';

import HrDashboard from '../../hr/pages/dashboards/HrmDashboard';
import SocDashboard from '../../soc/pages/dashboards/SocDashboard';
import HelpdeskDashboard from "../../helpdesk/pages/dashboards/HelpdeskDashboard";
import AppointmentsDashboard from "../../appointments/pages/dashboards/AppointmentsDashboard";
import FieldServiceDashboard from "../../field-service/pages/dashboards/FieldServiceDashboard";
import PlanningDashboard from "../../planning/pages/dashboards/PlanningDashboard";
import MarketingDashboard from '../../marketing/pages/dashboards/MarketingDashboard';

// Admin Pages
import UserManagement from '../pages/lists/UserManagement';
import SettingsDashboard from '../../settings/pages/dashboards/SettingsDashboard';
import { settingsRoutes } from '../../settings/routes/settingsRoutes';
import AppInstaller from '../../settings/pages/features/AppInstaller';

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
import AnalyticsDashboard from '../../dashboards/pages/dashboards/AnalyticsDashboard';
import ExecutiveSummary from '../../dashboards/pages/dashboards/ExecutiveSummary';
import RevenueReport from '../../dashboards/pages/lists/RevenueReport';
import CrmReport from '../../dashboards/pages/lists/CrmReport';
import SupportReport from '../../dashboards/pages/lists/SupportReport';
import SecurityReport from '../../dashboards/pages/lists/SecurityReport';
import MrrDashboard from '../pages/dashboards/MrrDashboard';
import ExportPage from '../../dashboards/pages/features/ExportPage';
import HrmReport from '../../dashboards/pages/lists/HrmReport';
import FinanceReport from '../../dashboards/pages/lists/FinanceReport';
import ProjectsReport from '../../dashboards/pages/lists/ProjectsReport';

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

// ITAM — asset pages
import AssetDashboard from '../../maintenance/pages/dashboards/AssetDashboard';
import AssetList from '../../maintenance/pages/lists/AssetList';
import AssetDetail from '../../maintenance/pages/details/AssetDetail';
import AssetDepreciation from '../../maintenance/pages/features/AssetDepreciation';
import LicenseManager from '../../maintenance/pages/lists/LicenseManager';
import ItamSettings from '../../maintenance/pages/settings/ItamSettings';

// Module Routes
import { crmRoutes } from '../../crm/routes/crmRoutes';
import { accountingRoutes } from '../../accounting/routes/accountingRoutes';
import { purchaseRoutes } from '../../purchase/routes/purchaseRoutes';
import { stockRoutes } from '../../stock/routes/stockRoutes';
import { salesRoutes } from '../../sales/routes/salesRoutes';
import { hrRoutes } from "../../hr/routes/hrRoutes";
import { HrAttendanceRoutes } from '../../hr_attendance/routes/attendancesRoutes';
import { HrHolidaysRoutes } from '../../hr_holidays/routes/timeoffRoutes';
import { recruitmentRoutes } from '../../recruitment/routes/recruitmentRoutes';
import { payrollRoutes } from '../../payroll/routes/payrollRoutes';
import { appraisalsRoutes } from '../../appraisals/routes/appraisalsRoutes';

import { socRoutes } from '../../soc/routes/socRoutes';
import { identityRoutes } from '../../auth/routes/identityRoutes';
import { ecommerceRoutes } from '../../ecommerce/routes/storeRoutes';
import { helpdeskRoutes } from '../../helpdesk/routes/helpdeskRoutes';
import { marketingRoutes } from '../../marketing/routes/marketingRoutes';
import { adminBlogRoutes } from '../../blog/routes/adminBlogRoutes';
import { elearningRoutes } from '../../elearning/routes/elearningRoutes';
import { appointmentsRoutes } from '../../appointments/routes/appointmentsRoutes';
import { planningRoutes } from '../../planning/routes/planningRoutes';
import { productMenu } from '../../../core/api/menu';
import NotificationCenter from '../pages/features/NotificationCenter';

// Discuss (Internal Chat)
import DiscussDashboard from '../../discuss/pages/DiscussDashboard';
import AdminWebsiteRoutes from '../../website/routes/adminWebsiteRoutes';

// Future Enhancement Modules
import EDMSDashboard from '../../documents/pages/dashboards/EDMSDashboard';
import DocumentSettings from '../../documents/pages/settings/DocumentSettings';
import WorkspaceManager from '../../documents/pages/settings/WorkspaceManager';
import TagManager from '../../documents/pages/settings/TagManager';
import DocumentDetail from '../../documents/pages/details/DocumentDetail';
import ApprovalsDashboard from '../../approvals/pages/dashboards/ApprovalsDashboard';
import ApprovalSettings from '../../approvals/pages/settings/ApprovalSettings';
import ProblemsList from '../../helpdesk/pages/lists/ProblemsList';
import ChangeRequestList from '../../helpdesk/pages/lists/ChangeRequestList';
import HelpdeskSettings from '../../helpdesk/pages/settings/HelpdeskSettings';
import ITServiceCatalog from '../../helpdesk/pages/lists/ITServiceCatalog';
import ServiceRequestsTracker from '../../helpdesk/pages/lists/ServiceRequestsTracker';

// Blog Manager
import BlogPostList from '../../blog/pages/admin/BlogPostList';
import BlogPostEditor from '../../blog/pages/features/BlogPostEditor';

// Portal
import PortalDashboard from '../../portal/pages/dashboards/PortalDashboard';
import PortalClientView from '../../portal/pages/details/PortalClientView';

import FinancialsDashboard from '../../accounting/pages/dashboards/FinancialsDashboard';


// Auto-generated Dashboard Imports
import InvoicingDashboard from '../../accounting/pages/dashboards/InvoicingDashboard';
import ExpensesDashboard from '../../hr/pages/dashboards/ExpensesDashboard';
import MrpDashboard from '../../mrp/pages/dashboards/MrpDashboard';
import FleetDashboard from '../../fleet/pages/dashboards/FleetDashboard';
import PosDashboard from '../../pos/pages/dashboards/PosDashboard';
import RentalDashboard from '../../rental/pages/dashboards/RentalDashboard';
import PlmDashboard from '../../mrp_plm/pages/dashboards/PlmDashboard';
import QualityDashboard from '../../quality_control/pages/dashboards/QualityDashboard';
import SpreadsheetDashboard from '../../documents/pages/dashboards/SpreadsheetDashboard';
import SocialDashboard from '../../marketing/pages/dashboards/SocialDashboard';
import SmsDashboard from '../../marketing/pages/dashboards/SmsDashboard';
import EventsDashboard from '../../marketing/pages/dashboards/EventsDashboard';
import SurveysDashboard from '../../marketing/pages/dashboards/SurveysDashboard';
import AppraisalsDashboard from '../../hr/pages/dashboards/AppraisalsDashboard';
import ReferralsDashboard from '../../hr/pages/dashboards/ReferralsDashboard';
import ElearningDashboard from '../../elearning/pages/admin/ElearningDashboard';
import LiveChatDashboard from '../../discuss/pages/dashboards/LiveChatDashboard';
import KnowledgeDashboard from '../../documents/pages/dashboards/KnowledgeDashboard';
import WhatsAppDashboard from '../../discuss/pages/dashboards/WhatsAppDashboard';


export const EnterpriseRoutes = () => {


    return (
        <Routes>
            {/* Main Platform Console (Command Center) */}
            <Route element={<BackendLayout />}>
                <Route index element={<DashboardRouter />} />
                <Route path="dashboard" element={<DashboardRouter />} />
                <Route path="notifications" element={<NotificationCenter />} />
                <Route path="sales" element={<SalesDashboard />} />
                <Route path="clients" element={<ClientDashboard />} />
                <Route path="clients/:id" element={<ClientDetail />} />
                <Route path="users" element={<UserManagement />} />
            </Route>

            {/* Platform Admin Module */}
            <Route path="settings" element={<ModuleLayout title="Settings" sections={productMenu.settings} accentColor="slate" />}>
                <Route index element={<SettingsDashboard />} />
                {settingsRoutes}
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            {/* Apps Module */}
            <Route path="apps" element={<ModuleLayout title="Apps" sections={productMenu.apps} accentColor="slate" />}>
                <Route index element={<AppInstaller />} />
                <Route path="themes" element={<AppInstaller />} />
                <Route path="updates" element={<AppInstaller />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            {/* Commerce Module */}
            <Route path="ecommerce" element={<ModuleLayout title="Commerce & Storefront" sections={productMenu.ecommerce} accentColor="indigo" />}>
                <Route index element={<EcommerceDashboard />} />
                <Route path="dashboard" element={<EcommerceDashboard />} />
                {ecommerceRoutes}
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            {/* Sales & CRM Module */}
            <Route path="crm" element={<ModuleLayout title="Sales & CRM" sections={productMenu.crm} accentColor="blue" />}>
                <Route index element={<CrmDashboard />} />
                {crmRoutes}
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            {/* Accounting & Financials Module */}
            <Route path="accounting" element={<ModuleLayout title="Finance & Accounting" sections={productMenu.accounting} accentColor="emerald" />}>
                <Route index element={<FinancialsDashboard />} />
                {accountingRoutes}
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            {/* Security Operations Center */}
            <Route path="security" element={<ModuleLayout title="Security Operations (SecOps)" sections={productMenu.security} accentColor="red" />}>
                <Route index element={<SocDashboard />} />
                {socRoutes}
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            {/* Sales Module */}
            <Route path="sales" element={<ModuleLayout title="Sales" sections={productMenu.sales} accentColor="blue" />}>
                {salesRoutes}
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            {/* Purchase Module */}
            <Route path="purchase" element={<ModuleLayout title="Purchase" sections={productMenu.purchase} accentColor="orange" />}>
                {purchaseRoutes}
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            {/* Inventory (Stock) Module */}
            <Route path="stock" element={<ModuleLayout title="Inventory" sections={productMenu.stock} accentColor="amber" />}>
                {stockRoutes}
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>


            {/* People & HR Module */}
            <Route path="hr" element={<ModuleLayout title="Employees" sections={productMenu.hr} accentColor="pink" />}>
                <Route index element={<HrDashboard />} />
                {hrRoutes}
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>



            {/* Marketing Automation Module */}
            <Route path="marketing" element={<ModuleLayout title="Marketing Automation" sections={productMenu.marketing} accentColor="yellow" />}>
                <Route index element={<MarketingDashboard />} />
                {marketingRoutes}
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            {/* Identity & Access Module */}
            <Route path="iam" element={<ModuleLayout title="Identity & Access Management" sections={productMenu.iam} accentColor="violet" />}>
                {identityRoutes}
                <Route path="*" element={<Navigate to="" replace />} />
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
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            {/* Analytics Module */}
            <Route path="dashboards" element={<ModuleLayout title="Dashboards" sections={productMenu.dashboards} accentColor="violet" />}>
                <Route index element={<AnalyticsDashboard />} />
                <Route path="executive" element={<ExecutiveSummary />} />
                <Route path="mrr" element={<MrrDashboard />} />
                <Route path="revenue" element={<RevenueReport />} />
                <Route path="crm" element={<CrmReport />} />
                <Route path="support" element={<SupportReport />} />
                <Route path="security" element={<SecurityReport />} />
                <Route path="hrm" element={<HrmReport />} />
                <Route path="finance" element={<FinanceReport />} />
                <Route path="projects" element={<ProjectsReport />} />
                <Route path="export" element={<ExportPage />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            {/* Reporting & Documents Module */}
            <Route path="reporting" element={<ModuleLayout title="Document Reporting Engine" sections={productMenu.reporting} accentColor="blue" />}>
                <Route index element={<ReportingDashboard />} />
                <Route path="templates" element={<TemplateManager />} />
                <Route path="generated" element={<GeneratedDocuments />} />
                <Route path="settings" element={<ReportingSettings />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            {/* Discuss / Internal Chat */}
            <Route path="discuss" element={<ModuleLayout title="Discuss" items={[{ label: 'Workspace', path: '/admin/discuss' }]} accentColor="purple" />}>
                <Route index element={<DiscussDashboard />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            {/* Contract Management Module */}
            <Route path="contracts" element={<ModuleLayout title="Contracts & SLAs" sections={productMenu.contracts} accentColor="amber" />}>
                {contractsRoutes}
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            {/* Asset Management Module */}
            <Route path="maintenance" element={<ModuleLayout title="Asset Management" sections={productMenu.assets} accentColor="teal" />}>
                <Route index element={<AssetDashboard />} />
                <Route path="maintenance" element={<AssetList />} />
                <Route path="assets/:id" element={<AssetDetail />} />
                <Route path="depreciation" element={<AssetDepreciation />} />
                <Route path="licenses" element={<LicenseManager />} />
                <Route path="settings" element={<ItamSettings />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            {/* Projects Module */}
            <Route path="projects" element={<ModuleLayout title="Project Portfolio Management" sections={productMenu.projects} accentColor="cyan" />}>
                {projectsRoutes}
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            {/* Website Admin Manager */}
            <Route path="website/*" element={<AdminWebsiteRoutes />} />

            {/* EDMS Module */}
            <Route path="documents" element={<ModuleLayout title="Document Management" sections={productMenu.documents} accentColor="cyan" />}>
                <Route index element={<EDMSDashboard />} />
                <Route path="documents" element={<EDMSDashboard />} />
                <Route path="documents/:id" element={<DocumentDetail />} />
                <Route path="workspaces" element={<WorkspaceManager />} />
                <Route path="tags" element={<TagManager />} />
                <Route path="settings" element={<DocumentSettings />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            {/* Approval Center */}
            <Route path="approvals" element={<ModuleLayout title="Approval Center" sections={productMenu.approvals} accentColor="amber" />}>
                <Route index element={<ApprovalsDashboard />} />
                <Route path="settings" element={<ApprovalSettings />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            {/* Helpdesk (ITSM) */}
            <Route path="helpdesk/*" element={<ModuleLayout title="Helpdesk" sections={productMenu.helpdesk} accentColor="amber" />}>
                <Route index element={<HelpdeskDashboard />} />
                {helpdeskRoutes}
                <Route path="catalog" element={<ITServiceCatalog />} />
                <Route path="requests" element={<ServiceRequestsTracker />} />
                <Route path="settings" element={<HelpdeskSettings />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            <Route path="appointments/*" element={<ModuleLayout title="Appointments" sections={productMenu.appointments} accentColor="blue" />}>
                <Route index element={<AppointmentsDashboard />} />
                {appointmentsRoutes}
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            <Route path="field-service/*" element={<ModuleLayout title="Field Service" sections={productMenu.field_service} accentColor="emerald" />}>
                <Route index element={<FieldServiceDashboard />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            <Route path="planning/*" element={<ModuleLayout title="Planning" sections={productMenu.planning} accentColor="amber" />}>
                <Route index element={<PlanningDashboard />} />
                {planningRoutes}
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            {/* Blog Manager */}
            <Route path="blog/*" element={<ModuleLayout title="Blog Manager" sections={productMenu.blog} accentColor="sky" />}>
                {adminBlogRoutes}
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            {/* Portal Manager */}
            <Route path="portal" element={<ModuleLayout title="Client Portal" items={[{ label: 'Overview', icon: LayoutDashboard, path: '/admin/portal' }]} accentColor="indigo" />}>
                <Route index element={<PortalDashboard />} />
                <Route path=":clientId" element={<PortalClientView />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            {/* NEW MISSING ODOO APPS (Frontend Placeholders) */}
            <Route path="rental" element={<ModuleLayout title="Rental" sections={productMenu.rental} accentColor="blue" />}>
                <Route index element={<RentalDashboard />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>
            <Route path="spreadsheet" element={<ModuleLayout title="Spreadsheet" sections={productMenu.spreadsheet} accentColor="emerald" />}>
                <Route index element={<SpreadsheetDashboard />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>
            <Route path="quality_control" element={<ModuleLayout title="Quality" sections={productMenu.quality} accentColor="emerald" />}>
                <Route index element={<QualityDashboard />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>
            <Route path="mrp_plm" element={<ModuleLayout title="PLM" sections={productMenu.plm} accentColor="blue" />}>
                <Route index element={<PlmDashboard />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>
            <Route path="appraisals" element={<ModuleLayout title="Appraisals" sections={productMenu.appraisals} accentColor="amber" />}>
                {appraisalsRoutes}
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>
                        <Route path="fleet" element={<ModuleLayout title="Fleet" sections={productMenu.fleet} accentColor="indigo" />}>
                <Route index element={<FleetDashboard />} />
                <Route path="*" element={<FleetDashboard />} />
            </Route>
            <Route path="referrals" element={<ModuleLayout title="Referrals" sections={productMenu.referrals} accentColor="sky" />}>
                <Route index element={<ReferralsDashboard />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>
            <Route path="social" element={<ModuleLayout title="Social Marketing" sections={productMenu.social} accentColor="sky" />}>
                <Route index element={<SocialDashboard />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>
            <Route path="sms" element={<ModuleLayout title="SMS Marketing" sections={productMenu.sms} accentColor="teal" />}>
                <Route index element={<SmsDashboard />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>
            <Route path="events" element={<ModuleLayout title="Events" sections={productMenu.events} accentColor="purple" />}>
                <Route index element={<EventsDashboard />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>
            <Route path="surveys" element={<ModuleLayout title="Surveys" sections={productMenu.surveys} accentColor="emerald" />}>
                <Route index element={<SurveysDashboard />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>
            <Route path="elearning/*" element={<ModuleLayout title="eLearning" sections={productMenu.elearning} accentColor="indigo" />}>
                {elearningRoutes}
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>
            <Route path="livechat" element={<ModuleLayout title="Live Chat" sections={productMenu.livechat} accentColor="rose" />}>
                <Route index element={<LiveChatDashboard />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>
            <Route path="knowledge" element={<ModuleLayout title="Knowledge" sections={productMenu.knowledge} accentColor="emerald" />}>
                <Route index element={<KnowledgeDashboard />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>
            <Route path="whatsapp" element={<ModuleLayout title="WhatsApp" sections={productMenu.whatsapp} accentColor="emerald" />}>
                <Route index element={<WhatsAppDashboard />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>

            <Route path="hr_attendance" element={<ModuleLayout title="hr_attendance" sections={productMenu.HrAttendance} accentColor="orange" />}>
                {HrAttendanceRoutes}
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>
            <Route path="payroll" element={<ModuleLayout title="Payroll" sections={productMenu.payroll} accentColor="emerald" />}>
                {payrollRoutes}
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>
            <Route path="hr_holidays" element={<ModuleLayout title="Time Off" sections={productMenu.HrHolidays} accentColor="purple" />}>
                {HrHolidaysRoutes}
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>
            <Route path="recruitment" element={<ModuleLayout title="Recruitment" sections={productMenu.recruitment} accentColor="pink" />}>
                {recruitmentRoutes}
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>
            <Route path="expenses" element={<ModuleLayout title="Expenses" sections={productMenu.expenses} accentColor="amber" />}>
                <Route index element={<ExpensesDashboard />} />
                <Route path="*" element={<ExpensesDashboard />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
    );
};
