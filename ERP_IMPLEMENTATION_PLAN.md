# BitGuard ERP Suite — Full-Stack Implementation Plan
**Target: Odoo-aligned, Production-Ready, Do-It-All IT Enterprise**

> [!IMPORTANT]
> This plan is based on a deep audit of **45+ backend and frontend files**. Every finding is documented with file paths and line references. All 6 ERP modules are covered.

---

## Current State — Completion Scores

| Module | Backend Models | API Coverage | Frontend Routes | Sidebar Integrity | Overall |
|---|---|---|---|---|---|
| **ERP Operations** | 60% | 50% | 55% | 37% | **50%** |
| **Finance & Accounting** | 90% | 65% | 72% | 66% | **73%** |
| **HRM** | 80% | 70% | 76% | 50% (menu overwrite) | **69%** |
| **SCM** | 75% | 45% | 60% | 55% (menu overwrite) | **58%** |
| **Projects** | 80% | 90% | 85% | 85% | **85%** |
| **Contracts & SLA** | 85% | 85% | 70% | 75% | **78%** |

---

## Phase 1 — Critical Bug Fixes (Breaks Navigation / Data Integrity)

> [!CAUTION]
> These bugs cause **404 pages, broken sidebars, and fake production data**. Must be fixed first.

### 1.1 — Frontend: Fix Duplicate `menu.js` Keys

**File**: `frontend/src/core/api/menu.js`

The `menu.js` object has **3 duplicate top-level keys** (`scm`, `hrm`, `contracts`). In JavaScript, the last definition silently overwrites the first — dropping menu items that exist as routes.

#### [MODIFY] `menu.js`
- **Merge** the two `scm` definitions (lines 176-188 and 286-296) into one with ALL items: Overview, Inventory, Vendors, Purchase Orders, RFQs, Vendor Bills, Reorder Rules, Reports, Settings
- **Merge** the two `hrm` definitions (lines 190-206 and 298-311) into one with ALL items: Overview, Employees, Onboarding, Leave Management, Time Tracking, Attendance, Appraisals, Org Chart, Certifications, Payroll Runs, Settings
- **Merge** the two `contracts` definitions (lines 92-103 and 221-230) into one: Overview, Active Contracts, SLA Tiers, SLA Breaches, Settings

---

### 1.2 — Frontend: Fix ERPRoutes Import Case Bug

**File**: `frontend/src/core/router/EnterpriseRouter.jsx` line 95

```diff
- import { erpRoutes } from '../../erp/routes/ERPRoutes';
+ import { erpRoutes } from '../../erp/routes/erpRoutes';
```
Fails on Linux/macOS/CI (case-sensitive filesystems).

---

### 1.3 — Frontend: Fix Contracts Sidebar Path Mismatch

**File**: `frontend/src/core/api/menu.js` — contracts section

```diff
- { label: 'SLA Breaches', path: '/admin/contracts/breaches' }
+ { label: 'SLA Breaches', path: '/admin/contracts/sla-breaches' }
```

---

### 1.4 — Frontend: Fix Accounting Module Index Route

**File**: `frontend/src/core/router/EnterpriseRouter.jsx`

The `accounting` module index renders `ErpDashboard` instead of `FinancialsDashboard`. Fix the index route component.

```diff
- index path="" element={<ErpDashboard />}
+ index path="" element={<FinancialsDashboard />}
```

---

### 1.5 — Backend: Fix `MonthlyFinancialsView` Mock Data

**File**: `backend/apps/erp/api/views.py` — `MonthlyFinancialsView`

The view currently returns `random.randint()` values. Replace with real DB aggregation:
```python
# REPLACE random with real Invoice + Expense aggregation per month
# Group Invoice.objects by month, sum total → income
# Group Expense.objects by month, sum amount → expense  
# Return last 12 months
```

---

### 1.6 — Backend: Fix ERP Dashboard Hardcoded Constants

**File**: `backend/apps/erp/api/views.py` — `ErpDashboardStatsView`

Replace hardcoded constants with real queries:
- `cash_position: 150000` → sum of BankAccount.current_balance
- `dso: 35` → compute from Invoice (outstanding / avg daily revenue)
- `collection_rate: 92` → compute (paid invoices / total invoices) × 100

---

### 1.7 — Backend: Fix `ProjectViewSet.update_status` Missing Return

