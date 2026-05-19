# ═══════════════════════════════════════════════════════════════════════════════
# BITGUARD ENTERPRISE PLATFORM — COMPLETE PRODUCTION AUDIT & REFACTORING PROMPT
# ═══════════════════════════════════════════════════════════════════════════════
# TARGET: AI Website Builder / Developer
# DATE: April 13, 2026
# SCOPE: Every module, every page, every button, every feature — A–Z
# ═══════════════════════════════════════════════════════════════════════════════

## CRITICAL PLATFORM CONTEXT (READ BEFORE ANY CHANGES)

```
Architecture:    Django REST Framework (backend) + React/Vite (frontend)
Backend Path:    /backend/ — multi-tenant DDD with service-layer pattern
Frontend Path:   /frontend/ — Feature-Sliced Design, Tailwind CSS dark theme
API Client:      Axios at frontend/src/core/api/client.js
                 baseURL = 'http://127.0.0.1:8000/api/' (DO NOT prefix routes with 'api/')
API Envelope:    ALL API responses use { status: "success", data: {...} }
                 Frontend MUST unwrap as response.data.data (or response.data?.data)
JWT Exception:   SimpleJWT token endpoints return FLAT { access, refresh } — NOT data.data
Admin Routes:    ALL frontend admin routes are under /admin/* prefix
                 ALL navigate() calls MUST use /admin/ prefix
Styling:         Tailwind CSS dark theme (slate-950/900 bg, white text, colored accents)
Fonts:           Outfit (headings), Inter (body), Oswald (module titles)
Form Pattern:    Use GenericModal from core/components/shared/forms/GenericModal.jsx
                 for ALL create/edit operations (it handles field rendering, validation, submit)
Delete Pattern:  Use DeleteConfirmationModal from core/components/shared/core/DeleteConfirmationModal.jsx
                 for ALL delete confirmations
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 1: COMMERCE / STORE (/admin/store/*)
# ═══════════════════════════════════════════════════════════════════════════════
# Route file: frontend/src/apps/store/routes/storeRoutes.jsx
# Service:    frontend/src/core/api/storeService.js
# Backend:    backend/apps/store/

## ISSUE 1.1 — ProductManagement.jsx: "Add Product" button is DEAD
- File: frontend/src/apps/store/pages/ProductManagement.jsx (line 28)
- The button `<button>Add Product</button>` has NO onClick handler
- No GenericModal, no create logic, no form
- Also MISSING: Edit button, Delete button for each product row
- FIX: Add GenericModal with fields [name, product_type (select: physical/digital/service),
  price (number), status (select: active/draft), stock_quantity (number), description (textarea)].
  Wire Create/Edit/Delete using storeService.createProduct / updateProduct / deleteProduct.
  Add Edit2 and Trash2 icons per row.

## ISSUE 1.2 — CategoryManagement.jsx: "Add Category" button is DEAD
- File: frontend/src/apps/store/pages/CategoryManagement.jsx (line 23)
- Button has NO onClick handler
- "Edit" and "Delete" buttons in table (line 64-65) are DEAD — no handlers
- FIX: Add GenericModal with fields [name, slug, is_visible (toggle)].
  Wire CRUD using client.post/patch/delete to 'store/categories/'.
  Wire Edit and Delete buttons.

## ISSUE 1.3 — CustomerManagement.jsx: READ-ONLY
- File: frontend/src/apps/store/pages/CustomerManagement.jsx
- No create, edit, or delete functionality
- Search input is cosmetic (not filtering state)
- FIX: Wire the search input onChange to filter customers. Not critical — customers
  are typically auto-created from orders.

## ISSUE 1.4 — ShippingSettings.jsx: "Add Global Zone" button is DEAD
- File: frontend/src/apps/store/pages/ShippingSettings.jsx (line 22-24)
- Button has NO onClick handler
- "Configure Route" button per row (line 58) is DEAD
- FIX: Add GenericModal with fields [zone_name, rate (number)].
  Wire CRUD using client.post/patch/delete to 'store/shipping-settings/'.

## ISSUE 1.5 — LandingPages.jsx: "Create Funnel" button is DEAD
- File: frontend/src/apps/store/pages/LandingPages.jsx (line 22-24)
- "Visual Editor" button per row (line 65) is DEAD
- FIX: Add GenericModal with fields [title, slug, is_published (toggle), content (textarea)].
  Wire CRUD using client.post/patch/delete to 'store/landing-pages/'.

## ISSUE 1.6 — AddOnManagement.jsx: "Link Provider" button is DEAD
- File: frontend/src/apps/store/pages/AddOnManagement.jsx (line 22-24)
- "Configure API Keys" button per row (line 51) is DEAD
- FIX: Add GenericModal with fields [name, provider, is_enabled (toggle), api_key].
  Wire CRUD to 'store/addons/'.

## ISSUE 1.7 — SubscriptionManagement.jsx: READ-ONLY
- File: frontend/src/apps/store/pages/SubscriptionManagement.jsx
- Search input is cosmetic (not wired to state filter)
- No actions — acceptable for subscriptions (managed via billing), but search should work.
- FIX: Wire search input to filter subscriptions by customer name.

## ISSUE 1.8 — StoreCustomization.jsx: API path has LEADING SLASH
- File: frontend/src/apps/store/pages/StoreCustomization.jsx (lines 23-24)
- `client.put('/store/customization/...')` — leading slash bypasses baseURL
- FIX: Remove leading slash → `client.put('store/customization/...')`

## ISSUE 1.9 — PixelTracking.jsx: API path has LEADING SLASH
- File: frontend/src/apps/store/pages/PixelTracking.jsx (lines 23-24)
- Same problem as 1.8 — leading slash issue
- FIX: Remove leading slash → `client.put('store/tracking-configs/...')`

---

# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 2: SALES & CRM (/admin/crm/*)
# ═══════════════════════════════════════════════════════════════════════════════
# Route file: frontend/src/apps/crm/routes/crmRoutes.jsx
# Service:    frontend/src/core/api/crmService.js
# Backend:    backend/apps/crm/

## STATUS: ✅ MOSTLY FUNCTIONAL
- ClientList: Has GenericModal + DeleteConfirmationModal — full CRUD ✓
- ContactList: Has full CRUD with GenericModal ✓
- LeadList: Has full CRUD with GenericModal ✓
- DealsPipeline: Has DealModal for create/edit ✓
- ContractList: Has ContractModal for create/edit ✓
- QuoteList: Has list + detail view ✓
- InteractionList: Has list view ✓
- OrderList: Has list view ✓
- OnboardingWizard: Multi-step wizard functional ✓

## ISSUE 2.1 — InteractionList.jsx: No CREATE button
- File: frontend/src/apps/crm/pages/InteractionList.jsx
- Displays list but has no "Log Interaction" or create functionality
- FIX: Add GenericModal with fields [client (select), interaction_type (select: call/email/
  meeting/note), subject, notes (textarea), date (date)]. Wire to crmService.

## ISSUE 2.2 — OrderList.jsx: READ-ONLY
- File: frontend/src/apps/crm/pages/OrderList.jsx
- No create, no detail view, no status update
- FIX: Add status update dropdown per row. Add view detail link.

---

# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 3: FINANCE & OPERATIONS (ERP) (/admin/erp/*)
# ═══════════════════════════════════════════════════════════════════════════════
# Route file: frontend/src/apps/erp/routes/erpRoutes.jsx
# Service:    frontend/src/core/api/erpService.js
# Backend:    backend/apps/erp/

## STATUS: ✅ MOSTLY FUNCTIONAL
- InvoiceList: Has list view with links ✓
- InvoiceCreate: Full form with line items ✓
- InvoiceDetail: Full detail with download ✓
- ExpenseList: Has full CRUD ✓
- FinancialsDashboard: Shows financial KPIs ✓

## ISSUE 3.1 — ERP has ProjectCreate/ProjectList/ProjectDetail pages in erp/pages/
- These files exist but are NOT in erpRoutes.jsx — they are orphaned
- The Projects module (/admin/projects/) uses its own pages
- FIX: Either remove these orphaned files or add routes if ERP needs project views.
  Recommend: DELETE these orphaned files to avoid confusion:
  - frontend/src/apps/erp/pages/ProjectCreate.jsx
  - frontend/src/apps/erp/pages/ProjectList.jsx
  - frontend/src/apps/erp/pages/ProjectDetail.jsx
  - frontend/src/apps/erp/pages/RiskList.jsx

---

# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 4: PEOPLE & HR (/admin/hrm/*)
# ═══════════════════════════════════════════════════════════════════════════════
# Route file: frontend/src/apps/hrm/routes/hrmRoutes.jsx
# Service:    frontend/src/core/api/hrmService.js
# Backend:    backend/apps/hrm/

## STATUS: ✅ MOSTLY FUNCTIONAL
- EmployeeList: Full CRUD with GenericModal + DeleteConfirmationModal ✓
- LeaveManagement: Approve/Reject actions functional ✓
- TimeTracking: Time entry list functional ✓
- CertificationsPage: Certification tracker functional ✓
- PayrollPage: Shows payroll data from employee list ✓

## ISSUE 4.1 — HRM route has NO 'overview' path
- hrmRoutes.jsx uses `<Route index>` for HrmDashboard but sidebar links to
  /admin/hrm/ which needs 'overview' path
- FIX: The index route handles it, but add `<Route path="overview" element={<HrmDashboard />} />`
  for explicit consistency.

## ISSUE 4.2 — LeaveManagement: No "Request Leave" button for self-service
- Currently only shows admin approve/reject
- FIX: Add a "Request Leave" button with GenericModal for employees to submit
  leave requests with fields [leave_type (select: annual/sick/personal), start_date, end_date, reason (textarea)].

## ISSUE 4.3 — PayrollPage: No "Run Payroll" or "Export" functionality
- Only read-only display of salary data
- FIX: Add "Export Payroll CSV" button. Add "Run Payroll" button that calls
  a backend endpoint to process monthly payroll.

---

# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 5: PROCUREMENT / SCM (/admin/scm/*)
# ═══════════════════════════════════════════════════════════════════════════════
# Route file: frontend/src/apps/scm/routes/scmRoutes.jsx
# Service:    frontend/src/core/api/scmService.js
# Backend:    backend/apps/scm/

## STATUS: ✅ FULLY FUNCTIONAL
- InventoryList: Full CRUD with GenericModal + DeleteConfirmationModal ✓
- VendorList: Full CRUD with GenericModal + DeleteConfirmationModal ✓
- PurchaseOrderList: Create + Receive actions ✓
- ScmDashboard: KPI dashboard ✓
- ScmSettings/ScmReportPage: Working ✓

## ISSUE 5.1 — SCM has NO 'overview' route in scmRoutes.jsx
- Uses `<Route index>` which works but sidebar Overview link goes to /admin/scm
- FIX: Add `<Route path="overview" element={<ScmDashboard />} />` for explicit matching.

---

# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 6: SERVICE DESK / SUPPORT (/admin/support/*)
# ═══════════════════════════════════════════════════════════════════════════════
# Route file: frontend/src/apps/support/routes/supportRoutes.jsx
# Service:    frontend/src/core/api/supportService.js
# Backend:    backend/apps/support/

## STATUS: ✅ FUNCTIONAL
- SupportDashboard: KPI overview ✓
- TicketList: Full list + inline detail modal + KB conversion ✓
- TicketCreate: Full ticket creation form ✓
- SlaBreachLog: SLA breach tracking ✓
- EscalationList: Escalation tracking ✓
- KnowledgeBase: KB articles ✓

## NO CRITICAL ISSUES — Module is production-ready.

---

# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 7: SECURITY OPERATIONS CENTER (/admin/security/*)
# ═══════════════════════════════════════════════════════════════════════════════
# Route file: frontend/src/apps/soc/routes/socRoutes.jsx
# Service:    frontend/src/core/api/securityService.js
# Backend:    backend/apps/soc/

## STATUS: ✅ FUNCTIONAL
- SocDashboard: Security posture KPIs ✓
- AlertsPage: Alert list + detail view ✓
- IncidentsPage: Incident tracking ✓
- VulnerabilitiesPage, IntelPage, LogAnalysisPage: All functional ✓
- CloudSecurity, EmailSecurity, NetworkSecurity: Status displays ✓

## NO CRITICAL ISSUES — Module uses mock/static data which is acceptable for SOC.

---

# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 8: PROJECT MANAGEMENT (/admin/projects/*)
# ═══════════════════════════════════════════════════════════════════════════════
# Route file: frontend/src/apps/projects/routes/projectsRoutes.jsx
# Service:    frontend/src/core/api/projectsService.js
# Backend:    backend/apps/projects/

## STATUS: ⚠️ PARTIALLY FUNCTIONAL

## ISSUE 8.1 — ProjectsDashboard: No "Create Project" button or modal
- File: frontend/src/apps/projects/pages/ProjectsDashboard.jsx
- Has a `<Plus>` icon at line 50 area but it links somewhere — need to verify
  if it actually navigates to a create form
- FIX: Ensure a "New Project" button opens a GenericModal with fields
  [name, description (textarea), status (select: planning/active/on_hold/completed),
  priority (select: low/medium/high/critical), start_date (date), end_date (date),
  budget (number)]. Wire to projectsService.createProject.

## ISSUE 8.2 — KanbanBoard: Task creation may not work
- File: frontend/src/apps/projects/pages/KanbanBoard.jsx
- Verify that drag-and-drop calls projectsService.moveTask correctly
- Verify that "Add Task" creates tasks via projectsService.createTask
- FIX: Ensure full CRUD on tasks within the Kanban board.

## ISSUE 8.3 — No "Team Members" or "Milestones" page
- projectsService has getMilestones, createMilestone, completeMilestone
  but there's no UI page for managing milestones
- FIX: Create a MilestonePage component with milestone list + create modal.
  Add route `<Route path=":id/milestones" element={<MilestonePage />} />` to projectsRoutes.

---

# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 9: IT ASSET MANAGEMENT (/admin/itam/*)
# ═══════════════════════════════════════════════════════════════════════════════
# Route file: Inline in EnterpriseRouter.jsx (lines 204-209)
# Service:    frontend/src/core/api/itamService.js
# Backend:    backend/apps/itam/

## STATUS: ⚠️ FUNCTIONAL BUT THIN
- AssetDashboard: KPI dashboard ✓
- AssetList: Asset table with list ✓

## ISSUE 9.1 — ItamSettings.jsx is a 5-line PLACEHOLDER
- File: frontend/src/apps/itam/pages/ItamSettings.jsx (only 5 lines)
- Uses generic ModuleSettings which provides basic toggle controls
- FIX: This is acceptable as a v1 — the generic ModuleSettings provides
  standard settings functionality. No action needed unless custom ITAM settings
  are required.

## ISSUE 9.2 — AssetList: Verify it has Create/Edit/Delete
- The file is 7682 bytes suggesting it has CRUD, but verify
- FIX: Ensure GenericModal is wired for asset creation with fields
  [hostname, ip_address, asset_type (select), os, status (select), assigned_to,
  location, purchase_date (date), warranty_expiry (date)].

---

# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 10: MARKETING AUTOMATION (/admin/marketing/*)
# ═══════════════════════════════════════════════════════════════════════════════
# Route file: frontend/src/apps/marketing/routes/marketingRoutes.jsx
# Service:    frontend/src/core/api/marketingService.js
# Backend:    backend/apps/marketing/

## STATUS: ✅ MOSTLY FUNCTIONAL
- CampaignList: Full CRUD with GenericModal + DeleteConfirmationModal ✓
- MarketingIntegrations: Integration display ✓

## ISSUE 10.1 — marketingRoutes has NO dashboard/overview route
- The route file has campaigns, integrations, settings — but no index/overview
- sidebar links to /admin/marketing which renders MarketingDashboard from EnterpriseRouter
- FIX: Add `<Route path="overview" element={<MarketingDashboard />} />` to marketingRoutes
  and add `<Route index element={<MarketingDashboard />} />`.

---

# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 11: BILLING & SUBSCRIPTIONS (/admin/billing/*)
# ═══════════════════════════════════════════════════════════════════════════════
# Route file: Inline in EnterpriseRouter.jsx (lines 173-181)
# Service:    frontend/src/core/api/billingService.js
# Backend:    backend/apps/billing/

## STATUS: ✅ FUNCTIONAL
- BillingAdminPage: Plan display + Stripe subscribe + cancel ✓
- PlansList: Plan management ✓
- InvoicesList: Invoice history ✓
- BillingSettings: Settings page ✓

## NO CRITICAL ISSUES

---

# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 12: CONTRACTS & SLAs (/admin/contracts/*)
# ═══════════════════════════════════════════════════════════════════════════════
# Route file: Inline in EnterpriseRouter.jsx (lines 194-202)
# Service:    frontend/src/core/api/contractsService.js
# Backend:    backend/apps/contracts/

## STATUS: ✅ FULLY FUNCTIONAL
- ContractList: Full CRUD with ContractModal ✓
- QuoteList + QuoteDetail: Working ✓
- SlaTiersPage: SLA tier management ✓
- SlaBreachesPage: Breach tracking ✓

## NO CRITICAL ISSUES

---

# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 13: IDENTITY & ACCESS (/admin/iam/*)
# ═══════════════════════════════════════════════════════════════════════════════
# Route file: Inline in EnterpriseRouter.jsx (lines 163-171)
# Service:    frontend/src/core/api/iamService.js
# Backend:    backend/apps/auth/

## STATUS: ✅ FUNCTIONAL
- RoleList: Role management ✓
- UserList: User management ✓
- TenantList: Tenant management ✓
- AuditLogPage: Audit log ✓
- IamSettings: IAM settings ✓

## NO CRITICAL ISSUES

---

# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 14: DOCUMENT MANAGEMENT (/admin/documents/*)
# ═══════════════════════════════════════════════════════════════════════════════
# Route file: Inline in EnterpriseRouter.jsx (lines 226-230)
# Service:    frontend/src/core/api/documentsService.js
# Backend:    backend/apps/documents/

## STATUS: ✅ FUNCTIONAL
- DocumentsDashboard: Upload + search + filter + download + delete ✓
- DocumentUploadModal: File upload form ✓

## NO CRITICAL ISSUES (crash was fixed in previous session)

---

# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 15: APPROVAL CENTER (/admin/approvals/*)
# ═══════════════════════════════════════════════════════════════════════════════
# Route file: Inline in EnterpriseRouter.jsx (lines 232-236)
# Service:    frontend/src/core/api/approvalsService.js
# Backend:    backend/apps/approvals/

## STATUS: ✅ FUNCTIONAL
- ApprovalsDashboard: Full CRUD with approve/reject actions ✓

## NO CRITICAL ISSUES (null crash was fixed in previous session)

---

# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 16: CHANGE MANAGEMENT / ITSM (/admin/itsm/*)
# ═══════════════════════════════════════════════════════════════════════════════
# Route file: Inline in EnterpriseRouter.jsx (lines 238-242)
# Service:    frontend/src/core/api/itsmService.js
# Backend:    backend/apps/itsm/

## STATUS: ✅ FUNCTIONAL (submit button was fixed in previous session)
- ItsmDashboard: Full list + create via GenericModal ✓

## NO CRITICAL ISSUES

---

# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 17: ANALYTICS & REPORTS (/admin/reports/*)
# ═══════════════════════════════════════════════════════════════════════════════
# Route file: Inline in EnterpriseRouter.jsx (lines 183-192)
# Backend:    backend/apps/reports/

## STATUS: ✅ FUNCTIONAL
- ReportsDashboard, MrrDashboard, RevenueReport, CrmReport,
  SupportReport, SecurityReport, ExportPage — all working ✓

## NO CRITICAL ISSUES

---

# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 18: SYSTEM ADMINISTRATION (/admin/system/*)
# ═══════════════════════════════════════════════════════════════════════════════
# Route file: frontend/src/apps/sysadmin/routes/sysadminRoutes.jsx
# Backend:    backend/apps/sysadmin/

## STATUS: ✅ FUNCTIONAL
- SysadminDashboard: Platform health ✓
- PlatformSettings: Global configuration ✓
- SystemLogs: Log viewer ✓

## NO CRITICAL ISSUES

---

# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 19: COMMAND CENTER (Main Admin Dashboard)
# ═══════════════════════════════════════════════════════════════════════════════
# File: frontend/src/apps/dashboard/pages/CommandCenter.jsx
# Service: frontend/src/apps/dashboard/api/dashboardService.js

## ISSUE 19.1 — KPI cards use dynamic Tailwind classes that get purged
- Lines 21-24: `hover:border-${color}-500/40`, `bg-${color}-500/10`
- Tailwind CSS purges dynamic class names at build time
- This means colors may NOT render in production build
- FIX: Replace dynamic class concatenation with a mapping object:
  ```jsx
  const colorMap = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', hover: 'hover:border-blue-500/40' },
    // ... etc for each color
  };
  ```

## ISSUE 19.2 — Quick Actions may link to invalid routes
- Verify all quick action links point to real routes
- Common issue: Quick action "Onboard Client" → /admin/crm/onboarding

---

# ═══════════════════════════════════════════════════════════════════════════════
#           MASTER REFACTORING CHECKLIST — PRIORITY ORDER
# ═══════════════════════════════════════════════════════════════════════════════

## 🔴 CRITICAL (Will crash the app)
1. Fix StoreCustomization.jsx leading slash (issue 1.8) — BREAKS API calls
2. Fix PixelTracking.jsx leading slash (issue 1.9) — BREAKS API calls
3. Fix CommandCenter dynamic Tailwind class purging (issue 19.1)

## 🟠 HIGH (Dead buttons — user tries to do something and nothing happens)
4. ProductManagement.jsx — Wire "Add Product" with GenericModal + per-row Edit/Delete (1.1)
5. CategoryManagement.jsx — Wire "Add Category" + Edit/Delete per row (1.2)
6. ShippingSettings.jsx — Wire "Add Global Zone" button (1.4)
7. LandingPages.jsx — Wire "Create Funnel" button (1.5)
8. AddOnManagement.jsx — Wire "Link Provider" button (1.6)
9. InteractionList.jsx — Add "Log Interaction" button (2.1)
10. ProjectsDashboard.jsx — Add "New Project" creation modal (8.1)

## 🟡 MEDIUM (Missing features that matter for daily company management)
11. LeaveManagement — Add "Request Leave" self-service button (4.2)
12. PayrollPage — Add "Export CSV" + "Run Payroll" buttons (4.3)
13. CustomerManagement — Wire search to filter (1.3)
14. SubscriptionManagement — Wire search to filter (1.7)
15. HRM routes — Add explicit "overview" route (4.1)
16. SCM routes — Add explicit "overview" route (5.1)
17. Marketing routes — Add index/overview route (10.1)
18. OrderList in CRM — Add status update functionality (2.2)

## 🟢 LOW (Cleanup & Polish)
19. Delete orphaned ERP project files (3.1)
20. Create MilestonePage for Projects (8.3)
21. Verify KanbanBoard task CRUD (8.2)

---

# ═══════════════════════════════════════════════════════════════════════════════
#        STEP-BY-STEP INSTRUCTIONS FOR EACH FIX
# ═══════════════════════════════════════════════════════════════════════════════

## FIX TEMPLATE — How to wire a dead button (repeat for issues 1.1-1.6, 2.1, 8.1)

Every dead-button fix follows this EXACT pattern:

### Step 1: Add imports at top of file
```jsx
import GenericModal from '../../../core/components/shared/forms/GenericModal';
import DeleteConfirmationModal from '../../../core/components/shared/core/DeleteConfirmationModal';
import { Edit2, Trash2 } from 'lucide-react';
```

### Step 2: Add state variables inside component
```jsx
const [isModalOpen, setIsModalOpen] = useState(false);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);
const [actionLoading, setActionLoading] = useState(false);
```

### Step 3: Add CRUD handlers
```jsx
const handleSave = async (formData) => {
    setActionLoading(true);
    try {
        if (selectedItem) {
            await client.patch(`endpoint/${selectedItem.id}/`, formData);
        } else {
            await client.post('endpoint/', formData);
        }
        setIsModalOpen(false);
        setSelectedItem(null);
        fetchData(); // re-fetch list
    } catch (error) {
        alert('Failed to save');
        console.error(error);
    } finally {
        setActionLoading(false);
    }
};

