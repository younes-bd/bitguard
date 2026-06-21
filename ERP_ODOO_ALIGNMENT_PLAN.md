# ERP Suite — Odoo Enterprise Full Alignment Plan
# File: ERP_ODOO_ALIGNMENT_PLAN.md
# Created: 2026-06-18

## Background

The `erp.0003` migration has been applied, successfully dropping the legacy `ErpDocument` vault
from the database. The EDMS module is now the single source of truth for all documents.

This plan reorders and fully aligns the **entire ERP suite** with Odoo Enterprise architecture —
both structurally (folder layout, model hierarchy) and functionally (missing workflows, signals,
services, and cross-module integrations).

---

## Architecture Comparison: Current vs Odoo

| Odoo Enterprise Module         | BitGuard Module                  | Status                             |
|-------------------------------|----------------------------------|------------------------------------|
| `sale` / Sales                | `crm` (Lead → Deal)              | ⚠️ Partial — missing Sale Order    |
| `account` / Accounting        | `accounting`                     | ⚠️ Partial — missing vendor flow   |
| `project`                     | `projects` + `erp.InternalProject` | ❌ Duplicated — needs consolidation |
| `purchase`                    | `scm` (Vendor + PO)              | ⚠️ Partial — no 3-way match        |
| `stock` / Inventory           | `scm` (InventoryItem)            | ⚠️ Partial — no moves/valuation    |
| `hr`                          | `hrm`                            | ⚠️ Partial — no payroll/timesheet  |
| `mrp`                         | None                             | ❌ Missing                         |
| `maintenance`                 | `itam` / `itsm`                  | ⚠️ Partial                         |
| `website`                     | `website` / `cms`                | ⚠️ Partial                         |
| `helpdesk`                    | `support`                        | ✅ Present                         |
| `sign` / Documents            | `edms`                           | ✅ Now centralized                 |
| `approval`                    | `approvals`                      | ✅ Present                         |

---

## Critical Issues Found (Deep Audit Results)

### 1. Duplicated Project Models 🔴
- `erp.InternalProject` (with Sprint, TaskStage, ProjectTask, TaskComment, TaskAttachment)
- `projects.Project` (with Task, Milestone, TimeLog)
- **These are two separate, parallel project systems.** Odoo has ONE project module.

### 2. Missing Sale Order Flow 🔴
- CRM has `Lead → Deal` but no **Sale Order** model (Odoo: `sale.order`, `sale.order.line`)
- No quotation → confirmation → delivery → invoice automated workflow

### 3. Missing Purchase Flow Completeness 🟡
- SCM has `PurchaseOrder` but no **3-way match** (PO → Receipt → Vendor Bill)
- No `vendor_bill.purchase_order` link

### 4. Missing Timesheet & Attendance in HRM 🟡
- No `Timesheet` entry per employee per project
- No `Attendance` (check-in / check-out) model
- No `Payslip` or `PayrollRun`

### 5. Missing Analytic Accounts (Odoo Core) 🟡
- No `analytic.account` — the glue between Projects, Invoices, Expenses and the P&L
- This is the heart of Odoo's cost and profitability tracking

### 6. Missing Inventory Moves / Valuation 🟠
- `InventoryItem` is a static snapshot — no `StockMove` (IN/OUT trail)
- No FIFO/Average cost valuation

### 7. `erp` App Role Ambiguity 🟠
- `erp` still holds `CompanySettings`, `Sequence`, `CostCenter`, `BudgetLine`, `Risk`, `Sprint`
- These should be redistributed:
  - `CompanySettings` → `core` or `erp` (as config)
  - `CostCenter` / `BudgetLine` → `accounting`
  - `Risk` → `projects` (project risks)
  - `Sprint` / `TaskStage` / `ProjectTask` → `projects` (consolidate)
  - `Sequence` → `core`