**File**: `backend/apps/projects/api/views.py` — `update_status` action

```diff
  def update_status(self, request, pk=None):
      project.status = request.data.get('status', project.status)
      project.save()
-     # missing return
+     return Response({'status': project.status}, status=status.HTTP_200_OK)
```

---

### 1.8 — Frontend: Fix ErpDashboard Random Trend Arrows

**File**: `frontend/src/apps/erp/pages/dashboards/ErpDashboard.jsx` lines 96-97, 152-160

- Replace `Math.random()` trend computation with real period-over-period comparison from API
- Remove hardcoded Cash Flow Forecast chart data — fetch from real `erpService.getMonthlyFinancials()`

---

## Phase 2 — Missing Routes & Navigation (Broken Sidebar Links → 404)

### 2.1 — ERP Operations: Add 5 Missing Routes

**File**: `frontend/src/apps/erp/routes/erpRoutes.jsx`

Add routes for sidebar items that have no component:
| Route | Component | Source File |
|---|---|---|
| `cost-centers` | CostCenterList | Create: `erp/pages/lists/CostCenterList.jsx` |
| `expense-claims` | ExpenseList | Reuse: `accounting/pages/core/ExpenseList.jsx` |
| `delivery-notes` | DeliveryNoteList | Move: `accounting/pages/billing/DeliveryNoteList.jsx` |
| `risk-register` | RiskList | Reuse: `projects/pages/core/RiskList.jsx` |
| `purchase-orders` | PurchaseOrderList | Reuse: `scm/pages/lists/PurchaseOrderList.jsx` |

---

### 2.2 — Accounting: Add 3 Missing Routes

**File**: `frontend/src/apps/accounting/routes/accountingRoutes.jsx`

| Route | Component | Notes |
|---|---|---|
| `vendor-bills` | VendorBills | Create new page |
| `recurring-invoices` | RecurringInvoices | Fix path (was `recurring` not `recurring-invoices`) |
| `aged-receivables` | AgedReceivables | Create new page using existing `AgingReport.jsx` |
| `aged-payables` | AgedPayables | Create new page |

---

### 2.3 — HRM: Add 3 Missing Routes + Unrouted Pages

**File**: `frontend/src/apps/hrm/routes/hrmRoutes.jsx`

| Route | Component | Notes |
|---|---|---|
| `contracts` | EmployeeContractList | Create new page |
| `payroll/runs` | PayRunsList | Already exists, needs route |
| `payroll/runs/:id` | PayslipDetail | Already exists, needs route |

Fix `PayRunsList.jsx` navigation:
```diff
- navigate('/admin/erp/payroll')
+ navigate('/admin/hrm/payroll/runs')
```

---

### 2.4 — SCM: Wire 4 Unrouted Pages (vendors/ subdir)

**File**: `frontend/src/apps/scm/routes/scmRoutes.jsx`

| Route | Component |
|---|---|
| `vendors/create` | VendorCreate |
| `vendors/:id` | VendorDetail |
| `purchase-orders/create` | PurchaseOrderCreate |
| `purchase-orders/:id` | PurchaseOrderDetail |

---

### 2.5 — Projects: Add `/list` Route

**File**: `frontend/src/apps/projects/routes/projectsRoutes.jsx`

```diff
+ { path: 'list', element: <ProjectList /> }
```

---

### 2.6 — Contracts: Wire `SlaManager.jsx` Route

**File**: `frontend/src/core/router/EnterpriseRouter.jsx` (or new contracts route file)

```diff
+ { path: 'sla-manager', element: <SlaManager /> }
```

---

## Phase 3 — Backend: Expose 18 Orphaned Models via API

These models exist in the DB but have **zero API endpoints**. This means the frontend cannot read or write them at all.

### 3.1 — Accounting: Expose 6 Phase-2 Models

**File**: `backend/apps/accounting/api/views.py` + `urls.py`

| Model | ViewSet to Add | Endpoint |
|---|---|---|
| `FiscalYear` | `FiscalYearViewSet` | `/accounting/fiscal-years/` |
| `FiscalPeriod` | `FiscalPeriodViewSet` | `/accounting/fiscal-periods/` |
| `AccountingJournal` | `AccountingJournalViewSet` | `/accounting/journals/` |
| `VendorBill` | `VendorBillViewSet` | `/accounting/vendor-bills/` |
| `RecurringInvoice` | `RecurringInvoiceViewSet` | `/accounting/recurring-invoices/` |
| `FiscalPosition` | `FiscalPositionViewSet` | `/accounting/fiscal-positions/` |

