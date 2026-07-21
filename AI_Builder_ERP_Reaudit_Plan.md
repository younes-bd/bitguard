# BitGuard ERP — Full Re-Audit Implementation Plan
**For AI Builder: Implement phase by phase, step by step.**
**Architecture: Django REST Framework (backend) + React/Vite (frontend)**

---

## 🗺️ SYSTEM MAP (Current State After Audit)

### Backend Apps & Registered Endpoints
| App | Backend Path | Central URL prefix | Status |
|---|---|---|---|
| `sale` | `apps.sale` | `/api/sale/` | ✅ Complete (ViewSets + actions) |
| `crm` | `apps.crm` | `/api/crm/` | ✅ Complete |
| `accounting` | `apps.accounting` | `/api/accounting/` | ✅ Complete |
| `hrm` | `apps.hrm` | `/api/hrm/` | ✅ Complete (incl. payroll) |
| `inventory` | `apps.inventory` | `/api/inventory/` | ✅ Complete |
| `purchase` | `apps.purchase` | `/api/purchase/` | ✅ Complete |
| `projects` | `apps.projects` | `/api/projects/` | ✅ Complete |
| `support` | `apps.support` | `/api/support/` | ✅ Complete |
| `marketing` | `apps.marketing` | `/api/marketing/` | ✅ Complete |
| `fleet` | `apps.fleet` | `/api/fleet/` | ⚠️ Partial (no tenant filter, no pagination) |
| `mrp` | `apps.mrp` | `/api/mrp/` | ⚠️ Partial (no tenant filter, no pagination) |
| `pos` | `apps.pos` | `/api/pos/` | ⚠️ Partial (no tenant filter, no pagination) |
| `quality` | `apps.quality` | `/api/quality/` | ⚠️ Minimal (only QualityAlert model) |
| `plm` | `apps.plm` | `/api/plm/` | ⚠️ Minimal (only ECO model) |
| `rental` | `apps.rental` | `/api/rental/` | ⚠️ Partial (no tenant filter) |
| `discuss` | `apps.discuss` | `/api/discuss/` | ⚠️ Partial (no tenant filter) |
| `blog` | `apps.blog` | `/api/blog/` | ✅ Registered |
| `portal` | `apps.portal` | `/api/portal/` | ✅ Has dashboard + invoice views |
| `edms` | `apps.edms` | `/api/edms/` | ✅ Complete |
| `approvals` | `apps.approvals` | `/api/approvals/` | ✅ Complete |
| `audit` | `apps.audit` | `/api/audit/` | ✅ Complete |
| `billing` | `apps.billing` | `/api/billing/` | ✅ Complete |
| `reporting` | `apps.reporting` | `/api/reporting/` | ✅ Complete |

### Frontend Service Files → Backend URL Mapping (Critical)
| Service File | Calls URL | Backend URL Pattern | Match? |
|---|---|---|---|
| `fleetService.js` | `/fleet/vehicles/` | `/api/fleet/vehicles/` | ✅ |
| `mrpService.js` | `/mrp/manufacturingorders/` | `/api/mrp/manufacturingorders/` | ✅ |
| `posService.js` | `/pos/possessions/` | `/api/pos/possessions/` | ✅ |
| `qualityService.js` | `/quality/qualityalerts/` | `/api/quality/qualityalerts/` | ✅ |
| `rentalService.js` | `/rental/rentalorders/` | `/api/rental/rentalorders/` | ✅ |
| `payrollService.js` | `/hrm/payslips/` | `/api/hrm/payslips/` | ✅ |
| `discussService.js` | `/discuss/channels/` | `/api/discuss/channels/` | ✅ |
| `plmService.js` | `/plm/engineeringchangeorders/` | `/api/plm/engineeringchangeorders/` | ✅ |

> ✅ **All service files now use `import apiClient from './client'`** (fixed previously)
> ✅ **All URL mappings are consistent** — no mismatches found

### Frontend Routes vs menu.js — Dead Links Identified
See detailed phase breakdown below.

---

# PHASE 1 — CRITICAL: Create `PlaceholderPage` Component
**This must be done FIRST — all other phases depend on it.**

### Step 1.1 — Create the shared placeholder component

**Create file:** `frontend/src/core/components/shared/PlaceholderPage.jsx`

```jsx
import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlaceholderPage = ({ title = 'Module', subtitle }) => {
  const navigate = useNavigate();
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', gap: '16px',
      color: '#94a3b8', textAlign: 'center', padding: '32px'
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(99,102,241,0.1)', display: 'flex',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <Construction size={40} color="#6366f1" />
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
        {title}
      </h2>
      <p style={{ fontSize: 15, maxWidth: 400, margin: 0 }}>
        {subtitle || `The "${title}" section is being built. Full functionality coming soon.`}
      </p>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, marginTop: 8,
          padding: '10px 20px', borderRadius: 8, border: '1px solid #334155',
          background: 'transparent', color: '#94a3b8', cursor: 'pointer',
          fontSize: 14
        }}
      >
        <ArrowLeft size={16} /> Go Back
      </button>
    </div>
  );
};

export default PlaceholderPage;
```

---

# PHASE 2 — CRITICAL: Fix EnterpriseRouter.jsx Dead Routes

**File to edit:** `frontend/src/apps/board/routes/EnterpriseRouter.jsx`

### Step 2.1 — Add import for PlaceholderPage at top of file

Add this import after the existing imports:
```jsx
import PlaceholderPage from '../../core/components/shared/PlaceholderPage';
```

### Step 2.2 — Fix `calendar` route (currently uses wrong menu key)

**Change this:**
```jsx
<Route path="calendar" element={<ModuleLayout title="Calendar" sections={productMenu.discuss} accentColor="blue" />} />
```
**To this:**
```jsx
<Route path="calendar" element={<ModuleLayout title="Calendar" sections={productMenu.calendar} accentColor="blue" />}>
  <Route index element={<PlaceholderPage title="Calendar" subtitle="View and manage meetings, events and schedules." />} />
  <Route path="*" element={<PlaceholderPage title="Calendar" />} />
</Route>
```

### Step 2.3 — Fix `email-marketing` route (uses wrong menu key)

**Change this:**
```jsx
<Route path="email-marketing" element={<ModuleLayout title="Email Marketing" sections={productMenu.marketing} accentColor="purple" />} />
```
**To this:**
```jsx
<Route path="email-marketing" element={<ModuleLayout title="Email Marketing" sections={productMenu.marketing} accentColor="purple" />}>
  <Route index element={<PlaceholderPage title="Email Marketing" subtitle="Create, send and track email campaigns." />} />
  <Route path="mailings" element={<PlaceholderPage title="Mailings" />} />
  <Route path="templates" element={<PlaceholderPage title="Email Templates" />} />
  <Route path="settings" element={<PlaceholderPage title="Email Marketing Settings" />} />
</Route>
```

### Step 2.4 — Fix `timesheets` route (has no children)

