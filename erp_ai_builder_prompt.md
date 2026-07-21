# BitGuard ERP — Full Audit Report & AI Builder Implementation Prompt

> **How to use this document**: Copy the relevant section(s) into your AI website builder as a prompt. Each module section is self-contained. Use the Priority column to decide what to tackle first.

---

## AUDIT SUMMARY (Current State)

| Layer | Status |
|---|---|
| **Auth / Users / Tenants** | ✅ Complete — JWT, multi-tenant, RBAC |
| **Backend API structure** | ✅ DRF ViewSets, tenant-scoped, JWT auth |
| **Frontend routing** | ✅ Protected routes, admin vs portal separation |
| **Design system** | ⚠️ Partial — Tailwind used inconsistently, no shared Odoo-style components |
| **CRM** | ⚠️ Backend skeletal, frontend has pages but uses hardcoded choices |
| **Helpdesk** | ⚠️ Missing: Teams, SLA policy, configurable stages |
| **MRP** | 🔴 Backend has 3 stub models only. Frontend has 1 dashboard + 1 list |
| **Inventory** | ⚠️ Has stock, reorder, delivery — missing: lots/serial, multi-location moves |
| **Accounting** | ⚠️ Has invoices/payments — missing: journals, reconciliation, tax groups |
| **Payroll** | 🔴 Stub/placeholder only |
| **HRM** | ⚠️ Has employees, contracts — missing: org chart, performance reviews |
| **Projects** | ⚠️ Has tasks/projects — missing: Gantt, sprints, time logging |
| **Purchase** | ⚠️ Has PO, vendor — missing: RFQ, approval workflow |
| **Sales** | ⚠️ Has quotes/orders — missing: pricelist, discount policy |
| **POS** | ⚠️ Has sessions/orders — missing: live cashier UI, payment methods |
| **Chatter system** | 🔴 Not present on any record (was just added to backend only) |
| **Shared UI components** | 🔴 No ChatterPanel, StatusBar, BreadcrumbNav, KanbanView, FormView |

---

## MASTER IMPLEMENTATION PROMPT FOR AI BUILDER

Copy this entire section as your prompt:

---

### 🎯 PROJECT CONTEXT

You are building an **enterprise ERP web application** called **BitGuard** — a full Odoo-equivalent SaaS ERP. The stack is:
- **Backend**: Django 5.x + Django REST Framework, PostgreSQL, multi-tenant architecture via `X-Tenant-ID` header
- **Frontend**: React 18 + Vite, React Router v6, Lucide React icons, Tailwind CSS (dark mode supported)
- **Auth**: JWT (access + refresh tokens stored in localStorage), role-based (admin = `/admin/*`, user = `/portal/*`)
- **API base URL**: `http://localhost:8000/api/v1/` with `Authorization: Bearer <token>` and `X-Tenant-ID: <id>` headers on every request
- **Design**: Dark-mode enterprise style (slate-900/950 backgrounds, blue/indigo accents, glassmorphism cards, smooth transitions)

The codebase is at: `c:\Users\youne\Desktop\2-InfoTech\website\website13`

---

## PHASE 1 — SHARED COMPONENT LIBRARY (Do This First, Everything Depends On It)

**Priority: CRITICAL — Build these before touching any module**

### 1A. ChatterPanel Component
**File**: `frontend/src/core/components/shared/chatter/ChatterPanel.jsx`

Build a reusable chatter panel component identical to Odoo's chatter. It must:
- Accept props: `model` (string, e.g. `"crm.Deal"`), `objectId` (UUID string), `className`
- Load data from: `GET /api/v1/core/chatter/?model={model}&object_id={objectId}`
- Show three tabs: **Messages**, **Activities**, **Log** (field change history)
- **Messages tab**:
  - Chronological thread (newest at top)
  - Each message card shows: author avatar (initials circle), author name, timestamp (relative: "2 hours ago"), message body
  - Internal notes styled with amber left-border and "🔒 Internal Note" badge
  - Input area at bottom: textarea + Send button + "Log Note" toggle button
  - POST to `POST /api/v1/core/messages/` with `{ content_type, object_id, body, message_type, is_internal }`
- **Activities tab**:
  - List of pending activities with: icon (phone/email/meeting/todo), summary, due date, assignee name
  - Overdue activities highlighted in red
  - "Mark Done" button per activity (PATCH `/api/v1/core/activities/{id}/done/`)
  - "+ Schedule Activity" button opens a small modal form: type, due date, assignee, summary
  - POST to `POST /api/v1/core/activities/`
- **Log tab**:
  - Timeline of field changes: "Stage changed: New → Qualified by John · 2 hours ago"
  - Read-only, from `change_log` array in chatter response
- **Follow/Unfollow button** in top-right: shows "👁 X Followers", clicking toggles follow state
- Use `chatterService.js` at `frontend/src/core/api/chatterService.js` for all API calls

**Style**: Dark card with slate-800 background, smooth tab transitions, skeleton loading state

