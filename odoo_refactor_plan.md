# BitGuard Backend — Odoo-Aligned Architecture Refactor

## Goal

Restructure the Django backend to mirror **Odoo Enterprise's modular architecture** — where every
business domain owns its data, models are never duplicated, and the ERP acts as an orchestration
layer (not a monolithic god-module).

---

## 📊 Current State Audit vs. Odoo Architecture

| BitGuard (Current) | Odoo Equivalent | Problem |
|---|---|---|
| `crm.Client` | `res.partner` (customer) | Clients can't be vendors at the same time |
| `scm.Vendor` | `res.partner` (supplier) | Separate Vendor model from Clients |
| `erp.ErpVendor` | `res.partner` (supplier) | **DUPLICATE** of `scm.Vendor` |
| `erp.ErpPurchaseOrder` | `purchase.order` | **DUPLICATE** of `scm.PurchaseOrder` |
| `erp.Invoice` | `account.move` | Belongs in Accounting, not ERP |
| `erp.Account`, `JournalEntry`, etc. | `account.account`, `account.move.line` | Should be a dedicated `accounting` app |
| `hrm.PayrollPeriod` + `erp.PayrollPeriod` | `hr.payslip`, `hr.payroll.period` | **DUPLICATE** Payroll models |
| `billing.Invoice` | `account.move` | **DUPLICATE** of `erp.Invoice` |

> **CAUTION:** There are **3 duplicate Invoice models** (`billing.Invoice`, `erp.Invoice`,
> `erp.CreditNote`) and **2 duplicate Payroll models** (`hrm.PayrollPeriod` and
> `erp.PayrollPeriod`). This will cause data integrity issues at scale.

---

## 🎯 Target Architecture (Odoo-Aligned)

```
apps/
├── core/          → Base models, TenantAwareModel, Partner (unified contact)
├── crm/           → Leads, Deals, pipeline (reads Partner)
├── accounting/    → Chart of Accounts, Journal Entries, Invoices, Bills, Payments, Credit Notes
├── scm/           → Vendors (via Partner), Purchase Orders, Inventory, Warehouses
├── hrm/           → Employees, Leave, Onboarding, Payroll (owns ALL payroll)
├── billing/       → SaaS Plans, Subscriptions, Stripe (platform billing only — NOT client invoicing)
├── erp/           → ERP Dashboard, aggregated KPIs, cross-module reports (THIN LAYER)
└── ... (itsm, soc, projects, etc. unchanged)
```

---

## 🔴 PHASE 1 — Centralize the Partner Model
### Add a unified `Partner` to `core` (like `res.partner` in Odoo)

**The Problem:** In Odoo, every company or person is a single `res.partner` record. A partner can
be a customer, supplier, or both. Currently BitGuard has `crm.Client`, `scm.Vendor`, and
`erp.ErpVendor` as three separate, disconnected models.

**The Goal:** Add a `Partner` model to `apps/core` that replaces all three and serves as the
universal contact registry.

---

### [MODIFY] `apps/core/models.py`

Add the `Partner` model:

```python
class Partner(TenantAwareModel):
    PARTNER_TYPES = [
        ('customer', 'Customer'),
        ('supplier', 'Supplier'),
        ('both', 'Customer & Supplier'),
        ('internal', 'Internal'),
    ]
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    website = models.URLField(blank=True)
    address = models.TextField(blank=True)
    country = models.CharField(max_length=100, blank=True)
    tax_id = models.CharField(max_length=100, blank=True)
    partner_type = models.CharField(max_length=20, choices=PARTNER_TYPES, default='customer')
    payment_terms = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    # Credit limit (for AR/AP management)
    credit_limit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
```

### [MODIFY] `apps/crm/domain/models.py`
- Add `partner = models.OneToOneField('core.Partner', ...)` to `Client`
- Run data migration to backfill all existing Client records into Partner

### [MODIFY] `apps/scm/domain/models.py`
- Replace `Vendor` model — point `inventory_items` and `purchase_orders` to `core.Partner`
  with `partner_type='supplier'`