**Change this:**
```jsx
<Route path="timesheets" element={<ModuleLayout title="Timesheets" sections={productMenu.timesheets} accentColor="indigo" />} />
```
**To this:**
```jsx
<Route path="timesheets" element={<ModuleLayout title="Timesheets" sections={productMenu.timesheets} accentColor="indigo" />}>
  <Route index element={<PlaceholderPage title="My Timesheets" subtitle="Log and track time against projects and tasks." />} />
  <Route path="all" element={<PlaceholderPage title="All Timesheets" />} />
  <Route path="reports/employee" element={<PlaceholderPage title="Timesheets by Employee" />} />
  <Route path="reports/project" element={<PlaceholderPage title="Timesheets by Project" />} />
  <Route path="reports/task" element={<PlaceholderPage title="Timesheets by Task" />} />
  <Route path="reports/billing" element={<PlaceholderPage title="Timesheets by Billing Type" />} />
  <Route path="settings" element={<PlaceholderPage title="Timesheet Settings" />} />
</Route>
```

### Step 2.5 — Fix `recruitment` route (has no children)

**Change this:**
```jsx
<Route path="recruitment" element={<ModuleLayout title="Recruitment" sections={productMenu.recruitment} accentColor="rose" />} />
```
**To this:**
```jsx
<Route path="recruitment" element={<ModuleLayout title="Recruitment" sections={productMenu.recruitment} accentColor="rose" />}>
  <Route index element={<PlaceholderPage title="Job Positions" subtitle="Manage job openings and recruitment pipeline." />} />
  <Route path="jobs" element={<PlaceholderPage title="Job Positions" />} />
  <Route path="applications" element={<PlaceholderPage title="Applications" />} />
  <Route path="reports" element={<PlaceholderPage title="Recruitment Reports" />} />
</Route>
```

### Step 2.6 — Fix `timeoff` route (has no children)

**Change this:**
```jsx
<Route path="timeoff" element={<ModuleLayout title="Time Off" sections={productMenu.timeoff} accentColor="amber" />} />
```
**To this:**
```jsx
<Route path="timeoff" element={<ModuleLayout title="Time Off" sections={productMenu.timeoff} accentColor="amber" />}>
  <Route index element={<PlaceholderPage title="My Time Off" subtitle="Request and track leave allocations." />} />
  <Route path="approvals" element={<PlaceholderPage title="Leave Approvals" />} />
  <Route path="allocations" element={<PlaceholderPage title="Leave Allocations" />} />
  <Route path="reports" element={<PlaceholderPage title="Time Off Reports" />} />
</Route>
```

### Step 2.7 — Expand `pos` route with all sub-pages

**Replace the existing pos route block:**
```jsx
<Route path="pos" element={<ModuleLayout title="Point of Sale" sections={productMenu.pos} accentColor="emerald" />}>
  <Route index element={<PosDashboard />} />
  <Route path="sessions" element={<SessionList />} />
  <Route path="sessions/new" element={<SessionForm />} />
  <Route path="sessions/:id" element={<SessionForm />} />
  <Route path="orders" element={<PlaceholderPage title="POS Orders" />} />
  <Route path="payments" element={<PlaceholderPage title="POS Payments" />} />
  <Route path="products" element={<PlaceholderPage title="POS Products" />} />
  <Route path="pricelists" element={<PlaceholderPage title="Pricelists" />} />
  <Route path="customers" element={<PlaceholderPage title="POS Customers" />} />
  <Route path="reports" element={<PlaceholderPage title="POS Reports" />} />
  <Route path="sales-details" element={<PlaceholderPage title="Sales Details" />} />
  <Route path="settings" element={<PlaceholderPage title="POS Settings" />} />
  <Route path="configs" element={<PlaceholderPage title="POS Configuration" />} />
  <Route path="payment-methods" element={<PlaceholderPage title="Payment Methods" />} />
  <Route path="coins" element={<PlaceholderPage title="Coins & Bills" />} />
</Route>
```

### Step 2.8 — Expand `fleet` route with all sub-pages

**Replace the existing fleet route block:**
```jsx
<Route path="fleet" element={<ModuleLayout title="Fleet" sections={productMenu.fleet} accentColor="slate" />}>
  <Route index element={<FleetDashboard />} />
  <Route path="vehicles" element={<VehicleList />} />
  <Route path="vehicles/new" element={<VehicleForm />} />
  <Route path="vehicles/:id" element={<VehicleForm />} />
  <Route path="odometer" element={<PlaceholderPage title="Odometer Logs" subtitle="Track vehicle mileage and odometer readings." />} />
  <Route path="contracts" element={<PlaceholderPage title="Fleet Contracts" subtitle="Insurance and service contracts for your fleet." />} />
  <Route path="services" element={<PlaceholderPage title="Fleet Services" subtitle="Maintenance and service history." />} />
  <Route path="settings" element={<PlaceholderPage title="Fleet Settings" />} />
</Route>
```

### Step 2.9 — Expand `mrp` route with all sub-pages

**Replace the existing mrp route block:**
```jsx
<Route path="mrp" element={<ModuleLayout title="Manufacturing" sections={productMenu.mrp} accentColor="rose" />}>
  <Route index element={<MrpDashboard />} />
  <Route path="orders" element={<OrderList />} />
  <Route path="orders/new" element={<OrderForm />} />
  <Route path="orders/:id" element={<OrderForm />} />
  <Route path="work-orders" element={<PlaceholderPage title="Work Orders" subtitle="Manage individual work operations." />} />
  <Route path="scrap" element={<PlaceholderPage title="Scrap" subtitle="Record scrapped materials and products." />} />
  <Route path="products" element={<PlaceholderPage title="MRP Products" />} />
  <Route path="bom" element={<PlaceholderPage title="Bills of Materials" subtitle="Define product components and structure." />} />
  <Route path="reports/orders" element={<PlaceholderPage title="Manufacturing Reports" />} />
  <Route path="reports/work-orders" element={<PlaceholderPage title="Work Order Analysis" />} />
  <Route path="settings" element={<PlaceholderPage title="Manufacturing Settings" />} />
  <Route path="work-centers" element={<PlaceholderPage title="Work Centers" subtitle="Configure production work centers." />} />
  <Route path="operations" element={<PlaceholderPage title="Operations" />} />
</Route>
```

### Step 2.10 — Expand `quality` route with all sub-pages

**Replace the existing quality route block:**
```jsx
<Route path="quality" element={<ModuleLayout title="Quality" sections={productMenu.quality} accentColor="emerald" />}>
  <Route index element={<QualityDashboard />} />
  <Route path="qualityalerts" element={<QualityAlertList />} />
  <Route path="qualityalerts/new" element={<QualityAlertForm />} />
  <Route path="qualityalerts/:id" element={<QualityAlertForm />} />
  <Route path="alerts" element={<QualityAlertList />} />
  <Route path="control-points" element={<PlaceholderPage title="Control Points" subtitle="Define quality checkpoints in your production flow." />} />
  <Route path="checks" element={<PlaceholderPage title="Quality Checks" subtitle="Review and record quality inspection results." />} />
  <Route path="settings" element={<PlaceholderPage title="Quality Settings" />} />
  <Route path="teams" element={<PlaceholderPage title="Quality Teams" />} />
</Route>
```