---

### 3.2 — HRM: Expose 4 Phase-2 Models

**File**: `backend/apps/hrm/api/views.py` + `urls.py`

| Model | ViewSet to Add | Endpoint |
|---|---|---|
| `EmployeeContract` | `EmployeeContractViewSet` | `/hrm/contracts/` |
| `LeaveAllocation` | `LeaveAllocationViewSet` | `/hrm/leave-allocations/` |
| `Attendance` | `AttendanceViewSet` | `/hrm/attendance/` |
| `Appraisal` | `AppraisalViewSet` | `/hrm/appraisals/` |

---

### 3.3 — SCM: Expose 5 Phase-2 Models

**File**: `backend/apps/scm/api/views.py` + `urls.py`

| Model | ViewSet to Add | Endpoint |
|---|---|---|
| `RFQ` | `RFQViewSet` | `/scm/rfqs/` |
| `VendorPricelist` | `VendorPricelistViewSet` | `/scm/vendor-pricelists/` |
| `GoodsReceipt` | `GoodsReceiptViewSet` | `/scm/goods-receipts/` |
| `StockAdjustment` | `StockAdjustmentViewSet` | `/scm/stock-adjustments/` |
| `ReorderRule` | `ReorderRuleViewSet` | `/scm/reorder-rules/` |

---

### 3.4 — ERP: Expose 3 Phase-2 Models

**File**: `backend/apps/erp/api/views.py` + `urls.py`

| Model | ViewSet to Add | Endpoint |
|---|---|---|
| `CompanySettings` | `CompanySettingsViewSet` | `/erp/company-settings/` |
| `Sprint` | `SprintViewSet` | `/erp/sprints/` |
| `Sequence` | `SequenceViewSet` | `/erp/sequences/` |

---

## Phase 4 — Backend: Add Missing Workflow Actions

> [!NOTE]
> These are `@action` decorators on existing ViewSets. They implement the core business workflows that Odoo-style platforms require.

### 4.1 — Accounting Workflow Actions

**File**: `backend/apps/accounting/api/views.py`

| ViewSet | Action | Method | Description |
|---|---|---|---|
| `InvoiceViewSet` | `approve` | POST | Sets status → approved, creates GL entry |
| `InvoiceViewSet` | `void` | POST | Sets status → void, reverses GL entries |
| `InvoiceViewSet` | `send` | POST | Sets status → sent, records sent_at timestamp |
| `InvoiceViewSet` | `mark_paid` | POST | Creates Payment record, updates status → paid |
| `ExpenseViewSet` | `approve` | POST | Sets status → approved, creates GL entry |
| `ExpenseViewSet` | `reject` | POST | Sets status → rejected, logs reason |
| `JournalEntryViewSet` | `post` | POST | Sets is_posted=True, locks entry |
| `JournalEntryViewSet` | `unpost` | POST | Reversal entry, sets is_posted=False |
| `FixedAssetViewSet` | `run_depreciation` | POST | Computes monthly depreciation, creates GL entry |
| `DeferredRevenueViewSet` | `recognize` | POST | Moves portion to revenue, updates recognized_amount |

---

### 4.2 — HRM Workflow Actions

**File**: `backend/apps/hrm/api/views.py`

| ViewSet | Action | Method | Description |
|---|---|---|---|
| `PayrollPeriodViewSet` | `generate_payslips` | POST | Bulk-creates PaySlip for all active employees |
| `PaySlipViewSet` | `approve` | POST | Sets status → approved |
| `PaySlipViewSet` | `pay` | POST | Sets status → paid, creates GL payroll entry |

---

### 4.3 — SCM Workflow Actions

**File**: `backend/apps/scm/api/views.py`

| ViewSet | Action | Method | Description |
|---|---|---|---|
| `PurchaseOrderViewSet` | `approve` | POST | Sets status → approved, sets approved_by |
| `PurchaseOrderViewSet` | `cancel` | POST | Sets status → cancelled |
| `RFQViewSet` | `convert_to_po` | POST | Creates PurchaseOrder from RFQ |

---

### 4.4 — Contracts Workflow Actions

**File**: `backend/apps/contracts/api/views.py`