- Keep `Vendor` as a **proxy model** or deprecation alias for one migration cycle

### [DELETE] `apps/erp/domain/models.py` — Remove `ErpVendor`
- Delete the model entirely (after migration)
- Update `erp.ErpPurchaseOrder` FK to point to `core.Partner`

---

## 🟠 PHASE 2 — Consolidate SCM: One Purchase Order to Rule Them All
### Make `scm.PurchaseOrder` the authoritative model

**The Problem:** `erp.ErpPurchaseOrder` is a duplicate of `scm.PurchaseOrder`. The only
difference is that the ERP version adds financial fields (subtotal, tax_total). This should
be merged into a single model.

**The Goal:** Merge financial fields into `scm.PurchaseOrder`, delete `erp.ErpPurchaseOrder`,
and have the ERP API simply proxy requests to the SCM app.

---

### [MODIFY] `apps/scm/domain/models.py` — Enhance `PurchaseOrder`

Add the following accounting fields from `erp.ErpPurchaseOrder`:

```python
# Financial fields (from erp.ErpPurchaseOrder)
po_number = models.CharField(max_length=100, blank=True)
subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
tax_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
approved_by = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
# Link to Accounting Bill (Phase 3)
bill = models.ForeignKey('accounting.AccountingDocument', null=True, blank=True,
                          on_delete=models.SET_NULL, related_name='purchase_orders')
```

### [MODIFY] `apps/erp/api/views.py` — `PurchaseOrderViewSet`
- Change queryset source from `erp.ErpPurchaseOrder` → `scm.PurchaseOrder`
- The URL `/api/erp/purchase-orders/` remains unchanged (zero frontend rewrites)

### [MODIFY] `apps/erp/api/views.py` — `VendorViewSet`
- Change queryset source from `erp.ErpVendor` → `core.Partner`
  filtered by `partner_type__in=['supplier', 'both']`

### [DELETE] `apps/erp/domain/models.py`
- Remove `ErpVendor` class
- Remove `ErpPurchaseOrder` class
- Remove `ErpPurchaseOrderItem` class

> **NOTE: Frontend contract is preserved.** The ERP frontend keeps calling
> `/api/erp/purchase-orders/` and `/api/erp/vendors/`. Only the backend data
> source changes. Zero frontend rewrites needed.

---

## 🟡 PHASE 3 — Extract the `accounting` App
### Move all financial accounting models out of ERP into a dedicated app

**The Problem:** Odoo's `account` module is one of its most powerful standalone apps. In
BitGuard, all accounting logic is buried inside the already-massive `erp` app. Invoices
belong to accounting. Journal entries belong to accounting. Chart of Accounts belongs to
accounting.

**The Goal:** Create a new `apps/accounting/` Django app and migrate all financial models
into it.

---

### [NEW] `apps/accounting/` — New Django App

**Models to MOVE from `erp` into `accounting`:**