### Step 2.11 — Expand `plm` route with all sub-pages

**Replace the existing plm route block:**
```jsx
<Route path="plm" element={<ModuleLayout title="PLM" sections={productMenu.plm} accentColor="blue" />}>
  <Route index element={<PlmDashboard />} />
  <Route path="engineeringchangeorders" element={<EngineeringChangeOrderList />} />
  <Route path="engineeringchangeorders/new" element={<EngineeringChangeOrderForm />} />
  <Route path="engineeringchangeorders/:id" element={<EngineeringChangeOrderForm />} />
  <Route path="ecos" element={<EngineeringChangeOrderList />} />
  <Route path="settings" element={<PlaceholderPage title="PLM Settings" />} />
  <Route path="eco-types" element={<PlaceholderPage title="ECO Types" subtitle="Configure engineering change order types." />} />
</Route>
```

### Step 2.12 — Expand `rental` route with all sub-pages

**Replace the existing rental route block:**
```jsx
<Route path="rental" element={<ModuleLayout title="Rental" sections={productMenu.rental} accentColor="blue" />}>
  <Route index element={<RentalDashboard />} />
  <Route path="rentalorders" element={<RentalOrderList />} />
  <Route path="rentalorders/new" element={<RentalOrderForm />} />
  <Route path="rentalorders/:id" element={<RentalOrderForm />} />
  <Route path="schedule" element={<PlaceholderPage title="Rental Schedule" subtitle="View product availability calendar." />} />
  <Route path="customers" element={<PlaceholderPage title="Rental Customers" />} />
  <Route path="products" element={<PlaceholderPage title="Rental Products" subtitle="Manage rentable product catalog." />} />
  <Route path="product-variants" element={<PlaceholderPage title="Product Variants" />} />
  <Route path="reports" element={<PlaceholderPage title="Rental Reports" />} />
  <Route path="settings" element={<PlaceholderPage title="Rental Settings" />} />
  <Route path="delays" element={<PlaceholderPage title="Rental Delays" subtitle="Configure delay fees and rules." />} />
</Route>
```

### Step 2.13 — Expand `discuss` route with sub-pages

**Replace the existing discuss route block:**
```jsx
<Route path="discuss" element={<ModuleLayout title="Discuss" sections={productMenu.discuss} accentColor="purple" />}>
  <Route index element={<DiscussDashboard />} />
  <Route path="channels" element={<PlaceholderPage title="Channels" subtitle="Browse and join team channels." />} />
  <Route path="dm" element={<PlaceholderPage title="Direct Messages" subtitle="Private conversations with teammates." />} />
</Route>
```

### Step 2.14 — Expand `blog` route with missing sub-pages

**Replace the existing blog route block:**
```jsx
<Route path="blog" element={<ModuleLayout title="Blog Manager" items={[{ label: 'All Posts', icon: BookOpen, path: '/admin/blog' }, { label: 'New Post', icon: PlusCircle, path: '/admin/blog/new' }]} accentColor="sky" />}>
  <Route index element={<BlogPostList />} />
  <Route path="new" element={<BlogPostEditor />} />
  <Route path=":id/edit" element={<BlogPostEditor />} />
  <Route path="tags" element={<PlaceholderPage title="Blog Tags" subtitle="Manage content tags and categories." />} />
  <Route path="settings" element={<PlaceholderPage title="Blog Settings" />} />
</Route>
```

### Step 2.15 — Expand `portal` route with missing sub-page

**Replace the existing portal route block:**
```jsx
<Route path="portal" element={<ModuleLayout title="Client Portal" items={[{ label: 'Overview', icon: LayoutDashboard, path: '/admin/portal' }]} accentColor="indigo" />}>
  <Route index element={<PortalDashboard />} />
  <Route path=":clientId" element={<PortalClientView />} />
  <Route path="forum" element={<PlaceholderPage title="Portal Forum" subtitle="Community discussion forum for clients." />} />
</Route>
```

### Step 2.16 — Expand all remaining stub routes