### 8. Missing Odoo-Style Service Layer 🟠
- Views directly query models. Odoo uses a **service/use-case layer** per operation.
- Missing: `InvoiceService`, `StockService`, `PayrollService`, `SaleOrderService`

---

## Proposed Changes

---

### Phase 1 — Consolidate Project Management

#### [MODIFY] `apps/projects/domain/models.py`
- Absorb `erp.Sprint`, `erp.TaskStage`, `erp.ProjectTask`, `erp.TaskComment`, `erp.TaskAttachment`
- Add `Milestone` model (with due date and linked tasks)
- Add `Timesheet` model (employee, project, task, hours, date, description)
- Add `ProjectRisk` model (absorbed from `erp.Risk`)
- Add `ProjectTag` model
- Add `project_type` kanban support fields
- Link `Project` → `analytic_account` FK

#### [MODIFY] `apps/erp/domain/models.py`
- Remove `Sprint`, `TaskStage`, `ProjectTask`, `TaskComment`, `TaskAttachment`, `Risk`
- Keep only: `CostCenter`, `BudgetLine`, `CompanySettings`, `Sequence`
- Generate migration `erp.0004_consolidate_to_projects`

---

### Phase 2 — Reorganize ERP Core Models

#### [MODIFY] `apps/accounting/domain/models.py`
- Move `CostCenter`, `BudgetLine` from `erp` into `accounting`
- Add `AnalyticAccount` model (central cost tracking — Odoo's `account.analytic.account`)
- Add `AnalyticLine` model (the actual cost/revenue entry — `account.analytic.line`)
- Add `BillLine` (line items for `VendorBill`)
- Add `PurchaseRequisition` model

#### [MODIFY] `apps/core/domain/models.py`
- Move `Sequence` from `erp` → `core`
- Add `UoM` (Unit of Measure) model
- Add `UoMCategory` model

---

### Phase 3 — Add Sale Order Workflow (CRM → Accounting Bridge)

#### [MODIFY] `apps/crm/domain/models.py`
- Add `SaleOrder` model:
  ```python
  class SaleOrder(TenantAwareModel):
      order_number = models.CharField(max_length=100)
      client = models.ForeignKey('crm.Client', on_delete=models.PROTECT)
      deal = models.ForeignKey('crm.Deal', on_delete=models.SET_NULL, null=True, blank=True)
      status = models.CharField(choices=[
          ('draft','Draft'),('sent','Sent'),('confirmed','Confirmed'),
          ('cancelled','Cancelled'),('done','Done')
      ], default='draft', max_length=20)
      date = models.DateField()
      expiry_date = models.DateField(null=True, blank=True)
      currency = models.CharField(max_length=10, default='USD')
      payment_terms = models.ForeignKey('accounting.PaymentTerms', null=True, blank=True, on_delete=models.SET_NULL)
      subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
      tax_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
      total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
      notes = models.TextField(blank=True)
  ```
- Add `SaleOrderLine` model

#### [NEW] `apps/crm/application/services.py`
- `SaleOrderService.confirm(order)` → creates `Invoice` + `Project` + `AnalyticLine` atomically

---

### Phase 4 — Complete Purchase / 3-Way Match

#### [MODIFY] `apps/scm/domain/models.py`
- Add `Receipt` model — goods receipt from vendor
- Add `ReceiptLine` — per-item confirmation of quantities received
- Link `accounting.VendorBill` → `scm.PurchaseOrder` (3-way match bridge)
- Add `StockMove` model — records every inventory in/out event with source document
- Add `StockValuation` configuration per `InventoryItem`

#### [NEW] `apps/scm/application/services.py`
- `ReceiptService.confirm(receipt)` → creates StockMoves, updates `InventoryItem.quantity_on_hand`, triggers VendorBill draft

---

### Phase 5 — Complete HRM: Timesheet, Attendance & Payroll

#### [MODIFY] `apps/hrm/domain/models.py`
- Add `Attendance`:
  ```python
  class Attendance(TenantAwareModel):
      employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
      check_in = models.DateTimeField()
      check_out = models.DateTimeField(null=True, blank=True)
  ```
- Add `TimesheetEntry`:
  ```python
  class TimesheetEntry(TenantAwareModel):
      employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
      project = models.ForeignKey('projects.Project', on_delete=models.CASCADE)
      task = models.ForeignKey('projects.Task', null=True, blank=True, on_delete=models.SET_NULL)
      date = models.DateField()
      hours = models.DecimalField(max_digits=5, decimal_places=2)
      description = models.TextField(blank=True)
      is_billable = models.BooleanField(default=True)
  ```
- Add `PayrollStructure`, `Payslip`, `PayrollRun`
- Add `ExpenseReport` (groups `accounting.Expense` for approval)

#### [NEW] `apps/hrm/application/services.py`
- `PayrollService.run(period, employees)` → creates Payslips + AnalyticLines
- `TimesheetService.billable_hours(project)` → returns hours eligible for invoicing

---

### Phase 6 — Add Analytic Accounts

#### [MODIFY] `apps/accounting/domain/models.py`
```python
class AnalyticAccount(TenantAwareModel):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, blank=True)
    project = models.OneToOneField('projects.Project', null=True, blank=True, on_delete=models.SET_NULL)
    account_type = models.CharField(
        choices=[('project','Project'),('department','Department'),('product','Product')],
        max_length=30, default='project'
    )

class AnalyticLine(TenantAwareModel):
    account = models.ForeignKey(AnalyticAccount, on_delete=models.CASCADE, related_name='lines')
    date = models.DateField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    source_type = models.CharField(max_length=50)  # 'invoice', 'expense', 'timesheet', 'payroll'
    source_id = models.UUIDField()
    employee = models.ForeignKey('hrm.Employee', null=True, blank=True, on_delete=models.SET_NULL)
    description = models.TextField(blank=True)
```

---

### Phase 7 — Service Layer (Use Cases per Module)

| Service | Module | Key Operations |
|---|---|---|
| `InvoiceService` | `accounting` | `.post()`, `.pay()`, `.cancel()`, `.send()` |
| `VendorBillService` | `accounting` | `.match(bill, po)`, `.post()`, `.pay()` |
| `SaleOrderService` | `crm` | `.confirm()`, `.cancel()`, `.invoice()` |
| `ReceiptService` | `scm` | `.confirm()`, `.validate()` |
| `PayrollService` | `hrm` | `.run(period)`, `.compute_payslip(emp)` |
| `TimesheetService` | `hrm` | `.billable_hours(project)`, `.approve()` |
| `ProjectService` | `projects` | `.create_from_sale_order()`, `.close()` |

---

### Phase 8 — Cross-Module Signals & Automation

**File: `apps/erp/signals.py`** (central signal dispatcher)

| Signal | Trigger | Effect |
|---|---|---|
| `sale_order_confirmed` | SO status → confirmed | Create `Project` + `Invoice` (draft) |
| `invoice_posted` | Invoice status → posted | Create `JournalEntry` + `AnalyticLine` |
| `invoice_paid` | Payment registered | Update project billing status, fire dunning reset |
| `purchase_order_received` | Receipt confirmed | Update `InventoryItem.quantity_on_hand` |
| `timesheet_approved` | Timesheet approved | Create `AnalyticLine` in accounting |
| `leave_approved` | Leave request approved | Block timesheet entries for that period |
| `payroll_run_completed` | Payroll run done | Post payslip expenses to accounting journal |

---

### Phase 9 — API Layer Completion

**New endpoints to add:**

| Method | Endpoint | Module | Description |
|---|---|---|---|
| `POST` | `/api/crm/sale-orders/{id}/confirm/` | crm | Confirm SO → Invoice + Project |
| `POST` | `/api/crm/sale-orders/{id}/cancel/` | crm | Cancel SO |
| `POST` | `/api/accounting/invoices/{id}/post/` | accounting | Lock and post invoice |
| `POST` | `/api/accounting/invoices/{id}/pay/` | accounting | Register payment |
| `POST` | `/api/accounting/invoices/{id}/send/` | accounting | Send to client portal |
| `POST` | `/api/scm/purchase-orders/{id}/receive/` | scm | Create goods receipt |
| `POST` | `/api/scm/receipts/{id}/validate/` | scm | Trigger 3-way match |
| `POST` | `/api/hrm/payroll-runs/` | hrm | Run payroll for period |
| `GET`  | `/api/hrm/employees/{id}/timesheets/` | hrm | Timesheet list per employee |
| `POST` | `/api/hrm/timesheets/{id}/approve/` | hrm | Approve timesheet entry |
| `GET`  | `/api/projects/{id}/analytics/` | projects | Costs vs budget |
| `GET`  | `/api/accounting/analytic-accounts/{id}/profitability/` | accounting | P&L per project |

---

### Phase 10 — Frontend Integration

For each new workflow, update the frontend (Vue/React) with:
- **Sale Order** kanban (Draft → Sent → Confirmed → Done)
- **3-way match UI** in SCM (PO → Receipt → Bill with status badge)
- **Timesheet grid** per project (week view, inline entry, billable toggle)
- **Payroll run wizard** (select period → preview payslips → post)
- **Analytic account** profitability card on Project detail page
- **Attendance dashboard** (check-in/out widget + daily summary)

---

## Open Questions (Answer Before Execution)

> **Q1** — `erp.InternalProject` consolidation:  
> Should it be fully deleted (requires data migration since `accounting.Invoice` has a FK to it)?  
> Recommended: Yes — migrate FK to `projects.Project` and delete the legacy model.

> **Q2** — Sale Order placement:  
> Should `SaleOrder` live inside `apps/crm/` or get its own `apps/sale/` app (like Odoo)?  
> Recommended: Own `apps/sale/` for cleaner separation of concerns.

> **Q3** — Payroll complexity:  
> Full rule-based payroll engine (Odoo style) or simple `base + allowances - deductions = net`?  
> Recommended: Simple formula engine first, rule-based as Phase 2.

> **Q4** — Inventory valuation:  
> **FIFO** (Odoo Enterprise default) or **Average Cost** (simpler to implement)?  
> Recommended: Average Cost first, FIFO configurable per product category.

---

## Execution Phases & Estimated Time

| Phase | Description | Est. Time |
|---|---|---|
| 1 | Consolidate Projects (erp → projects) | 2–3h |
| 2 | Reorganize ERP Core (CostCenter, Sequence) | 1–2h |
| 3 | Sale Order Workflow | 2–3h |
| 4 | Purchase 3-Way Match | 2h |
| 5 | HRM Timesheet & Payroll | 3h |
| 6 | Analytic Accounts | 1h |
| 7 | Service Layer | 3h |
| 8 | Signals & Automation | 1h |
| 9 | API Layer | 3–4h |
| 10 | Frontend | 4–6h |
| **Total** | | **~24–28h** |

---

## Verification Plan

### Automated Tests
```bash
python manage.py test apps.crm.tests
python manage.py test apps.accounting.tests
python manage.py test apps.projects.tests
python manage.py test apps.scm.tests
python manage.py test apps.hrm.tests
```

### Manual End-to-End Workflow Verification
1. **Sales flow**: Lead → Deal → Sale Order → Confirm → Invoice (draft) + Project auto-created
2. **Purchase flow**: PO → Receive goods → Validate → Vendor Bill auto-created → 3-way match
3. **Timesheet flow**: Log hours → Approve → AnalyticLine written to Accounting
4. **Payroll flow**: Run payroll for period → Payslips generated → Posted to accounting journal
5. **Invoice flow**: Post invoice → Send to client → Register payment → Reconcile → Dunning cleared