const handleDelete = async () => {
    setActionLoading(true);
    try {
        await client.delete(`endpoint/${selectedItem.id}/`);
        setIsDeleteModalOpen(false);
        setSelectedItem(null);
        fetchData(); // re-fetch list
    } catch (error) {
        alert('Failed to delete');
        console.error(error);
    } finally {
        setActionLoading(false);
    }
};
```

### Step 4: Wire the "Add" button
```jsx
<button onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}>
    <Plus size={16} /> Add Item
</button>
```

### Step 5: Add Edit/Delete buttons per table row
```jsx
<td>
    <button onClick={() => { setSelectedItem(item); setIsModalOpen(true); }}><Edit2 size={16} /></button>
    <button onClick={() => { setSelectedItem(item); setIsDeleteModalOpen(true); }}><Trash2 size={16} /></button>
</td>
```

### Step 6: Add modals at bottom of JSX (before closing div)
```jsx
<GenericModal
    isOpen={isModalOpen}
    onClose={() => { setIsModalOpen(false); setSelectedItem(null); }}
    title="Item Name"
    fields={ITEM_FIELDS}
    initialData={selectedItem}
    onSubmit={handleSave}
    loading={actionLoading}
/>
<DeleteConfirmationModal
    isOpen={isDeleteModalOpen}
    onClose={() => { setIsDeleteModalOpen(false); setSelectedItem(null); }}
    onConfirm={handleDelete}
    loading={actionLoading}
    title="Delete Item"
    message={`Are you sure you want to delete "${selectedItem?.name}"?`}