Add child routes to all these modules:
```jsx
{/* After existing invoicing route */}
<Route path="invoicing" element={<ModuleLayout title="Invoicing" sections={productMenu.invoicing} accentColor="blue" />}>
  <Route index element={<InvoicingDashboard />} />
  <Route path="invoices" element={<PlaceholderPage title="Invoices" />} />
  <Route path="credit-notes" element={<PlaceholderPage title="Credit Notes" />} />
  <Route path="payments" element={<PlaceholderPage title="Payments" />} />
  <Route path="customers" element={<PlaceholderPage title="Customers" />} />
  <Route path="reports" element={<PlaceholderPage title="Invoice Analysis" />} />
  <Route path="settings" element={<PlaceholderPage title="Invoicing Settings" />} />
  <Route path="payment-providers" element={<PlaceholderPage title="Payment Providers" />} />
</Route>

<Route path="expenses" element={<ModuleLayout title="Expenses" sections={productMenu.expenses} accentColor="amber" />}>
  <Route index element={<ExpensesDashboard />} />
  <Route path="my-reports" element={<PlaceholderPage title="My Expense Reports" />} />
  <Route path="reports" element={<PlaceholderPage title="All Expense Reports" />} />
  <Route path="approvals" element={<PlaceholderPage title="Expense Approvals" />} />
  <Route path="analysis" element={<PlaceholderPage title="Expenses Analysis" />} />
  <Route path="settings" element={<PlaceholderPage title="Expenses Settings" />} />
  <Route path="categories" element={<PlaceholderPage title="Expense Categories" />} />
</Route>

<Route path="appraisals" element={<ModuleLayout title="Appraisals" sections={productMenu.appraisals} accentColor="amber" />}>
  <Route index element={<AppraisalsDashboard />} />
  <Route path="list" element={<PlaceholderPage title="All Appraisals" />} />
  <Route path="reports" element={<PlaceholderPage title="Appraisal Analytics" />} />
  <Route path="settings" element={<PlaceholderPage title="Appraisal Settings" />} />
  <Route path="templates" element={<PlaceholderPage title="Evaluation Templates" />} />
</Route>

<Route path="referrals" element={<ModuleLayout title="Referrals" sections={productMenu.referrals} accentColor="sky" />}>
  <Route index element={<ReferralsDashboard />} />
  <Route path="ongoing" element={<PlaceholderPage title="Ongoing Referrals" />} />
  <Route path="reports" element={<PlaceholderPage title="Referral Analytics" />} />
  <Route path="settings" element={<PlaceholderPage title="Referrals Settings" />} />
  <Route path="rewards" element={<PlaceholderPage title="Referral Rewards" />} />
</Route>

<Route path="social" element={<ModuleLayout title="Social Marketing" sections={productMenu.social} accentColor="sky" />}>
  <Route index element={<SocialDashboard />} />
  <Route path="posts" element={<PlaceholderPage title="Social Posts" />} />
  <Route path="campaigns" element={<PlaceholderPage title="Social Campaigns" />} />
  <Route path="settings" element={<PlaceholderPage title="Social Settings" />} />
  <Route path="accounts" element={<PlaceholderPage title="Social Accounts" />} />
</Route>

<Route path="sms" element={<ModuleLayout title="SMS Marketing" sections={productMenu.sms} accentColor="teal" />}>
  <Route index element={<SmsDashboard />} />
  <Route path="mailings" element={<PlaceholderPage title="SMS Mailings" />} />
  <Route path="contacts" element={<PlaceholderPage title="SMS Contacts" />} />
  <Route path="reports" element={<PlaceholderPage title="SMS Analytics" />} />
  <Route path="settings" element={<PlaceholderPage title="SMS Settings" />} />
</Route>

<Route path="events" element={<ModuleLayout title="Events" sections={productMenu.events} accentColor="purple" />}>
  <Route index element={<EventsDashboard />} />
  <Route path="attendees" element={<PlaceholderPage title="Event Attendees" />} />
  <Route path="tracks" element={<PlaceholderPage title="Event Tracks" />} />
  <Route path="reports" element={<PlaceholderPage title="Event Analytics" />} />
  <Route path="settings" element={<PlaceholderPage title="Event Settings" />} />
  <Route path="templates" element={<PlaceholderPage title="Event Templates" />} />
</Route>

<Route path="surveys" element={<ModuleLayout title="Surveys" sections={productMenu.surveys} accentColor="emerald" />}>
  <Route index element={<SurveysDashboard />} />
  <Route path="participations" element={<PlaceholderPage title="Survey Participations" />} />
  <Route path="settings" element={<PlaceholderPage title="Survey Settings" />} />
</Route>

<Route path="elearning" element={<ModuleLayout title="eLearning" sections={productMenu.elearning} accentColor="indigo" />}>
  <Route index element={<ElearningDashboard />} />
  <Route path="courses" element={<PlaceholderPage title="Courses" />} />
  <Route path="contents" element={<PlaceholderPage title="Course Contents" />} />
  <Route path="certifications" element={<PlaceholderPage title="Certifications" />} />
  <Route path="reports" element={<PlaceholderPage title="eLearning Analytics" />} />
  <Route path="settings" element={<PlaceholderPage title="eLearning Settings" />} />
</Route>

<Route path="livechat" element={<ModuleLayout title="Live Chat" sections={productMenu.livechat} accentColor="rose" />}>
  <Route index element={<LiveChatDashboard />} />
  <Route path="visitors" element={<PlaceholderPage title="Visitors" />} />
  <Route path="settings" element={<PlaceholderPage title="Live Chat Settings" />} />
  <Route path="channels" element={<PlaceholderPage title="Live Chat Channels" />} />
</Route>

<Route path="knowledge" element={<ModuleLayout title="Knowledge" sections={productMenu.knowledge} accentColor="emerald" />}>
  <Route index element={<KnowledgeDashboard />} />
  <Route path="workspaces" element={<PlaceholderPage title="Knowledge Workspaces" />} />
  <Route path="settings" element={<PlaceholderPage title="Knowledge Settings" />} />
  <Route path="tags" element={<PlaceholderPage title="Knowledge Tags" />} />
</Route>

<Route path="whatsapp" element={<ModuleLayout title="WhatsApp" sections={productMenu.whatsapp} accentColor="emerald" />}>
  <Route index element={<WhatsAppDashboard />} />
  <Route path="templates" element={<PlaceholderPage title="WhatsApp Templates" />} />
  <Route path="settings" element={<PlaceholderPage title="WhatsApp Settings" />} />
  <Route path="accounts" element={<PlaceholderPage title="WhatsApp Accounts" />} />
</Route>

<Route path="spreadsheet" element={<ModuleLayout title="Spreadsheet" sections={productMenu.spreadsheet} accentColor="emerald" />}>
  <Route index element={<SpreadsheetDashboard />} />
  <Route path="documents" element={<PlaceholderPage title="Spreadsheet Documents" />} />
  <Route path="settings" element={<PlaceholderPage title="Spreadsheet Settings" />} />
</Route>

<Route path="field-service" element={<ModuleLayout title="Field Service" sections={productMenu.field_service} accentColor="emerald" />}>
  <Route index element={<FieldServiceDashboard />} />
  <Route path="my-tasks/map" element={<PlaceholderPage title="My Tasks — Map" />} />
  <Route path="my-tasks/schedule" element={<PlaceholderPage title="My Tasks — Schedule" />} />
  <Route path="all-tasks/map" element={<PlaceholderPage title="All Tasks — Map" />} />
  <Route path="all-tasks/schedule" element={<PlaceholderPage title="All Tasks — Schedule" />} />
  <Route path="reports" element={<PlaceholderPage title="Field Service Reports" />} />
  <Route path="settings" element={<PlaceholderPage title="Field Service Settings" />} />
  <Route path="stages" element={<PlaceholderPage title="Task Stages" />} />
  <Route path="tags" element={<PlaceholderPage title="Field Service Tags" />} />
</Route>

<Route path="appointments" element={<ModuleLayout title="Appointments" sections={productMenu.appointments} accentColor="rose" />}>
  <Route index element={<AppointmentsDashboard />} />
  <Route path="online" element={<PlaceholderPage title="Online Appointments" />} />
  <Route path="reports" element={<PlaceholderPage title="Appointments Analysis" />} />
  <Route path="settings" element={<PlaceholderPage title="Appointments Settings" />} />
  <Route path="types" element={<PlaceholderPage title="Appointment Types" />} />
</Route>
```

### Step 2.17 — Expand `payroll` route with all sub-pages

**Replace the existing payroll route block:**
```jsx
<Route path="payroll" element={<ModuleLayout title="Payroll" sections={productMenu.payroll} accentColor="rose" />}>
  <Route index element={<PayrollDashboard />} />
  <Route path="payslips" element={<PayslipList />} />
  <Route path="payslips/new" element={<PayslipForm />} />
  <Route path="payslips/:id" element={<PayslipForm />} />
  <Route path="contracts" element={<PlaceholderPage title="Payroll Contracts" subtitle="Employee salary contracts and terms." />} />
  <Route path="settings" element={<PlaceholderPage title="Payroll Settings" />} />
  <Route path="rules" element={<PlaceholderPage title="Salary Rules" subtitle="Configure salary computation rules." />} />
</Route>
```

---

# PHASE 3 — Fix adminSections Dead Links in menu.js

**File to edit:** `frontend/src/core/api/menu.js`

### Step 3.1 — Fix the "Services" section (broken links)