---

### 1B. StatusBar Component  
**File**: `frontend/src/core/components/shared/forms/StatusBar.jsx`

Odoo-style horizontal status progression bar for record forms. Props:
- `stages`: array of `{ key, label, color? }` objects
- `currentStage`: string key of active stage
- `onChange`: callback `(newStageKey) => void` (optional — omit for read-only)
- `variant`: `"pipeline"` (clickable) | `"readonly"`

Renders as: `New → Contacted → Qualified → [Won]` horizontal pills. Active stage is filled/highlighted. Completed stages have a checkmark. Clicking a stage calls `onChange`. Won/Lost stages use green/red colors. Animate transitions with CSS.

---

### 1C. BreadcrumbNav Component
**File**: `frontend/src/core/components/shared/navigation/BreadcrumbNav.jsx`

Props: `items` = array of `{ label, href? }`. Renders: `CRM > Leads > Lead #1234` with clickable links using React Router `Link`. Last item is not clickable. Include a back button (←) that calls `navigate(-1)`.

---

### 1D. RecordFormLayout Component
**File**: `frontend/src/core/components/shared/forms/RecordFormLayout.jsx`

Master layout wrapper for any record's detail/edit page (like Odoo's form view). Props:
- `title`: string (record title)
- `breadcrumbs`: items for BreadcrumbNav
- `stages`: for StatusBar (optional)
- `currentStage`: active stage key (optional)
- `onStageChange`: callback (optional)
- `actions`: array of `{ label, icon, onClick, variant }` — renders as button group in top-right
- `children`: main form fields (left column, 2/3 width)
- `chatterModel`: e.g. `"crm.Deal"` (if provided, renders ChatterPanel in right sidebar)
- `chatterObjectId`: UUID

Layout: two-column — left 65% for form fields, right 35% for ChatterPanel. On mobile: single column, chatter below form.

---

### 1E. KanbanBoard Component
**File**: `frontend/src/core/components/shared/views/KanbanBoard.jsx`

Reusable drag-and-drop Kanban board. Props:
- `columns`: array of `{ id, label, color, cards: [] }`
- `cardRenderer`: `(card) => JSX` — lets each module customize card appearance
- `onCardMove`: `(cardId, fromColumnId, toColumnId) => void`
- `onColumnAdd`: optional callback
- `isLoading`: boolean

Use CSS grid for columns, CSS transforms for drag. Each column shows count badge. Implement drag with HTML5 drag-and-drop API (no external drag library). Empty columns show a "No records" placeholder. Column headers are color-coded.

---

### 1F. DataTable Component
**File**: `frontend/src/core/components/shared/views/DataTable.jsx`

Reusable list/table view component (Odoo list view equivalent). Props:
- `columns`: array of `{ key, label, render?, sortable?, width? }`
- `data`: array of row objects
- `isLoading`: boolean
- `onRowClick`: `(row) => void`
- `onSort`: `(key, direction) => void`
- `pagination`: `{ page, pageSize, total, onPageChange }`
- `selectedIds`: Set of selected IDs
- `onSelectionChange`: callback
- `actions`: array of bulk actions (delete, export, etc.)

Features: sticky header, sortable columns (click header to sort), row selection checkboxes, inline row actions (edit/delete icons on hover), pagination bar, search bar slot (pass as prop), responsive (horizontal scroll on mobile), skeleton rows while loading.

---

## PHASE 2 — CRM MODULE (Highest Business Value)

### 2A. Backend — CRM API Completion
**File**: `backend/apps/crm/api/views.py`

Verify and complete these ViewSets (all must be tenant-scoped, all must return `{success, data}` envelope):

**LeadViewSet** (`/api/v1/crm/leads/`):
- Fields: `id, title, first_name, last_name, company, email, phone, source, status, value, probability, priority, score, description, expected_close_date, assigned_to, team, tags, contact, client, created_at`
- Filters: `?status=new`, `?source=website`, `?assigned_to=<uuid>`, `?search=<term>`
- Actions: `POST leads/{id}/convert/` — converts lead to a Deal (creates Deal record, sets lead.status=converted)
- Actions: `POST leads/{id}/mark-lost/` — sets status=lost, accepts `{ lost_reason }` in body

**DealViewSet** (`/api/v1/crm/deals/`):
- Fields: `id, title, client, stage (FK to CrmStage), amount, probability, priority, expected_close_date, assigned_to, team, lost_reason, tags, notes`
- Filters: `?stage_id=`, `?assigned_to=`, `?is_won=true`
- Actions: `POST deals/{id}/set-stage/` — moves deal to new stage, logs field change, posts chatter message "Stage updated to X by Y"
- Actions: `POST deals/{id}/mark-won/` — sets stage to the is_won stage
- Actions: `POST deals/{id}/mark-lost/` — sets stage to is_lost stage, requires lost_reason

**CrmStageViewSet** (`/api/v1/crm/stages/`): Full CRUD for pipeline stages.