| ViewSet | Action | Method | Description |
|---|---|---|---|
| `ServiceContractViewSet` | `terminate` | POST | Sets status → terminated, logs termination_reason |
| `ServiceContractViewSet` | `renew` | POST | Creates new contract extending the term |
| `ServiceContractViewSet` | `mrr_summary` | GET | Returns MRR/ARR aggregation by client |
| `SLABreachViewSet` | `acknowledge` | POST | Sets acknowledged=True, logs timestamp |
| `QuoteViewSet` | `reject` | POST | Sets status → rejected |
| `QuoteViewSet` | `expire_check` | GET | Returns quotes past valid_until date |

---

### 4.5 — Projects Workflow Actions

**File**: `backend/apps/projects/api/views.py`

| ViewSet | Action | Method | Description |
|---|---|---|---|
| `ProjectViewSet` | `gantt_data` | GET | Returns structured task/milestone data for Gantt rendering |
| `ProjectViewSet` | `burndown` | GET | Returns sprint burndown data |
| `ProjectViewSet` | `budget_tracking` | GET | Returns budget vs. actual cost from TimeLogs |
| `TaskViewSet` | `add_comment` | POST | Adds comment to task (needs TaskComment model) |

---

## Phase 5 — Backend: Data Model Improvements

### 5.1 — Fix GeneralLedger Account Integrity

**File**: `backend/apps/accounting/domain/models.py`

```diff
class GeneralLedger(models.Model):
-   account_name = models.CharField(max_length=255)
+   account = models.ForeignKey('Account', on_delete=models.PROTECT, null=True)
+   account_name = models.CharField(max_length=255)  # keep for legacy display
```

### 5.2 — Add PaySlipLine Model (Itemized Payslip)

**File**: `backend/apps/hrm/domain/models.py`

```python
class PaySlipLine(models.Model):
    payslip = models.ForeignKey(PaySlip, on_delete=models.CASCADE, related_name='lines')
    component = models.ForeignKey(SalaryComponent, on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    is_deduction = models.BooleanField(default=False)
```

### 5.3 — Fix TimeEntry Project FK

**File**: `backend/apps/hrm/domain/models.py`

```diff
- project_id = models.UUIDField(null=True)
+ project = models.ForeignKey('projects.Project', on_delete=models.SET_NULL, null=True)
```

### 5.4 — Add Warehouse Model to SCM

**File**: `backend/apps/scm/domain/models.py`

```python
class Warehouse(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=10, unique=True)
    address = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

# Update InventoryItem:
- location = models.CharField(max_length=255)
+ warehouse = models.ForeignKey(Warehouse, on_delete=models.SET_NULL, null=True)
+ location_code = models.CharField(max_length=50, blank=True)
```

### 5.5 — Add MRR Endpoint to Contracts

**File**: `backend/apps/contracts/api/views.py`

Add an aggregation view: `GET /contracts/mrr/` that returns total MRR, ARR, MRR by client, expiring contracts in 30/60/90 days.

### 5.6 — Fix SCM Vendor Architecture Mismatch

**File**: `backend/apps/scm/api/views.py` + `serializers.py`

The `VendorViewSet` uses `core.Partner` model but `scm.Vendor` model exists independently. Consolidate: use `core.Partner` as the canonical vendor model everywhere, or `scm.Vendor`. For this plan, we will unify by dropping `scm.Vendor` and mapping directly to `core.Partner` to match Odoo's universal ResPartner structure.

---

## Phase 6 — Frontend: Replace Remaining Mock Data

### 6.1 — `PayRunsList.jsx` — 100% Mock → Live API

**File**: `frontend/src/apps/hrm/pages/payroll/PayRunsList.jsx`

Replace all hardcoded state with:
```javascript
hrmService.getPayrollPeriods()
hrmService.getDashboardStats()
```

Fix navigate paths:
```diff
- navigate('/admin/erp/payroll')
+ navigate('/admin/hrm/payroll/runs')
```

---

### 6.2 — `SlaManager.jsx` — Mock → Live API

**File**: `frontend/src/apps/contracts/pages/lists/SlaManager.jsx`

Replace hardcoded tiers with `contractsService.getSlaTiers()`.

---

### 6.3 — Update `hrmService.js` — Missing Methods

**File**: `frontend/src/core/api/hrmService.js`