**Find and replace the Services section in `adminSections`:**
```js
// BEFORE (broken):
{
  title: 'Services',
  items: [
    { label: 'Project', icon: FolderKanban, path: '/admin/projects' },
    { label: 'Timesheets', icon: Clock, path: '/admin/timesheets' },
    { label: 'Helpdesk', icon: LifeBuoy, path: '/admin/helpdesk' },
    { label: 'IT Service Desk (Field Service)', icon: LifeBuoy, path: '/admin/helpdesk' },   // ← DUPLICATE & WRONG
    { label: 'Service Catalog (Appointments)', icon: Tag, path: '/admin/services/catalog' },  // ← WRONG PATH
    { label: 'Change Management (Planning)', icon: GitBranch, path: '/admin/services' },       // ← WRONG PATH
  ]
},

// AFTER (fixed):
{
  title: 'Services',
  items: [
    { label: 'Project', icon: FolderKanban, path: '/admin/projects', permissions: ['view_internalproject'] },
    { label: 'Timesheets', icon: Clock, path: '/admin/timesheets', permissions: ['view_internalproject'] },
    { label: 'Helpdesk', icon: LifeBuoy, path: '/admin/helpdesk', permissions: ['view_ticket'] },
    { label: 'Field Service', icon: MapPin, path: '/admin/field-service', permissions: [] },
    { label: 'Appointments', icon: Calendar, path: '/admin/appointments', permissions: [] },
    { label: 'Planning', icon: GitBranch, path: '/admin/planning', permissions: [] },
  ]
},
```

### Step 3.2 — Fix the "Analytics" sub-menu (bad path)

**In `productMenu.analytics`, find:**
```js
{ label: 'Overview', icon: PieChart, path: '/admin/analytics/executive-summary' },
```
**Change to:**
```js
{ label: 'Overview', icon: PieChart, path: '/admin/analytics' },
```
(No `/executive-summary` route exists — should redirect to analytics index)

### Step 3.3 — Fix "System" sub-menu (bad path)

**In `productMenu.system` or `adminSections` Administration, find:**
```js
{ label: 'Apps', icon: Grid, path: '/admin/system/apps' },
```
**Change to:**
```js
{ label: 'Apps & Modules', icon: Grid, path: '/admin/system' },
```
(No `/system/apps` route exists in sysadminRoutes)

### Step 3.4 — Fix PLM sub-menu (wrong path for ECOs)

**In `productMenu.plm`, find:**
```js
{ label: 'Engineering Change Orders', icon: Activity, path: '/admin/plm/ecos' },
```
This is fine — Phase 2.11 adds a `/plm/ecos` alias route pointing to `EngineeringChangeOrderList`. ✅ **No change needed here.**

### Step 3.5 — Remove duplicate "IT Service Desk" menu item from main sidebar

Already handled in Step 3.1 above.

---

# PHASE 4 — Backend ViewSets: Add Tenant Filtering, Pagination & Soft-Delete

**These backend apps have ViewSets using static `queryset = Model.objects.all()` with NO tenant filter.**

### Step 4.1 — Fix `fleet` ViewSets

**File:** `backend/apps/fleet/api/views.py`

Replace ALL static querysets and add pagination + filters:
```python
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from apps.fleet.domain.models import Vehicle, VehicleLog, VehicleContract
from .serializers import VehicleSerializer, VehicleLogSerializer, VehicleContractSerializer

class StandardPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 200

class VehicleViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'license_plate', 'state']
    ordering_fields = ['name', 'acquisition_date', 'state']
    filterset_fields = ['state']

    def get_queryset(self):
        return Vehicle.objects.filter(
            tenant=self.request.user.tenant,
            is_deleted=False
        ).select_related('driver')

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, created_by=self.request.user)

    # Keep existing add_maintenance and add_fuel actions unchanged

class VehicleLogViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination

    def get_queryset(self):
        return VehicleLog.objects.filter(
            tenant=self.request.user.tenant,
            is_deleted=False
        ).select_related('vehicle')

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)

class VehicleContractViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleContractSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination

    def get_queryset(self):
        return VehicleContract.objects.filter(
            tenant=self.request.user.tenant,
            is_deleted=False
        ).select_related('vehicle')

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)
```

### Step 4.2 — Fix `mrp` ViewSets

**File:** `backend/apps/mrp/api/views.py`

```python
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from apps.mrp.domain.models import WorkCenter, BillOfMaterial, ManufacturingOrder
from .serializers import WorkCenterSerializer, BillOfMaterialSerializer, ManufacturingOrderSerializer

class StandardPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 200

class WorkCenterViewSet(viewsets.ModelViewSet):
    serializer_class = WorkCenterSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'code']

    def get_queryset(self):
        return WorkCenter.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        )

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, created_by=self.request.user)

class BillOfMaterialViewSet(viewsets.ModelViewSet):
    serializer_class = BillOfMaterialSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination

    def get_queryset(self):
        return BillOfMaterial.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        )

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, created_by=self.request.user)

class ManufacturingOrderViewSet(viewsets.ModelViewSet):
    serializer_class = ManufacturingOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['date_planned_start', 'state']
    filterset_fields = ['state']

    def get_queryset(self):
        return ManufacturingOrder.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        ).select_related('bom')

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, created_by=self.request.user)

    # Keep existing plan, start, mark_done actions unchanged
```

### Step 4.3 — Fix `pos` ViewSets

**File:** `backend/apps/pos/api/views.py`

```python
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from apps.pos.domain.models import PosConfig, PosSession, PosOrder, PosPayment
from .serializers import PosConfigSerializer, PosSessionSerializer, PosOrderSerializer, PosPaymentSerializer

class StandardPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 200

class PosConfigViewSet(viewsets.ModelViewSet):
    serializer_class = PosConfigSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PosConfig.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        )

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, created_by=self.request.user)

class PosSessionViewSet(viewsets.ModelViewSet):
    serializer_class = PosSessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = ['start_at', 'state']
    filterset_fields = ['state']

    def get_queryset(self):
        return PosSession.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        ).select_related('config', 'user')

    def perform_create(self, serializer):
        serializer.save(
            tenant=self.request.user.tenant,
            user=self.request.user,
            created_by=self.request.user
        )

    # Keep existing open and close actions unchanged

class PosOrderViewSet(viewsets.ModelViewSet):
    serializer_class = PosOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['state']

    def get_queryset(self):
        return PosOrder.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        ).select_related('session')

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, created_by=self.request.user)

class PosPaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PosPaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PosPayment.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        )

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, created_by=self.request.user)
```

### Step 4.4 — Fix `quality` ViewSets

**File:** `backend/apps/quality/api/views.py`

```python
from rest_framework import viewsets, permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from apps.quality.domain.models import QualityAlert
from .serializers import QualityAlertSerializer

class StandardPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 200

class QualityAlertViewSet(viewsets.ModelViewSet):
    serializer_class = QualityAlertSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['priority', 'state']
    filterset_fields = ['state', 'priority']

    def get_queryset(self):
        return QualityAlert.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        ).select_related('user')

    def perform_create(self, serializer):
        serializer.save(
            tenant=self.request.user.tenant,
            user=self.request.user,
            created_by=self.request.user
        )
```

### Step 4.5 — Fix `plm` ViewSets

**File:** `backend/apps/plm/api/views.py`

```python
from rest_framework import viewsets, permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from apps.plm.domain.models import EngineeringChangeOrder
from .serializers import EngineeringChangeOrderSerializer

class StandardPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 200

class EngineeringChangeOrderViewSet(viewsets.ModelViewSet):
    serializer_class = EngineeringChangeOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'note']
    ordering_fields = ['state']
    filterset_fields = ['state']

    def get_queryset(self):
        return EngineeringChangeOrder.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        ).select_related('responsible')

    def perform_create(self, serializer):
        serializer.save(
            tenant=self.request.user.tenant,
            responsible=self.request.user,
            created_by=self.request.user
        )
```