**CrmSalesTeamViewSet** (`/api/v1/crm/teams/`): Full CRUD for sales teams.

---

### 2B. Frontend — CRM Pipeline (Kanban)
**File**: `frontend/src/apps/crm/pages/dashboards/CrmDashboard.jsx`

Rewrite the CRM dashboard as a **Kanban pipeline** (like Odoo CRM). It must:
1. Load stages from `GET /api/v1/crm/stages/` and deals from `GET /api/v1/crm/deals/`
2. Group deals by `stage` FK
3. Use the `KanbanBoard` shared component
4. Each deal card shows: title, client name, amount (formatted as "$12,500"), probability badge, assignee avatar, activity indicator (🔴 overdue / 🟢 upcoming / ⚪ none)
5. Dragging a card to a new column calls `POST /api/v1/crm/deals/{id}/set-stage/`
6. Clicking a card navigates to `DealDetail` page
7. "New Deal" button opens `DealForm` modal

---

### 2C. Frontend — Deal Detail Page
**File**: `frontend/src/apps/crm/pages/details/DealDetail.jsx`

Full record form page using `RecordFormLayout`. Left column has:
- Deal title (editable inline — click to edit)
- Expected Revenue field
- Expected Close Date picker
- Probability slider (0–100%)
- Assigned To user picker
- Sales Team picker
- Tags multi-select
- Lost Reason (visible only if stage.is_lost)
- Notes textarea

Right column: `<ChatterPanel model="crm.deal" objectId={deal.id} />`

StatusBar at top shows all CrmStages, current deal stage highlighted. Clicking a stage calls `set-stage` API.

---

### 2D. Frontend — Lead List + Lead Detail
**File**: `frontend/src/apps/crm/pages/lists/LeadList.jsx` — **REWRITE using DataTable component**

Current file has mock-ish data. Rewrite to:
- Load from `GET /api/v1/crm/leads/`
- Columns: Name (first+last), Company, Email, Phone, Source (badge), Status (colored badge), Expected Value, Assigned To, Created
- Filters: status tabs (All / New / Contacted / Qualified / Lost / Converted)
- Search bar
- Clicking row → LeadDetail page

**File**: `frontend/src/apps/crm/pages/details/LeadDetail.jsx` — Create new file:
Same as DealDetail but for leads. StatusBar shows: New → Contacted → Qualified → Converted / Lost. "Convert to Deal" button calls `POST /api/v1/crm/leads/{id}/convert/`.

---

## PHASE 3 — HELPDESK MODULE

### 3A. Backend — Add Missing Models
**File**: `backend/apps/helpdesk/domain/models.py`

Add to existing file (keep Ticket, TicketMessage, KnowledgeArticle):

```python
class HelpdeskTeam(TenantAwareModel):
    name = models.CharField(max_length=100)
    leader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='led_helpdesk_teams')
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name='helpdesk_teams')
    alias_email = models.EmailField(blank=True)
    use_sla = models.BooleanField(default=True)

class HelpdeskStage(TenantAwareModel):
    name = models.CharField(max_length=100)
    sequence = models.IntegerField(default=10)
    team = models.ForeignKey(HelpdeskTeam, on_delete=models.CASCADE, related_name='stages', null=True, blank=True)
    is_closed = models.BooleanField(default=False)
    fold = models.BooleanField(default=False)
    color = models.CharField(max_length=7, default='#3b82f6')

class SLAPolicy(TenantAwareModel):
    name = models.CharField(max_length=100)
    team = models.ForeignKey(HelpdeskTeam, on_delete=models.CASCADE, related_name='sla_policies')
    ticket_type = models.CharField(max_length=20, blank=True)
    priority = models.CharField(max_length=20, blank=True)
    time_to_response_hours = models.IntegerField(default=4)
    time_to_resolve_hours = models.IntegerField(default=24)
    is_active = models.BooleanField(default=True)
```

Update `Ticket` model: add `team FK(HelpdeskTeam)`, `stage FK(HelpdeskStage)`, `sla_policy FK(SLAPolicy)`, `first_response_at DateTimeField null=True`, `resolved_at DateTimeField null=True`, `sla_breached BooleanField default=False`, `tags JSONField default=list`, `ticket_number CharField max_length=20 blank=True`.

---

### 3B. Backend — Helpdesk API
**File**: `backend/apps/helpdesk/api/views.py`

Create ViewSets:
- `TicketViewSet` (full CRUD + `assign/`, `resolve/`, `escalate/` actions)
- `HelpdeskTeamViewSet`
- `HelpdeskStageViewSet`
- `SLAPolicyViewSet`
- `KnowledgeArticleViewSet`

Register at `backend/apps/helpdesk/api/urls.py`

---

### 3C. Frontend — Helpdesk Rewrite
**File**: `frontend/src/apps/helpdesk/pages/dashboards/HelpdeskDashboard.jsx`