| Model | Notes |
|---|---|
| `Invoice` | Becomes `AccountingDocument` (covers invoices, bills, credit notes via `doc_type` field — like Odoo's `account.move`) |
| `InvoiceItem` | Becomes `AccountingDocumentLine` |
| `Payment` | Client and vendor payment records |
| `CreditNote` | Merge into `AccountingDocument` with `doc_type='credit_note'` |
| `Account` | Chart of Accounts |
| `JournalEntry` + `JournalEntryLine` | Double-entry accounting |
| `BankAccount` + `BankTransaction` | Banking & cash management |
| `BankReconciliation` | Bank statement matching |
| `TaxConfig` + `TaxGroup` + `TaxAuthority` | Full tax engine |
| `PaymentTerms` | Payment terms configuration |
| `InvoiceBranding` | PDF branding configuration |
| `DeferredRevenue` | Revenue recognition scheduling |
| `GeneralLedger` | Replace with proper `JournalEntryLine` queries |
| `FixedAsset` | Asset management and depreciation |
| `Currency` + `ExchangeRate` | Multi-currency support |

**Models that STAY in `erp`:**
- `Expense` + `CostCenter` + `BudgetLine` — operational cost management
- `InternalProject` + `Risk` — project and risk register
- `DunningWorkflow` — collections workflow config (references `accounting` data)
- `RecurringInvoice` — billing schedule (creates `accounting.Invoice`)
- `ErpDocument` — document vault

### [MODIFY] `billing/domain/models.py`
- **Delete** `billing.Invoice` — it is a Stripe receipt stub, not an accounting invoice
- Keep only `Plan`, `Subscription`, and `BillingSettings` — these are SaaS-specific and correct

### [MODIFY] `apps/erp/api/views.py`
After extraction, update all imports:
- `InvoiceViewSet` → queryset from `accounting.domain.models.AccountingDocument`
- `PaymentViewSet` → queryset from `accounting.domain.models.Payment`
- `CreditNoteViewSet` → queryset from `accounting.domain.models.AccountingDocument`
  (filtered by `doc_type='credit_note'`)
- All other accounting ViewSets → queryset from `accounting`

---

## 🔵 PHASE 4 — Consolidate Payroll into HRM
### `hrm` owns all HR and Payroll. `erp` only references it.

**The Problem:** Phase 4 of the previous ERP audit created `PayrollPeriod`, `SalaryComponent`,
and `PaySlip` inside `erp/domain/models.py`. However, `hrm/domain/models.py` **already has**
`PayrollPeriod` and `PayrollRecord` models. This is a direct duplication.

**The Goal:** Delete the payroll models from `erp`, enrich `hrm` with the missing
`SalaryComponent` and `PaySlip` models, and have the ERP Payroll Dashboard simply read
from the `hrm` app.

---

### [MODIFY] `apps/hrm/domain/models.py` — Add missing models

```python
class SalaryComponent(TenantAwareModel):
    """Named earning or deduction rule applied to a payslip."""
    COMPONENT_TYPES = [
        ('earning', 'Earning'),
        ('deduction', 'Deduction'),
    ]
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=COMPONENT_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    is_taxable = models.BooleanField(default=True)

class PaySlip(TenantAwareModel):
    """Enterprise payslip with full line-item support (replaces PayrollRecord)."""
    employee = models.ForeignKey('hrm.Employee', on_delete=models.CASCADE,
                                  related_name='payslips')
    period = models.ForeignKey('hrm.PayrollPeriod', on_delete=models.CASCADE,
                                related_name='payslips')
    basic_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_earnings = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    net_pay = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20,
        choices=[('draft', 'Draft'), ('approved', 'Approved'), ('paid', 'Paid')],
        default='draft')
    # Links to the double-entry journal entry created when payroll is processed
    journal_entry = models.ForeignKey('accounting.JournalEntry',
                                       on_delete=models.SET_NULL, null=True, blank=True)
    class Meta:
        unique_together = ('tenant', 'employee', 'period')
```

### [DELETE] `apps/erp/domain/models.py`
- Remove `PayrollPeriod` (duplicate of `hrm.PayrollPeriod`)
- Remove `SalaryComponent` (move to `hrm`)
- Remove `PaySlip` (move to `hrm`)

### [MODIFY] `apps/erp/api/views.py` — Payroll ViewSets
- Import `PayrollPeriod`, `PaySlip` from `hrm.domain.models`

### [MODIFY] `apps/erp/api/serializers.py`
- Move `PayrollPeriodSerializer`, `SalaryComponentSerializer`, `PaySlipSerializer`
  to `hrm/api/serializers.py`

---

## 🟢 PHASE 5 — Slim the ERP into an Orchestration Layer
### ERP becomes the umbrella dashboard — like Odoo's ERP Overview app

After Phases 1–4, the ERP app becomes **thin, clean, and fast**:

**What ERP owns after refactor:**
- `Expense` + `CostCenter` + `BudgetLine` — operational spend management
- `InternalProject` + `Risk` — project and risk register
- `DunningWorkflow` — collections config (references `accounting` data)
- `RecurringInvoice` — billing schedule (creates `accounting.Invoice`)
- `ErpDocument` — document vault

**What ERP reads from other modules (cross-module queries):**
- Invoices & Payments → reads from `accounting`
- Vendors & Purchase Orders → reads from `scm` (via `core.Partner`)
- Employees & Payroll → reads from `hrm`
- Clients → reads from `crm` (via `core.Partner`)

**The `erp/dashboard/` API endpoint remains unchanged.** It aggregates KPIs by
querying across modules — exactly like Odoo's `board` module.

---

## 🗂️ Final Django `INSTALLED_APPS` Order (Dependency-Aware)

```python
INSTALLED_APPS = [
    # Django internals
    'django.contrib.admin',
    'django.contrib.auth',
    # ...

    # Core infrastructure — no cross-app dependencies
    'apps.core',        # Partner, BaseModel, TenantAwareModel
    'apps.tenants',     # Multi-tenancy
    'apps.auth',
    'apps.users',

    # Business logic — ordered by dependency (deepest first)
    'apps.crm',         # Reads core.Partner → customers/leads/deals
    'apps.accounting',  # Reads crm.Client, core.Partner → NEW dedicated accounting app
    'apps.scm',         # Reads core.Partner, accounting.JournalEntry → purchasing/inventory
    'apps.hrm',         # Owns Employee + Payroll (reads accounting for journal entries)
    'apps.erp',         # Orchestration layer: aggregates all of the above
    'apps.billing',     # SaaS: Plans + Subscriptions + Stripe only

    # Domain modules — read from core + erp as needed
    'apps.contracts',
    'apps.projects',
    'apps.itsm',
    'apps.soc',
    'apps.itam',
    'apps.marketing',
    'apps.documents',
    'apps.notifications',
    'apps.reports',
    'apps.portal',
    'apps.store',
    'apps.support',
    'apps.sysadmin',
    'apps.website',
    'apps.blog',
    'apps.cms',
    'apps.audit',
    'apps.approvals',
]
```

---

## ✅ Verification Plan

### Automated (run after each phase)
```bash
python manage.py check                  # No system check errors
python manage.py makemigrations --check # No unmigrated model changes
python manage.py test apps.erp          # All ERP tests pass
python manage.py test apps.accounting   # All accounting tests pass (Phase 3+)
python manage.py test apps.hrm          # All HRM/payroll tests pass (Phase 4+)
```

### API Contract Verification (manual)
After each phase, verify these endpoints still return correct data:
- `GET /api/erp/vendors/` → returns list (source: `core.Partner`)
- `GET /api/erp/purchase-orders/` → returns list (source: `scm.PurchaseOrder`)
- `GET /api/erp/invoices/` → returns list (source: `accounting.AccountingDocument`)
- `GET /api/erp/payroll/` → payroll dashboard loads from `hrm` data

### Data Migration Safety Rules
- All migrations use `RunPython` with safe `apps.get_model()` calls
- No destructive `DROP TABLE` until a confirmed backfill migration has run successfully
- All ForeignKey changes use `db_constraint=False` during the migration window
- Each phase must pass `python manage.py check` before proceeding to the next

---

## ⚠️ Open Questions (To Address Before Execution)

**Q1 — Stripe & Billing Invoice:**
`billing.Invoice` has a `stripe_invoice_id` field — it is a Stripe webhook receipt, not
a true accounting invoice. Before deleting it, Stripe webhook handlers must be updated
to write auto-paid invoices into `accounting.AccountingDocument`. Should Stripe
receipts flow directly into the Accounting ledger as auto-paid invoices, or should
platform billing remain separate from client accounting?

**Q2 — Migration Risk / Data Safety:**
Deleting `erp.ErpVendor` and `erp.ErpPurchaseOrder` requires a data migration to copy
records into `core.Partner` and `scm.PurchaseOrder`. Is this a development environment
where a clean migration is acceptable, or is there live production data that must be
preserved?

**Q3 — SCM API Surface:**
The `scm` app currently has no `api/` views of its own. After Phase 2, should we also
build a native SCM API (`/api/scm/purchase-orders/`, `/api/scm/inventory/`,
`/api/scm/vendors/`) for the Supply Chain Management frontend module? Or should the
ERP remain the sole API surface for all purchasing operations?