### Step 4.6 — Fix `rental` ViewSets

**File:** `backend/apps/rental/api/views.py`

```python
from rest_framework import viewsets, permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from apps.rental.domain.models import RentalOrder, RentalOrderLine
from .serializers import RentalOrderSerializer, RentalOrderLineSerializer

class StandardPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 200

class RentalOrderViewSet(viewsets.ModelViewSet):
    serializer_class = RentalOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['date_order', 'state', 'amount_total']
    filterset_fields = ['state']

    def get_queryset(self):
        return RentalOrder.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        ).prefetch_related('lines')

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, created_by=self.request.user)

class RentalOrderLineViewSet(viewsets.ModelViewSet):
    serializer_class = RentalOrderLineSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RentalOrderLine.objects.filter(
            tenant=self.request.user.tenant, is_deleted=False
        ).select_related('order')

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant, created_by=self.request.user)
```

### Step 4.7 — Fix `discuss` ViewSets

**File:** `backend/apps/discuss/api/views.py`

```python
from rest_framework import viewsets, permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from apps.discuss.domain.models import Channel, Message
from .serializers import ChannelSerializer, MessageSerializer

class StandardPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 200

class ChannelViewSet(viewsets.ModelViewSet):
    serializer_class = ChannelSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name']

    def get_queryset(self):
        return Channel.objects.filter(
            tenant=self.request.user.tenant,
            is_deleted=False
        ).prefetch_related('members')

    def perform_create(self, serializer):
        channel = serializer.save(
            tenant=self.request.user.tenant,
            created_by=self.request.user
        )
        channel.members.add(self.request.user)

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['channel']
    ordering_fields = ['created_at']

    def get_queryset(self):
        return Message.objects.filter(
            tenant=self.request.user.tenant,
            is_deleted=False
        ).select_related('author', 'channel').order_by('created_at')

    def perform_create(self, serializer):
        serializer.save(
            tenant=self.request.user.tenant,
            author=self.request.user,
            created_by=self.request.user
        )
```

---

# PHASE 5 — Backend: Add Missing Serializer Fields & Improve Quality/PLM

### Step 5.1 — Add `QualityCheck` and `QualityPoint` models to quality app

**File:** `backend/apps/quality/domain/models.py`

Add after `QualityAlert`:
```python
class QualityPoint(TenantAwareModel):
    """Quality control point — a checkpoint in the production flow."""
    title = models.CharField(max_length=200)
    operation = models.CharField(
        max_length=50,
        choices=[('incoming', 'Incoming'), ('outgoing', 'Outgoing'), ('manufacturing', 'Manufacturing')],
        default='incoming'
    )
    team = models.CharField(max_length=100, blank=True)
    active = models.BooleanField(default=True)

    class Meta:
        app_label = 'quality'

class QualityCheck(TenantAwareModel):
    """An actual quality check instance."""
    point = models.ForeignKey(QualityPoint, on_delete=models.CASCADE, related_name='checks')
    lot_name = models.CharField(max_length=50, blank=True)
    result = models.CharField(
        max_length=20,
        choices=[('none', 'To Do'), ('pass', 'Pass'), ('fail', 'Fail')],
        default='none'
    )
    note = models.TextField(blank=True)

    class Meta:
        app_label = 'quality'
```

**File:** `backend/apps/quality/api/serializers.py` — Add serializers for these new models.

**File:** `backend/apps/quality/api/views.py` — Add `QualityPointViewSet`, `QualityCheckViewSet`.

**File:** `backend/apps/quality/api/urls.py` — Register the new ViewSets:
```python
router.register(r'qualitypoints', QualityPointViewSet)
router.register(r'qualitychecks', QualityCheckViewSet)
```

### Step 5.2 — Add `ECOType` model to plm app

**File:** `backend/apps/plm/domain/models.py`

Add before `EngineeringChangeOrder`:
```python
class ECOType(TenantAwareModel):
    """Type classification for Engineering Change Orders."""
    name = models.CharField(max_length=100)
    sequence = models.IntegerField(default=10)
    active = models.BooleanField(default=True)

    class Meta:
        app_label = 'plm'
```

Update `EngineeringChangeOrder` to use a real FK:
```python
eco_type = models.ForeignKey(
    ECOType,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='ecos'
)
```
Remove the old `type_id = models.IntegerField(...)` field.

**File:** `backend/apps/plm/api/serializers.py` — Add `ECOTypeSerializer`.

**File:** `backend/apps/plm/api/views.py` — Add `ECOTypeViewSet`.

**File:** `backend/apps/plm/api/urls.py` — Register:
```python
router.register(r'ecotypes', ECOTypeViewSet)
```

### Step 5.3 — Run makemigrations for quality and plm

```bash
cd backend
source venv/bin/activate
python manage.py makemigrations quality plm
python manage.py migrate
```

---

# PHASE 6 — Payroll Frontend: Connect to Real API

### Step 6.1 — Update `payrollService.js` to add missing methods

**File:** `frontend/src/core/api/payrollService.js`

```js
import apiClient from './client';

const payrollService = {
  // Payslips
  getPayslips: (params) => apiClient.get('/hrm/payslips/', { params }).then(r => r.data),
  getPayslip: (id) => apiClient.get(`/hrm/payslips/${id}/`).then(r => r.data),
  createPayslip: (data) => apiClient.post('/hrm/payslips/', data).then(r => r.data),
  updatePayslip: (id, data) => apiClient.put(`/hrm/payslips/${id}/`, data).then(r => r.data),
  deletePayslip: (id) => apiClient.delete(`/hrm/payslips/${id}/`),

  // Payroll Periods  
  getPayrollPeriods: (params) => apiClient.get('/hrm/payroll-periods/', { params }).then(r => r.data),
  getPayrollPeriod: (id) => apiClient.get(`/hrm/payroll-periods/${id}/`).then(r => r.data),
  createPayrollPeriod: (data) => apiClient.post('/hrm/payroll-periods/', data).then(r => r.data),
  processPayrollPeriod: (id) => apiClient.post(`/hrm/payroll-periods/${id}/process/`).then(r => r.data),
  generatePayslips: (id) => apiClient.post(`/hrm/payroll-periods/${id}/generate_payslips/`).then(r => r.data),

  // Salary components
  getSalaryComponents: () => apiClient.get('/hrm/salary-components/').then(r => r.data),
};

export default payrollService;
```

### Step 6.2 — Wire `PayrollDashboard.jsx` to real API

**File:** `frontend/src/apps/payroll/pages/dashboards/PayrollDashboard.jsx`

Replace mock data with:
```jsx
import React, { useState, useEffect } from 'react';
import payrollService from '../../../../core/api/payrollService';
import { toast } from 'react-hot-toast';

const PayrollDashboard = () => {
  const [periods, setPeriods] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [periodsData, payslipsData] = await Promise.all([
          payrollService.getPayrollPeriods(),
          payrollService.getPayslips({ page_size: 10 }),
        ]);
        setPeriods(periodsData.results || periodsData);
        setPayslips(payslipsData.results || payslipsData);
      } catch (err) {
        toast.error('Failed to load payroll data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ... render component with real data
};
```