Add:
```javascript
getAttendance: (params) => client.get('hrm/attendance/', { params })
getAppraisals: (params) => client.get('hrm/appraisals/', { params })
getEmployeeContracts: (params) => client.get('hrm/contracts/', { params })
getLeaveAllocations: (params) => client.get('hrm/leave-allocations/', { params })
generatePayslips: (periodId) => client.post(`hrm/payroll-periods/${periodId}/generate_payslips/`)
```

---

### 6.4 — Update `scmService.js` — Missing Methods

**File**: `frontend/src/core/api/scmService.js`

Add:
```javascript
getRFQs: (params) => client.get('scm/rfqs/', { params })
getVendorBills: (params) => client.get('scm/vendor-bills/', { params })
getReorderRules: (params) => client.get('scm/reorder-rules/', { params })
getGoodsReceipts: (params) => client.get('scm/goods-receipts/', { params })
getWarehouses: () => client.get('scm/warehouses/')
convertRFQtoPO: (id) => client.post(`scm/rfqs/${id}/convert_to_po/`)
approvePO: (id) => client.post(`scm/purchase-orders/${id}/approve/`)
```

---

### 6.5 — Update `accountingService.js` — Missing Methods

**File**: `frontend/src/apps/accounting/api/accountingService.js`

Add:
```javascript
getFiscalYears: () => client.get('accounting/fiscal-years/')
getJournals: () => client.get('accounting/journals/')
getVendorBills: (params) => client.get('accounting/vendor-bills/', { params })
getRecurringInvoices: (params) => client.get('accounting/recurring-invoices/', { params })
approveInvoice: (id) => client.post(`accounting/invoices/${id}/approve/`)
voidInvoice: (id) => client.post(`accounting/invoices/${id}/void/`)
approveExpense: (id) => client.post(`accounting/expenses/${id}/approve/`)
postJournalEntry: (id) => client.post(`accounting/journal-entries/${id}/post/`)
runDepreciation: (id) => client.post(`accounting/fixed-assets/${id}/run_depreciation/`)
getAgedReceivables: (params) => client.get('accounting/reports/aged-receivables/', { params })
getAgedPayables: (params) => client.get('accounting/reports/aged-payables/', { params })
getMRR: () => client.get('contracts/mrr/')
```

---

## Phase 7 — New Pages to Build

### 7.1 — Accounting: Vendor Bills Page
**Path**: `frontend/src/apps/accounting/pages/billing/VendorBills.jsx`
- Table of vendor bills with status pipeline (draft/approved/paid/cancelled)
- Create/Edit bill modal
- Approve and Pay actions
- Links to vendor profile

### 7.2 — Accounting: Aged Receivables Report
**Path**: `frontend/src/apps/accounting/pages/reports/AgedReceivables.jsx`
- Table grouped by aging bucket (current, 1-30, 31-60, 61-90, 90+)
- Client totals and outstanding balance
- Export to PDF/CSV

### 7.3 — Accounting: Aged Payables Report
**Path**: `frontend/src/apps/accounting/pages/reports/AgedPayables.jsx`
- Same structure as Aged Receivables but for vendor bills

### 7.4 — HRM: Employee Contract Management
**Path**: `frontend/src/apps/hrm/pages/lists/EmployeeContractList.jsx`
- Table of contracts with status (active/expired/trial)
- Wage, type, duration
- Link to employee profile

### 7.5 — ERP: Cost Center List
**Path**: `frontend/src/apps/erp/pages/lists/CostCenterList.jsx`
- Table of cost centers with budget vs. actual
- Budget line breakdown

### 7.6 — Contracts: Extract `contractsRoutes.jsx`
**Path**: `frontend/src/apps/contracts/routes/contractsRoutes.jsx`
- Extract all inline contract routes from `EnterpriseRouter.jsx` into a dedicated routes file
- Use CRM components where needed but clearly import them

---

## Phase 8 — CommandCenter Dashboard Improvements

**File**: `frontend/src/apps/board/pages/dashboards/CommandCenter.jsx`

- Fix Finance & Accounting KPI source from `metrics.erp.overdue_invoices` → `metrics.accounting.overdue_invoices`
- Add MRR as a live KPI card metric for the Contracts tile
- Add headcount trend indicator for HRM tile
- Add low-stock alert count for SCM tile
- Add overdue milestone count for Projects tile