**REWRITE**: Current dashboard calls `serviceService.getChangeRequests()` which is the WRONG service (it's pulling ITSM change requests, not helpdesk tickets). Replace with proper helpdesk API calls:

```javascript
import supportService from '../../../../core/api/supportService';
// Load: GET /api/v1/helpdesk/tickets/
// Show: KPI cards (Open, In Progress, SLA Breached, Resolved Today)
// Show: Kanban by HelpdeskStage OR list view toggle
// Show: SLA breach alerts panel
```

**File**: `frontend/src/apps/helpdesk/pages/details/TicketDetail.jsx` — New file:
- Use RecordFormLayout
- Left: Ticket fields (type, priority, status, team, assignee, SLA timer countdown)
- Right: ChatterPanel (model="helpdesk.ticket")
- StatusBar: ticket's team stages

---

## PHASE 4 — MRP MODULE (Manufacturing)

### 4A. Backend — Full MRP Models
**File**: `backend/apps/mrp/domain/models.py` — REWRITE ENTIRELY:

```python
class WorkCenter(TenantAwareModel):  # KEEP EXISTING
    name, code, capacity, time_efficiency  # existing fields
    # ADD:
    color = models.CharField(max_length=7, default='#3b82f6')
    is_active = models.BooleanField(default=True)
    costs_hour = models.DecimalField(max_digits=10, decimal_places=2, default=0)

class Routing(TenantAwareModel):  # NEW
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)

class RoutingOperation(TenantAwareModel):  # NEW
    name = models.CharField(max_length=255)
    routing = models.ForeignKey(Routing, on_delete=models.CASCADE, related_name='operations')
    work_center = models.ForeignKey(WorkCenter, on_delete=models.SET_NULL, null=True)
    sequence = models.IntegerField(default=10)
    duration_expected = models.FloatField(default=60, help_text="Minutes")

class BillOfMaterial(TenantAwareModel):  # UPDATE existing
    # KEEP: product_id, code, quantity, type
    # ADD:
    routing = models.ForeignKey(Routing, on_delete=models.SET_NULL, null=True, blank=True)
    product_name = models.CharField(max_length=255, blank=True)  # denormalized
    is_active = models.BooleanField(default=True)

class BillOfMaterialLine(TenantAwareModel):  # NEW
    bom = models.ForeignKey(BillOfMaterial, on_delete=models.CASCADE, related_name='lines')
    component_id = models.IntegerField(help_text="FK to inventory.InventoryItem")
    component_name = models.CharField(max_length=255, blank=True)
    quantity = models.FloatField(default=1.0)
    sequence = models.IntegerField(default=10)

class ManufacturingOrder(TenantAwareModel):  # UPDATE existing
    # KEEP: name, product_id, bom, qty_producing, state, date_planned_start
    # ADD:
    product_name = models.CharField(max_length=255, blank=True)
    qty_to_produce = models.FloatField(default=1.0)
    date_planned_finished = models.DateTimeField(null=True, blank=True)
    responsible = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    origin = models.CharField(max_length=100, blank=True, help_text="Source document (SO number)")
    lot_number = models.CharField(max_length=100, blank=True)
    routing = models.ForeignKey(Routing, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True)

class WorkOrder(TenantAwareModel):  # NEW
    """Individual operation step within a Manufacturing Order"""
    manufacturing_order = models.ForeignKey(ManufacturingOrder, on_delete=models.CASCADE, related_name='work_orders')
    operation = models.ForeignKey(RoutingOperation, on_delete=models.SET_NULL, null=True)
    work_center = models.ForeignKey(WorkCenter, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=255)
    state = models.CharField(max_length=20, choices=[('pending','Pending'),('ready','Ready'),('in_progress','In Progress'),('done','Done'),('cancel','Cancelled')], default='pending')
    duration_expected = models.FloatField(default=60)
    duration_real = models.FloatField(default=0)
    date_start = models.DateTimeField(null=True, blank=True)
    date_finished = models.DateTimeField(null=True, blank=True)
    sequence = models.IntegerField(default=10)

class ScrapOrder(TenantAwareModel):  # NEW
    """Record of scrapped materials during production"""
    manufacturing_order = models.ForeignKey(ManufacturingOrder, on_delete=models.SET_NULL, null=True, blank=True)
    inventory_item_id = models.IntegerField()
    component_name = models.CharField(max_length=255, blank=True)
    quantity = models.FloatField()
    reason = models.TextField(blank=True)
    date = models.DateField(auto_now_add=True)
```

### 4B. MRP API ViewSets
Create `BillOfMaterialViewSet`, `ManufacturingOrderViewSet`, `WorkOrderViewSet`, `WorkCenterViewSet`, `ScrapOrderViewSet` in `backend/apps/mrp/api/views.py`.

ManufacturingOrderViewSet must have:
- `POST /mrp/orders/{id}/confirm/` — changes state draft→confirmed, creates work orders from routing
- `POST /mrp/orders/{id}/start/` — changes confirmed→in_progress
- `POST /mrp/orders/{id}/produce/` — marks as done, triggers inventory deduction
- `GET /mrp/orders/{id}/work-orders/` — list all work orders for this MO

### 4C. MRP Frontend

**MrpDashboard.jsx** — Rewrite with real KPIs:
- Cards: Total MOs, In Progress, Done This Month, Blocked (overdue)
- Chart: Production by week (last 8 weeks) — use a simple SVG bar chart (no chart library)
- Recent MOs table

**ManufacturingOrderList.jsx** — new file at `pages/lists/`:
Use DataTable. Columns: Name, Product, BOM, Qty, Status (badge), Responsible, Planned Date, Actions.

**ManufacturingOrderDetail.jsx** — new file at `pages/details/`:
Use RecordFormLayout. Shows: product name, BOM, qty, dates, routing. Work orders shown as a progress stepper. ChatterPanel on right.

**BomList.jsx** and **BomDetail.jsx** — list + detail pages for Bills of Materials.

---

## PHASE 5 — INVENTORY MODULE

### 5A. Missing Backend Models
Add to `backend/apps/inventory/domain/models.py`:

```python
class StockLot(TenantAwareModel):
    """Lot/serial number tracking"""
    inventory_item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE, related_name='lots')
    name = models.CharField(max_length=100, help_text="Lot or serial number")
    expiry_date = models.DateField(null=True, blank=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)

class StorageLocation(TenantAwareModel):
    """Multi-location warehouse storage zones"""
    name = models.CharField(max_length=100)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='locations')
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children')
    location_type = models.CharField(max_length=20, choices=[('supplier','Vendor Location'),('internal','Internal'),('customer','Customer'),('scrap','Scrap'),('transit','Transit')], default='internal')
    is_active = models.BooleanField(default=True)

class StockPicking(TenantAwareModel):
    """Transfer/picking operation (Receipt, Delivery, Internal Transfer)"""
    name = models.CharField(max_length=100)
    picking_type = models.CharField(max_length=20, choices=[('receipt','Receipt'),('delivery','Delivery'),('internal','Internal Transfer'),('return','Return')], default='receipt')
    origin_location = models.ForeignKey(StorageLocation, on_delete=models.SET_NULL, null=True, related_name='outgoing_pickings')
    dest_location = models.ForeignKey(StorageLocation, on_delete=models.SET_NULL, null=True, related_name='incoming_pickings')
    state = models.CharField(max_length=20, choices=[('draft','Draft'),('confirmed','Ready'),('done','Done'),('cancel','Cancelled')], default='draft')
    origin = models.CharField(max_length=100, blank=True)
    scheduled_date = models.DateTimeField(null=True, blank=True)
```

### 5B. Inventory Frontend Gaps
- **Lots.jsx** — currently placeholder (827 bytes). Rewrite to load `GET /api/v1/inventory/lots/` using DataTable
- **ProductVariants.jsx** — currently placeholder. Rewrite with real data
- Add **StockPickingList.jsx** — transfers/receipts/deliveries list
- Add **InventoryAdjustment.jsx** — stock count form
- Add real **ValuationReport.jsx** — inventory valuation by product

---

## PHASE 6 — ACCOUNTING MODULE

### 6A. Check and Complete Models
Read `backend/apps/accounting/domain/models.py` and ensure these exist. Add any missing:

```python
class AccountJournal(TenantAwareModel):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10)
    journal_type = models.CharField(max_length=20, choices=[('sale','Sales'),('purchase','Purchase'),('cash','Cash'),('bank','Bank'),('general','Miscellaneous')], default='general')
    currency = models.ForeignKey('Currency', on_delete=models.SET_NULL, null=True, blank=True)
    default_account = models.ForeignKey('ChartOfAccounts', on_delete=models.SET_NULL, null=True, blank=True, related_name='default_journals')
    is_active = models.BooleanField(default=True)

class TaxGroup(TenantAwareModel):
    name = models.CharField(max_length=100)
    sequence = models.IntegerField(default=10)

class Tax(TenantAwareModel):
    name = models.CharField(max_length=100)
    tax_type = models.CharField(max_length=10, choices=[('sale','Sales Tax'),('purchase','Purchase Tax')], default='sale')
    computation = models.CharField(max_length=20, choices=[('percent','Percentage'),('fixed','Fixed Amount')], default='percent')
    amount = models.DecimalField(max_digits=8, decimal_places=4, default=0)
    group = models.ForeignKey(TaxGroup, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)

class BankReconciliation(TenantAwareModel):
    journal = models.ForeignKey(AccountJournal, on_delete=models.CASCADE, related_name='reconciliations')
    date = models.DateField()
    statement_balance = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    system_balance = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    difference = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    is_reconciled = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
```

### 6B. Accounting Frontend Gaps
- Add **JournalList.jsx** — list of accounting journals
- Add **TaxList.jsx** — tax configuration page
- Add **BankReconciliation.jsx** — statement upload + matching UI
- Add **AccountingReports** — P&L, Balance Sheet, Trial Balance (load from existing reporting API or create `/api/v1/accounting/reports/` endpoint)

---

## PHASE 7 — HRM MODULE

### 7A. Missing HRM Models
Add to `backend/apps/hrm/domain/models.py`:

```python
class Department(TenantAwareModel):
    name = models.CharField(max_length=100)
    manager = models.ForeignKey('Employee', on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_departments')
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)

class PerformanceReview(TenantAwareModel):
    employee = models.ForeignKey('Employee', on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    review_period = models.CharField(max_length=20, help_text="e.g. Q1-2026")
    overall_rating = models.IntegerField(choices=[(1,'Poor'),(2,'Below Average'),(3,'Average'),(4,'Good'),(5,'Excellent')], null=True)
    goals = models.JSONField(default=list)  # [{ title, target, achieved, score }]
    feedback = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=[('draft','Draft'),('in_review','In Review'),('completed','Completed')], default='draft')
    due_date = models.DateField(null=True, blank=True)

class EmployeeSkill(TenantAwareModel):
    employee = models.ForeignKey('Employee', on_delete=models.CASCADE, related_name='skills')
    skill_name = models.CharField(max_length=100)
    skill_type = models.CharField(max_length=50, blank=True)
    level = models.CharField(max_length=20, choices=[('beginner','Beginner'),('intermediate','Intermediate'),('advanced','Advanced'),('expert','Expert')], default='beginner')
    progress = models.IntegerField(default=0, help_text="0-100% proficiency")
```

### 7B. HRM Frontend Gaps
- Add **OrgChart.jsx** — visual org chart using department/employee hierarchy (CSS tree or D3-lite)
- Add **PerformanceReviews.jsx** — list + form for reviews
- Add **SkillsMatrix.jsx** — grid of employees × skills
- Update **Employee detail page** to use RecordFormLayout + ChatterPanel

---

## PHASE 8 — PROJECTS MODULE

### 8A. Missing Project Models
Add to `backend/apps/projects/domain/models.py`:

```python
class Sprint(TenantAwareModel):
    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name='sprints')
    name = models.CharField(max_length=100)
    goal = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=False)

class TimeLog(TenantAwareModel):
    task = models.ForeignKey('Task', on_delete=models.CASCADE, related_name='time_logs')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField()
    hours = models.DecimalField(max_digits=6, decimal_places=2)
    description = models.CharField(max_length=255, blank=True)

class TaskTag(TenantAwareModel):
    name = models.CharField(max_length=50)
    color = models.CharField(max_length=7, default='#6b7280')
    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name='task_tags', null=True, blank=True)
```

Update `Task` model: add `sprint FK(Sprint, null=True)`, `tags M2M(TaskTag)`, `estimated_hours DecimalField`, `actual_hours property (sum of time_logs)`, `deadline DateField null=True`.

### 8B. Projects Frontend Gaps  
- Add **GanttView.jsx** — horizontal timeline showing tasks by date (CSS grid, no library)
- Add **SprintBoard.jsx** — Kanban board scoped to active sprint
- Add **TimeTracking.jsx** — log hours form + weekly timesheet view
- Add **ProjectDashboard.jsx** — real KPIs: completion %, overdue tasks, burn-down chart

---

## PHASE 9 — PAYROLL MODULE (Currently 100% Stub)

### 9A. Backend — Full Payroll Models
**File**: `backend/apps/hrm/domain/payroll_models.py` OR the existing payroll app

```python
class PayrollStructure(TenantAwareModel):
    name = models.CharField(max_length=100)
    structure_type = models.CharField(max_length=20, choices=[('employee','Employee'),('worker','Worker')], default='employee')

class SalaryRule(TenantAwareModel):
    structure = models.ForeignKey(PayrollStructure, on_delete=models.CASCADE, related_name='rules')
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    category = models.CharField(max_length=20, choices=[('basic','Basic'),('allowance','Allowance'),('deduction','Deduction'),('gross','Gross'),('net','Net')], default='basic')
    condition_type = models.CharField(max_length=20, choices=[('none','Always'),('range','Range')], default='none')
    amount_type = models.CharField(max_length=20, choices=[('fixed','Fixed'),('percent','Percentage of'),('code','Python Code')], default='fixed')
    amount = models.DecimalField(max_digits=12, decimal_places=4, default=0)
    sequence = models.IntegerField(default=10)

class PayslipBatch(TenantAwareModel):
    name = models.CharField(max_length=100)
    date_start = models.DateField()
    date_end = models.DateField()
    state = models.CharField(max_length=20, choices=[('draft','Draft'),('verify','Verify'),('close','Done')], default='draft')

class Payslip(TenantAwareModel):
    employee = models.ForeignKey('hrm.Employee', on_delete=models.CASCADE, related_name='payslips')
    batch = models.ForeignKey(PayslipBatch, on_delete=models.SET_NULL, null=True, blank=True)
    structure = models.ForeignKey(PayrollStructure, on_delete=models.SET_NULL, null=True)
    date_from = models.DateField()
    date_to = models.DateField()
    state = models.CharField(max_length=20, choices=[('draft','Draft'),('verify','To Pay'),('done','Paid'),('cancel','Cancelled')], default='draft')
    basic_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    gross_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    net_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)

class PayslipLine(TenantAwareModel):
    payslip = models.ForeignKey(Payslip, on_delete=models.CASCADE, related_name='lines')
    rule = models.ForeignKey(SalaryRule, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    category = models.CharField(max_length=20)
```

### 9B. Payroll Frontend
- **PayrollDashboard.jsx**: KPI cards (Total payroll this month, Avg salary, Pending payslips, YTD cost)
- **PayslipList.jsx**: DataTable of payslips with batch filter
- **PayslipDetail.jsx**: Payslip form with salary breakdown table (basic, allowances, deductions, net)
- **PayrollBatchForm.jsx**: Create batch, add employees, compute payslips, validate

---

## PHASE 10 — PURCHASE & SALES MODULES

### 10A. Purchase — Missing RFQ/Approval Flow
Update `backend/apps/purchase/domain/models.py`:
- Add `RFQ` (Request for Quotation) model: vendor, products, due_date, state=draft/sent/cancelled
- Add `PurchaseOrder.approval_status` field: `draft/to_approve/approved/rejected`
- Add `PurchaseOrder.approved_by FK(User)` and `approved_at DateTimeField`

Frontend:
- **RFQList.jsx** and **RFQForm.jsx** — RFQ workflow pages
- Update **PurchaseOrderDetail.jsx** — add approval workflow buttons (Approve / Reject) visible only to managers

### 10B. Sales — Missing Pricelist
Add to `backend/apps/sale/domain/models.py`:
```python
class Pricelist(TenantAwareModel):
    name = models.CharField(max_length=100)
    currency = models.ForeignKey('accounting.Currency', on_delete=models.SET_NULL, null=True)
    is_active = models.BooleanField(default=True)

class PricelistRule(TenantAwareModel):
    pricelist = models.ForeignKey(Pricelist, on_delete=models.CASCADE, related_name='rules')
    product_id = models.IntegerField(null=True, blank=True)
    min_quantity = models.FloatField(default=0)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    fixed_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
```

---

## PHASE 11 — MISSING MODULES (Stubs/Placeholders)

These modules exist in the codebase but are **100% placeholder** — they need full backend models + API + frontend pages:

| Module | What to Build |
|---|---|
| **Fleet** | Vehicle model (plate, brand, model, mileage, fuel_type, driver FK, state), Service records, Fuel logs, Contract (insurance/leasing) |
| **E-Learning** | Course, Lesson, Enrollment, Quiz, QuizQuestion, Certificate |
| **Planning** | Resource, Shift, ShiftTemplate, ResourceAllocation, WorkCalendar |
| **PLM** | ProductRevision, ChangeOrder, BOMVersion, ApprovalStep |
| **Quality** | QualityPoint, QualityCheck, QualityAlert, QualityTeam |
| **Rental** | RentalOrder, RentalOrderLine, RentalReturn, DamageReport |
| **ESG** | EsgMetric, EsgReport, EsgGoal, EsgAudit |
| **Equity** | ShareClass, ShareIssue, ShareholdingRecord, CapTable |
| **SOC** | SecurityIncident, ThreatAlert, VulnerabilityReport, ComplianceCheck |
| **Expenses** | Expense, ExpenseSheet, ExpenseCategory, ExpensePolicy |
| **Events** | Event, EventRegistration, EventSpeaker, EventSponsor, EventTrack |
| **Surveys** | Survey, SurveyQuestion, SurveyResponse, SurveyAnswer |
| **WhatsApp** | WhatsAppTemplate, WhatsAppSession, WhatsAppMessage |
| **SMS** | SmsTemplate, SmsCampaign, SmsMessage |

For each of these, the minimum viable build is:
1. Complete `domain/models.py` with all core fields
2. ViewSet in `api/views.py` with CRUD + domain-specific actions  
3. Dashboard page + List page + Detail/Form page in frontend
4. API service in `frontend/src/core/api/`

---

## PHASE 12 — CROSS-CUTTING CONCERNS

### 12A. Chatter Integration on All Business Records
After building ChatterPanel (Phase 1A), add `<ChatterPanel>` to the detail page of:
- CRM Deal, CRM Lead, CRM Client
- Helpdesk Ticket
- Manufacturing Order
- Purchase Order
- Sales Order/Quote
- Project Task
- HR Employee, Leave Request
- Payslip

### 12B. Activity Badge in Navigation
**File**: `frontend/src/core/layouts/EnterpriseLayout.jsx` (or equivalent nav layout)

Add an activity count badge to the top navigation bar:
- On mount, call `GET /api/v1/core/activities/my-activities/` to get count of overdue/today activities
- Show orange dot/badge on the "Activities" nav item
- Refresh every 5 minutes

### 12C. Global Search Enhancement  
**File**: `frontend/src/core/components/GlobalSearch.jsx`

Currently exists. Enhance to search across ALL modules:
- `GET /api/v1/core/search/?q={term}&limit=5` — need to create this endpoint
- Backend: searches across Lead.title, Deal.title, Ticket.title, Employee.name, Product.name simultaneously using Django `Q()` objects
- Returns grouped results: `{ crm: [...], helpdesk: [...], inventory: [...] }`

### 12D. Notification System  
**File**: `backend/apps/notifications/domain/models.py` — verify exists  
**File**: `frontend/src/core/context/NotificationContext.jsx` — verify exists  

Ensure WebSocket or polling-based notification system is connected to the Chatter system: when a message is posted on a record, generate a `Notification` for all followers.

---

## TECHNICAL NOTES FOR AI BUILDER

### Backend Patterns (follow these exactly):
```python
# All ViewSets must follow this pattern:
class ExampleViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ExampleSerializer
    
    def get_queryset(self):
        qs = Example.objects.filter(is_deleted=False)
        if hasattr(self.request.user, 'tenant') and self.request.user.tenant:
            qs = qs.filter(tenant=self.request.user.tenant)
        return qs
    
    def perform_create(self, serializer):
        tenant = getattr(self.request.user, 'tenant', None)
        serializer.save(tenant=tenant, created_by=self.request.user)
```

### Frontend Patterns (follow these exactly):
```javascript
// All service files follow this pattern:
import client from './client';  // axios instance with auth interceptors

export const exampleService = {
    getAll: async (params = {}) => {
        const response = await client.get('example/', { params });
        return response.data?.data ?? response.data?.results ?? response.data;
    },
    getById: async (id) => {
        const response = await client.get(`example/${id}/`);
        return response.data?.data ?? response.data;
    },
    create: async (data) => {
        const response = await client.post('example/', data);
        return response.data?.data ?? response.data;
    },
    update: async (id, data) => {
        const response = await client.patch(`example/${id}/`, data);
        return response.data?.data ?? response.data;
    },
    delete: async (id) => client.delete(`example/${id}/`),
};
```

### API Response Envelope (backend must use this):
```python
# Success:
return Response({'success': True, 'data': serializer.data}, status=200)
# Error:
return Response({'success': False, 'error': 'message', 'details': {}}, status=400)
```

### Migration Policy:
After adding models, create a migration file in `backend/apps/{app}/migrations/` following the existing numbering pattern (check highest existing number and increment by 1). Migration filename: `{next_number}_{descriptive_name}.py`

### Django `manage.py` Command:
Use the virtual environment Python at: `C:\Users\youne\Desktop\2-InfoTech\website\website13\backend\venv\Scripts\python.exe`
Command: `venv\Scripts\python.exe manage.py makemigrations {app_name} --name {name}`

---

## IMPLEMENTATION ORDER (Recommended)

```
Week 1:  Phase 1 (Shared Components) + Phase 2 (CRM)
Week 2:  Phase 3 (Helpdesk) + Phase 4 (MRP)
Week 3:  Phase 5 (Inventory) + Phase 6 (Accounting) 
Week 4:  Phase 7 (HRM) + Phase 8 (Projects) + Phase 9 (Payroll)
Week 5:  Phase 10 (Purchase/Sales) + Phase 12 (Cross-cutting)
Week 6+: Phase 11 (Stub modules — one per day)
```

---

## FILE STRUCTURE REFERENCE

```
backend/
  apps/
    core/           ← Base models, Chatter system, API utilities
    crm/            ← CRM (Lead, Deal, Client, Contact, Stage, Team)
    helpdesk/       ← Support tickets, SLA, Knowledge base
    mrp/            ← Manufacturing orders, BOM, Work orders
    inventory/      ← Stock, warehouse, transfers, lots
    accounting/     ← Invoices, journals, payments, taxes
    hrm/            ← Employees, departments, contracts, payroll
    projects/       ← Projects, tasks, sprints, time logs
    purchase/       ← PO, RFQ, vendors, goods receipt
    sale/           ← Quotes, orders, pricelist
    [+ 30 more apps...]

frontend/
  src/
    core/
      api/          ← All service files (crmService.js, etc.)
      components/
        shared/
          chatter/  ← ChatterPanel.jsx [TO BUILD]
          forms/    ← StatusBar.jsx, RecordFormLayout.jsx [TO BUILD]
          views/    ← KanbanBoard.jsx, DataTable.jsx [TO BUILD]
          navigation/ ← BreadcrumbNav.jsx [TO BUILD]
      layouts/      ← Enterprise layout with sidebar nav
    apps/
      crm/          ← CRM module pages
      helpdesk/     ← Helpdesk pages
      mrp/          ← Manufacturing pages
      inventory/    ← Inventory pages
      [+ 50 more app dirs...]
```