---

# PHASE 7 — Frontend Service: Add Missing Action Methods

### Step 7.1 — Add action methods to `posService.js`

**File:** `frontend/src/core/api/posService.js`

```js
import apiClient from './client';

const posService = {
  getSessions: (params) => apiClient.get('/pos/possessions/', { params }).then(r => r.data),
  getSession: (id) => apiClient.get(`/pos/possessions/${id}/`).then(r => r.data),
  createSession: (data) => apiClient.post('/pos/possessions/', data).then(r => r.data),
  updateSession: (id, data) => apiClient.put(`/pos/possessions/${id}/`, data).then(r => r.data),
  deleteSession: (id) => apiClient.delete(`/pos/possessions/${id}/`),
  openSession: (id) => apiClient.post(`/pos/possessions/${id}/open/`).then(r => r.data),
  closeSession: (id) => apiClient.post(`/pos/possessions/${id}/close/`).then(r => r.data),
  getOrders: (params) => apiClient.get('/pos/posorders/', { params }).then(r => r.data),
  getPayments: (params) => apiClient.get('/pos/pospayments/', { params }).then(r => r.data),
  getConfigs: () => apiClient.get('/pos/posconfigs/').then(r => r.data),
};

export default posService;
```

### Step 7.2 — Add action methods to `mrpService.js`

**File:** `frontend/src/core/api/mrpService.js`

```js
import apiClient from './client';

const mrpService = {
  getOrders: (params) => apiClient.get('/mrp/manufacturingorders/', { params }).then(r => r.data),
  getOrder: (id) => apiClient.get(`/mrp/manufacturingorders/${id}/`).then(r => r.data),
  createOrder: (data) => apiClient.post('/mrp/manufacturingorders/', data).then(r => r.data),
  updateOrder: (id, data) => apiClient.put(`/mrp/manufacturingorders/${id}/`, data).then(r => r.data),
  planOrder: (id) => apiClient.post(`/mrp/manufacturingorders/${id}/plan/`).then(r => r.data),
  startOrder: (id) => apiClient.post(`/mrp/manufacturingorders/${id}/start/`).then(r => r.data),
  markDone: (id) => apiClient.post(`/mrp/manufacturingorders/${id}/mark_done/`).then(r => r.data),
  getBOMs: (params) => apiClient.get('/mrp/billofmaterials/', { params }).then(r => r.data),
  getWorkCenters: () => apiClient.get('/mrp/workcenters/').then(r => r.data),
};

export default mrpService;
```

### Step 7.3 — Add action methods to `fleetService.js`

**File:** `frontend/src/core/api/fleetService.js`

```js
import apiClient from './client';

const fleetService = {
  getVehicles: (params) => apiClient.get('/fleet/vehicles/', { params }).then(r => r.data),
  getVehicle: (id) => apiClient.get(`/fleet/vehicles/${id}/`).then(r => r.data),
  createVehicle: (data) => apiClient.post('/fleet/vehicles/', data).then(r => r.data),
  updateVehicle: (id, data) => apiClient.put(`/fleet/vehicles/${id}/`, data).then(r => r.data),
  deleteVehicle: (id) => apiClient.delete(`/fleet/vehicles/${id}/`),
  addMaintenance: (id, data) => apiClient.post(`/fleet/vehicles/${id}/add_maintenance/`, data).then(r => r.data),
  addFuel: (id, data) => apiClient.post(`/fleet/vehicles/${id}/add_fuel/`, data).then(r => r.data),
  getLogs: (params) => apiClient.get('/fleet/vehiclelogs/', { params }).then(r => r.data),
  getContracts: (params) => apiClient.get('/fleet/vehiclecontracts/', { params }).then(r => r.data),
};

export default fleetService;
```

### Step 7.4 — Add action methods to `rentalService.js`

**File:** `frontend/src/core/api/rentalService.js`

```js
import apiClient from './client';

const rentalService = {
  getOrders: (params) => apiClient.get('/rental/rentalorders/', { params }).then(r => r.data),
  getOrder: (id) => apiClient.get(`/rental/rentalorders/${id}/`).then(r => r.data),
  createOrder: (data) => apiClient.post('/rental/rentalorders/', data).then(r => r.data),
  updateOrder: (id, data) => apiClient.put(`/rental/rentalorders/${id}/`, data).then(r => r.data),
  deleteOrder: (id) => apiClient.delete(`/rental/rentalorders/${id}/`),
  getOrderLines: (params) => apiClient.get('/rental/rentalorderlines/', { params }).then(r => r.data),
  createOrderLine: (data) => apiClient.post('/rental/rentalorderlines/', data).then(r => r.data),
};

export default rentalService;
```

### Step 7.5 — Add action methods to `qualityService.js`

**File:** `frontend/src/core/api/qualityService.js`

```js
import apiClient from './client';

const qualityService = {
  getAlerts: (params) => apiClient.get('/quality/qualityalerts/', { params }).then(r => r.data),
  getAlert: (id) => apiClient.get(`/quality/qualityalerts/${id}/`).then(r => r.data),
  createAlert: (data) => apiClient.post('/quality/qualityalerts/', data).then(r => r.data),
  updateAlert: (id, data) => apiClient.put(`/quality/qualityalerts/${id}/`, data).then(r => r.data),
  deleteAlert: (id) => apiClient.delete(`/quality/qualityalerts/${id}/`),
  getPoints: (params) => apiClient.get('/quality/qualitypoints/', { params }).then(r => r.data),
  getChecks: (params) => apiClient.get('/quality/qualitychecks/', { params }).then(r => r.data),
};

export default qualityService;
```

### Step 7.6 — Add action methods to `plmService.js`

**File:** `frontend/src/core/api/plmService.js`

```js
import apiClient from './client';

const plmService = {
  getECOs: (params) => apiClient.get('/plm/engineeringchangeorders/', { params }).then(r => r.data),
  getECO: (id) => apiClient.get(`/plm/engineeringchangeorders/${id}/`).then(r => r.data),
  createECO: (data) => apiClient.post('/plm/engineeringchangeorders/', data).then(r => r.data),
  updateECO: (id, data) => apiClient.put(`/plm/engineeringchangeorders/${id}/`, data).then(r => r.data),
  deleteECO: (id) => apiClient.delete(`/plm/engineeringchangeorders/${id}/`),
  getECOTypes: () => apiClient.get('/plm/ecotypes/').then(r => r.data),
};

export default plmService;
```

---

# PHASE 8 — Backend URL Naming Cleanup (REST API Consistency)

**Problem:** Several backend URL slugs don't match Odoo/REST conventions. This affects frontend discoverability.