/>
```

### Step 7: Define the FIELDS array outside the component
```jsx
const ITEM_FIELDS = [
    { name: 'name', label: 'Name', required: true },
    { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
    { name: 'status', label: 'Status', type: 'select', options: [
        { value: 'active', label: 'Active' },
        { value: 'draft', label: 'Draft' },
    ]},
    { name: 'price', label: 'Price', type: 'number', step: '0.01' },
    { name: 'is_enabled', label: 'Enabled', type: 'toggle' },
];
```

---

# ═══════════════════════════════════════════════════════════════════════════════
#    SPECIFIC FIELD DEFINITIONS PER MODULE (for GenericModal fields)
# ═══════════════════════════════════════════════════════════════════════════════

## ProductManagement fields:
name, product_type (select: physical/digital/service/subscription), price (number),
status (select: active/draft/archived), stock_quantity (number), description (textarea),
sku, category (select from categories API)

## CategoryManagement fields:
name, slug, is_visible (toggle), description (textarea)

## ShippingSettings fields:
zone_name, rate (number), estimated_days (number)

## LandingPages fields:
title, slug, is_published (toggle), content (textarea), meta_description (textarea)

## AddOnManagement fields:
name, provider, is_enabled (toggle), api_key, description (textarea)

## InteractionList fields:
client (select), interaction_type (select: call/email/meeting/note), subject,
notes (textarea), date (date)

## ProjectsDashboard new project fields:
name, description (textarea), status (select: planning/active/on_hold/completed),
priority (select: low/medium/high/critical), start_date (date), end_date (date),
budget (number)

---

# ═══════════════════════════════════════════════════════════════════════════════
#     API ENDPOINT REFERENCE (all endpoints are relative to baseURL)
# ═══════════════════════════════════════════════════════════════════════════════

Store:      store/products/, store/categories/, store/orders/,
            store/customers/, store/shipping-settings/, store/landing-pages/,
            store/addons/, store/subscriptions/, store/customization/,
            store/tracking-configs/

CRM:        crm/clients/, crm/contacts/, crm/leads/, crm/deals/,
            crm/interactions/, crm/contracts/, crm/quotes/, crm/orders/

ERP:        erp/invoices/, erp/expenses/

HRM:        hrm/employees/, hrm/departments/, hrm/leave-requests/,
            hrm/time-entries/, hrm/certifications/

SCM:        scm/vendors/, scm/inventory/, scm/purchase-orders/

Support:    support/tickets/, support/articles/

Security:   security/alerts/, security/incidents/, security/assets/,
            security/vulnerabilities/

Projects:   projects/projects/, projects/tasks/, projects/milestones/,
            projects/time-logs/

ITAM:       itam/assets/

Billing:    billing/plans/, billing/subscriptions/, billing/invoices/

Marketing:  marketing/campaigns/

Documents:  documents/vault/

Approvals:  approvals/requests/

ITSM:       itsm/changes/, itsm/tasks/

Dashboard:  dashboard/metrics/, dashboard/health/

---

# ═══════════════════════════════════════════════════════════════════════════════
#     FINAL NOTES FOR AI BUILDER
# ═══════════════════════════════════════════════════════════════════════════════

1. DO NOT change the overall architecture — keep Feature-Sliced Design
2. DO NOT modify the API client (client.js) — it's already hardened
3. DO NOT add 'api/' prefix to any endpoint — the baseURL already includes it
4. DO NOT change the Tailwind theme — keep slate-950 dark theme
5. ALWAYS use GenericModal and DeleteConfirmationModal for forms
6. ALWAYS add loading spinners during API calls
7. ALWAYS handle errors gracefully with try/catch and user alerts
8. ALWAYS use optional chaining (?.) when accessing API response fields
9. ALWAYS re-fetch data after create/update/delete operations
10. For every table, ensure empty state shows a helpful message
11. Test every page in the sidebar to confirm no white-screen crashes