| Current URL | Should Be | Fix Required |
|---|---|---|
| `/pos/possessions/` | `/pos/sessions/` | Rename router in `pos/api/urls.py` |
| `/pos/posorders/` | `/pos/orders/` | Rename router |
| `/pos/pospayments/` | `/pos/payments/` | Rename router |
| `/pos/posconfigs/` | `/pos/configs/` | Rename router |
| `/mrp/manufacturingorders/` | `/mrp/orders/` | Rename router |
| `/mrp/billofmaterials/` | `/mrp/boms/` | Rename router |
| `/mrp/workcenters/` | `/mrp/work-centers/` | Rename router |
| `/fleet/vehiclelogs/` | `/fleet/logs/` | Rename router |
| `/fleet/vehiclecontracts/` | `/fleet/contracts/` | Rename router |
| `/rental/rentalorders/` | `/rental/orders/` | Rename router |
| `/rental/rentalorderlines/` | `/rental/order-lines/` | Rename router |
| `/quality/qualityalerts/` | `/quality/alerts/` | Rename router |
| `/plm/engineeringchangeorders/` | `/plm/ecos/` | Rename router |

### Step 8.1 — Update POS urls.py

**File:** `backend/apps/pos/api/urls.py`
```python
router.register(r'sessions', PosSessionViewSet, basename='pos-session')
router.register(r'orders', PosOrderViewSet, basename='pos-order')
router.register(r'payments', PosPaymentViewSet, basename='pos-payment')
router.register(r'configs', PosConfigViewSet, basename='pos-config')
```

### Step 8.2 — Update MRP urls.py

**File:** `backend/apps/mrp/api/urls.py`
```python
router.register(r'orders', ManufacturingOrderViewSet, basename='mrp-order')
router.register(r'boms', BillOfMaterialViewSet, basename='mrp-bom')
router.register(r'work-centers', WorkCenterViewSet, basename='mrp-workcenter')
```

### Step 8.3 — Update Fleet urls.py

**File:** `backend/apps/fleet/api/urls.py`
```python
router.register(r'vehicles', VehicleViewSet, basename='fleet-vehicle')
router.register(r'logs', VehicleLogViewSet, basename='fleet-log')
router.register(r'contracts', VehicleContractViewSet, basename='fleet-contract')
```

### Step 8.4 — Update Rental urls.py

**File:** `backend/apps/rental/api/urls.py`
```python
router.register(r'orders', RentalOrderViewSet, basename='rental-order')
router.register(r'order-lines', RentalOrderLineViewSet, basename='rental-orderline')
```

### Step 8.5 — Update Quality urls.py

**File:** `backend/apps/quality/api/urls.py`
```python
router.register(r'alerts', QualityAlertViewSet, basename='quality-alert')
router.register(r'points', QualityPointViewSet, basename='quality-point')
router.register(r'checks', QualityCheckViewSet, basename='quality-check')
```

### Step 8.6 — Update PLM urls.py

**File:** `backend/apps/plm/api/urls.py`
```python
router.register(r'ecos', EngineeringChangeOrderViewSet, basename='plm-eco')
router.register(r'eco-types', ECOTypeViewSet, basename='plm-ecotype')
```

### Step 8.7 — Update all frontend service files to use the new clean URLs

After renaming the backend URLs above, update these service files:

**`posService.js`:** Change all `/pos/possessions/` → `/pos/sessions/`, `/pos/posorders/` → `/pos/orders/`, etc.

**`mrpService.js`:** Change `/mrp/manufacturingorders/` → `/mrp/orders/`, `/mrp/billofmaterials/` → `/mrp/boms/`, `/mrp/workcenters/` → `/mrp/work-centers/`

**`fleetService.js`:** Change `/fleet/vehiclelogs/` → `/fleet/logs/`, `/fleet/vehiclecontracts/` → `/fleet/contracts/`

**`rentalService.js`:** Change `/rental/rentalorders/` → `/rental/orders/`, `/rental/rentalorderlines/` → `/rental/order-lines/`

**`qualityService.js`:** Change `/quality/qualityalerts/` → `/quality/alerts/`, add `/quality/points/`, `/quality/checks/`

**`plmService.js`:** Change `/plm/engineeringchangeorders/` → `/plm/ecos/`, add `/plm/eco-types/`

---

# PHASE 9 — Verification Checklist

Run these commands in sequence after completing all phases:

### Step 9.1 — Backend Health Check
```bash
cd backend
source venv/bin/activate
python manage.py check  
# Expected: "System check identified no issues (0 silenced)."

python manage.py makemigrations --check
# Expected: "No changes detected" (or creates migrations for quality/plm new models)

python manage.py migrate
# Expected: All migrations applied
```

### Step 9.2 — Frontend Build Check
```bash
cd frontend
npm run build
# Expected: ✓ built in X.XXs with 0 errors
```

### Step 9.3 — Manual Navigation Walkthrough

Walk through every sidebar section item:

**✅ Check each link resolves (no blank page, no 404):**
- Dashboards: Command Center, Notifications
- Sale: Sale, CRM, Point of Sale, Subscription, Contracts, Rental
- Services: Project, Timesheets, Helpdesk, Field Service, Appointments, Planning
- Accounting: Accounting, Invoicing, Expenses, Spreadsheet
- Inventory & MRP: Inventory, Manufacturing, Purchase, Maintenance, Quality, PLM
- Human Resources: Employees, Recruitment, Time Off, Fleet, Payroll, Appraisals, Referrals
- Marketing: Marketing Automation, Email Marketing, Social, SMS, Events, Surveys
- Website: Website, eCommerce, Blog, eLearning, Client Portal, Live Chat
- Productivity: Discuss, Calendar, Documents, Approvals, Studio, Knowledge, WhatsApp
- Administration: Analytics, SecOps, IAM, Settings

**✅ Check each module's sidebar sub-menu items:**
For each module that has a sub-nav, click every sub-item and verify it renders content (even if just PlaceholderPage).

**✅ Check API connectivity for critical paths:**
- Navigate to `/admin/sales/orders` — should load real orders from backend
- Navigate to `/admin/crm/pipeline` — should load real leads
- Navigate to `/admin/hrm/employees` — should load real employees  
- Navigate to `/admin/fleet/vehicles` — should load real vehicles
- Navigate to `/admin/mrp/orders` — should load real manufacturing orders
- Navigate to `/admin/pos/sessions` — should load real sessions

---

# SUMMARY — Implementation Order

| Phase | Action | Effort | Impact |
|---|---|---|---|
| **1** | Create `PlaceholderPage.jsx` | 10 min | Unblocks all phases |
| **2** | Fix `EnterpriseRouter.jsx` — 17 route groups | 2-3 hours | **Eliminates ALL dead routes** |
| **3** | Fix `menu.js` — 3 bad links | 20 min | Fixes sidebar dead links |
| **4** | Fix 7 backend ViewSets (tenant filter + pagination) | 1-2 hours | API security + pagination |
| **5** | Add `QualityPoint/Check` + `ECOType` models | 1 hour | Completes these modules |
| **6** | Wire `PayrollDashboard` to real API | 30 min | Payroll shows real data |
| **7** | Update 6 service files with action methods | 30 min | Frontend can call actions |
| **8** | Rename backend URL slugs + update services | 1 hour | Clean REST URLs |
| **9** | Run verification checklist | 30 min | Confirms zero issues |

**Total estimated effort: 7-9 hours of implementation work**
