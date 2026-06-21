# 📑 BitGuard — Unified Document Hub
## Long-Term Implementation Plan

> **Project**: BitGuard Enterprise Platform  
> **Module**: Reporting Engine → Unified Document Hub  
> **Date**: June 2026  
> **Architecture Reference**: Odoo `ir.actions.report` + `ir.attachment` pattern  

---

## Current State (Confirmed by Audit)

Your platform has a mature foundation. No rebuilding from scratch is needed.

| Layer | What Exists | Status |
|-------|-------------|--------|
| **Reporting Engine Backend** | `ReportTemplate`, `GeneratedReport`, `ReportEngineSettings` models. Full `ReportingService.generate_pdf()` (WeasyPrint + Django templates). API at `/api/reporting/`. | ✅ Architecturally complete |
| **Reporting Frontend** | `ReportingDashboard.jsx`, `TemplateManager.jsx`, `GeneratedDocuments.jsx`, Settings page. Sidebar entry in `menu.js` as "Document Reporting". | ✅ Exists, needs UX polish |
| **EDMS** | Document vault with versioning, workspaces, tagging, OCR. API at `/api/edms/`. | ✅ Exists, not connected to generated docs |
| **ErpDocument Vault** | Soft-linked document storage tied to Clients, Vendors, and Invoices. | ✅ Model exists, no frontend |
| **CRM DocGen** | 8 document templates (Proposals, SOW, MSA, SLA, etc.) printed via `window.print()`. | ✅ Functional, needs backend migration |
| **WeasyPrint** | Imported in `pdf_generator.py`, **not in `requirements.txt`**. | ❌ Blocking everything |

> **Key Decision**: The Reporting module **already IS** the intended unified document hub.
> It just needs to be: (1) activated via WeasyPrint, (2) connected to EDMS, (3) expanded with all missing templates.

---

## Design Principle: Keep Module Buttons, Unify the Engine

This is exactly how Odoo does it with `ir.actions.report`:

```
User clicks "Print Invoice" on /accounting/invoices/42/
    ↓
Frontend calls POST /api/reporting/generated/generate/
    { template_id: "invoice-template", record_model: "accounting.Invoice", record_id: 42 }
    ↓
ReportingService generates PDF → saves to GeneratedReport + EDMS
    ↓
Returns file URL → browser downloads it
    ↓
Same PDF is now visible in:
  • /accounting/invoices/42/          (module download button — UX shortcut)
  • /admin/reporting/generated/       (Document Hub — history & management)
  • /edms/                            (Document Vault — permanent archive)
```

**The "Download PDF" button in every module stays. It just routes through the central engine.**

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       DOCUMENT SOURCES                           │
│                                                                  │
│  Accounting   SCM      HRM      Contracts   Projects   CRM      │
│  (Invoices)  (POs)  (Payslips)  (Quotes)    (SOW)  (Proposals) │
└───────────────────────────┬─────────────────────────────────────┘
                            │  POST /api/reporting/generated/generate/
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                 REPORTING ENGINE  (/admin/reporting/)            │
│                                                                  │
│  ReportTemplate ──► ReportingService.generate_pdf()             │
│  (HTML + CSS)        (WeasyPrint)                                │
│                             │                                    │
│                   GeneratedReport (history log + file)          │
└───────────────────────────┬─────────────────────────────────────┘
                            │  Auto-save hook
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       EDMS VAULT  (/edms/)                       │
│                                                                  │
│  Document  ──  Version  ──  Workspace  ──  Tags  ──  OCR        │
│  (permanent storage, searchable, access-controlled archive)      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Plan — 5 Phases

---

### Phase 1 — Activate the Engine ⚡
**Estimated Time: 2–4 hours | Priority: CRITICAL (blocker for all other phases)**

#### 1.1 — Install WeasyPrint

```bash
# In backend/venv:
pip install weasyprint

# Add to backend/requirements.txt:
weasyprint==62.3
```

#### 1.2 — Wire Reporting into EDMS (Auto-Save Hook)

**File**: `backend/apps/reporting/services/pdf_generator.py`

After generating the PDF attachment, auto-create an `edms.Document` entry:

```python
# After attachment.file.save(filename, ContentFile(pdf_bytes)):
from apps.edms.domain.models import Document, DocumentWorkspace

# Auto-route to the correct workspace
MODULE_WORKSPACE_MAP = {
    'accounting': 'Finance',
    'hrm': 'HR',
    'crm': 'Sales',
    'contracts': 'Contracts',
    'scm': 'Operations',
    'itsm': 'IT & Security',
    'soc': 'IT & Security',
    'itam': 'IT & Security',
    'projects': 'Sales',
}
app_label = record_model_str.split('.')[0]
workspace_name = MODULE_WORKSPACE_MAP.get(app_label, 'General')

workspace, _ = DocumentWorkspace.objects.get_or_create(
    tenant=record.tenant,
    name=workspace_name,
    defaults={'slug': workspace_name.lower().replace(' ', '-').replace('&', 'and')}
)
Document.objects.create(
    tenant=record.tenant,
    name=filename,
    workspace=workspace,
    attachment=attachment,
    source_module=record_model_str,
    source_id=str(record.id),
)
```

#### 1.3 — Add Source Tracking to EDMS Document Model

**File**: `backend/apps/edms/domain/models.py`

Add two fields to the `Document` model and create a migration:

```python
source_module = models.CharField(max_length=100, blank=True, null=True,
    help_text="e.g. 'accounting.Invoice' — the model that triggered generation")
source_id = models.CharField(max_length=255, blank=True, null=True,
    help_text="The primary key of the source record")
```

```bash
python manage.py makemigrations edms
python manage.py migrate
```

---

### Phase 2 — Build the PDF Template Library 📄
**Estimated Time: 2–3 days | Priority: HIGH**

All templates are stored as `ReportTemplate` database records (HTML + CSS), editable by admins via `TemplateManager.jsx`. They use Django template syntax with `{{ record.field }}` placeholders.

#### Financial Documents (Accounting module)

| Template Name | `model` field | Priority |
|---------------|---------------|----------|
| Standard Invoice | `accounting.Invoice` | 🔴 Week 1 |
| Proforma Invoice | `accounting.Invoice` | 🔴 Week 1 |
| Credit Note / Avoir | `accounting.Invoice` | 🔴 Week 1 |
| Payment Receipt | `accounting.Invoice` | 🟠 Week 1 |
| Delivery Note | `erp.DeliveryNote` | 🟠 Week 1 |
| Balance Sheet Report | *(report view)* | 🟡 Week 2 |
| Profit & Loss Report | *(report view)* | 🟡 Week 2 |
| Cash Flow Statement | *(report view)* | 🟡 Week 2 |
| AR Aging Report | *(report view)* | 🟡 Week 2 |

#### Sales & CRM Documents

| Template Name | `model` field | Priority |
|---------------|---------------|----------|
| Service Proposal & Quote | `crm.Proposal` | 🔴 Week 1 |
| Quotation / Devis | `contracts.Quote` | 🔴 Week 1 |
| NDA (Non-Disclosure Agreement) | `erp.ErpDocument` | 🟠 Week 1 |
| Letter of Intent (LOI) | `erp.ErpDocument` | 🟡 Week 2 |
| Executive Summary / Pitch | `crm.Proposal` | 🟡 Week 2 |
| RFP Response | `crm.Proposal` | 🟡 Month 2 |

#### Operations & SCM

| Template Name | `model` field | Priority |
|---------------|---------------|----------|
| Purchase Order | `scm.PurchaseOrder` | 🔴 Week 1 |
| Vendor Bill | `accounting.VendorBill` | 🟠 Week 1 |
| Goods Receipt Note (GRN) | `scm.GoodsReceipt` | 🟡 Week 2 |
| Request for Quotation (RFQ) | `scm.RFQ` | 🟡 Week 2 |

#### HR Documents

| Template Name | `model` field | Priority |
|---------------|---------------|----------|
| Payslip / Pay Stub | `hrm.PaySlip` | 🔴 Week 1 |
| Offer Letter | `hrm.Employee` | 🟠 Week 1 |
| Employment Contract | `hrm.EmployeeContract` | 🟠 Week 1 |
| Leave Approval Letter | `hrm.LeaveRequest` | 🟡 Week 2 |
| Experience / Reference Letter | `hrm.Employee` | 🟡 Month 2 |

#### IT-Specific Documents (MSP Advantage)

| Template Name | `model` field | Priority |
|---------------|---------------|----------|
| Statement of Work (SOW) | `projects.Project` | 🟠 Week 1 |
| Master Services Agreement (MSA) | `contracts.ServiceContract` | 🟠 Week 1 |
| Incident Report | `itsm.Ticket` | 🟠 Week 1 |
| Security Audit Report | `soc.Alert` | 🟠 Week 1 |
| SLA Compliance Report | `contracts.SLATier` | 🟡 Week 2 |
| Asset Inventory Report | `itam.Asset` | 🟡 Week 2 |

---

### Phase 3 — Connect All Modules to the Reporting Engine 🔌
**Estimated Time: 3–5 days | Priority: HIGH**

Replace all current scattered `download-pdf` actions with unified calls to the Reporting Engine. The download buttons in each module **stay** — they call the central engine now.

#### 3.1 — Backend: Add `generate_report` action to each ViewSet

Apply this pattern to: `InvoiceViewSet`, `DeliveryNoteViewSet`, `PurchaseOrderViewSet`, `QuoteViewSet`, `PaySlipViewSet`, `TicketViewSet`, etc.

```python
# Import at top of each views.py:
from apps.reporting.domain.models import ReportTemplate
from apps.reporting.services.pdf_generator import ReportingService

# Action on each ModelViewSet:
@action(detail=True, methods=['post'], url_path='generate-report')
def generate_report(self, request, pk=None):
    record = self.get_object()
    template = ReportTemplate.objects.filter(
        tenant=request.tenant,
        model=f"{record._meta.app_label}.{record._meta.model_name}",
        is_default=True,
        is_active=True,
    ).first()
    if not template:
        return Response(
            {'error': f'No default template configured for this document type.'},
            status=status.HTTP_404_NOT_FOUND
        )
    attachment = ReportingService.generate_pdf(template, record)
    if not attachment:
        return Response({'error': 'PDF generation failed.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({
        'url': attachment.file.url,
        'filename': attachment.name,
        'generated_at': attachment.created_at.isoformat() if hasattr(attachment, 'created_at') else None,
    })
```

#### 3.2 — Frontend: Unified `reportingService.generateDocument()`

**File**: `frontend/src/core/api/reportingService.js`

Add the universal document generation call:

```javascript
// Unified document generation — used by all modules
generateDocument: async (recordModel, recordId) => {
    const response = await client.post('reporting/generated/generate/', {
        record_model: recordModel,
        record_id: recordId,
    });
    return response.data;
},

// Trigger download from a URL
downloadFromUrl: (url, filename) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'document.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
},
```

Replace all module-level `downloadPdf(id)` calls with:

```javascript
// Before (scattered):
await erpService.downloadInvoicePdf(invoiceId);

// After (unified):
const { url, filename } = await reportingService.generateDocument('accounting.Invoice', invoiceId);
reportingService.downloadFromUrl(url, filename);
```

#### 3.3 — CRM DocGen Migration

Migrate the 8 existing CRM `window.print()` templates to proper backend `ReportTemplate` records:

1. Extract HTML/CSS from each `*Template.jsx` component
2. Insert as `ReportTemplate` fixtures (`backend/apps/reporting/fixtures/default_templates.json`)
3. Load with `python manage.py loaddata default_templates`
4. Update CRM DocGen frontend to call `reportingService.generateDocument()` instead of `window.print()`

---

### Phase 4 — Upgrade the Document Hub UI 🎨
**Estimated Time: 3–4 days | Priority: MEDIUM**

The existing Reporting module frontend is functional but minimal. Upgrade it to be the full command center.

#### 4.1 — Upgrade `GeneratedDocuments.jsx`

**File**: `frontend/src/apps/reporting/pages/generated/GeneratedDocuments.jsx`

Add the following capabilities:
- **Cross-module filter**: Filter by document category (Finance, HR, Sales, IT, Operations)
- **Status badges**: `pending` / `generating` / `done` / `failed` with color indicators
- **Bulk download**: Select multiple → download as ZIP (backend: `POST /reporting/generated/bulk-download/`)
- **Re-generate button**: Re-run generation with the latest template version
- **EDMS deep link**: "View in Vault →" button per row
- **Inline preview panel**: Click row → side panel with `<iframe src={pdfUrl}>` preview

#### 4.2 — Upgrade `TemplateManager.jsx`

**File**: `frontend/src/apps/reporting/pages/templates/TemplateManager.jsx`

Add the following capabilities:
- **Live code editor**: Monaco Editor (VS Code in browser) for HTML + CSS with syntax highlighting
- **Live preview panel**: Render preview via `POST /reporting/templates/{id}/preview/` (endpoint already exists)
- **Model selector dropdown**: Assign template to the correct Django model string (`accounting.Invoice`, etc.)
- **Set as Default toggle**: Mark one template per model as the default for `generate_report` actions
- **Template version history**: Track edits with timestamps and author

#### 4.3 — Document Analytics on `ReportingDashboard.jsx`

**File**: `frontend/src/apps/reporting/pages/dashboards/ReportingDashboard.jsx`

Add metric cards:
- Documents generated this month vs. last month (trend)
- Top 3 most-generated document types
- Failed generation count (alert if > 0)
- Documents per module (mini bar chart)

---

### Phase 5 — EDMS as the Master Vault 🗃️
**Estimated Time: 2–3 days | Priority: MEDIUM**

The EDMS becomes the **permanent, searchable, version-controlled archive** for all documents.

#### 5.1 — Auto-Workspace Folder Structure

Every generated document auto-files into a logical workspace (set up in Phase 1.2):

```
Generated Documents/
├── Finance/         ← Invoices, Credit Notes, P&L Reports, Balance Sheets
├── HR/              ← Payslips, Employment Contracts, Offer Letters
├── Sales/           ← Proposals, Quotations, SOW, MSA
├── Operations/      ← Purchase Orders, GRNs, Delivery Notes
├── IT & Security/   ← Incident Reports, Audit Reports, Asset Reports
└── Contracts/       ← NDAs, Service Contracts, SLA Documents, LOIs
```

#### 5.2 — Source Record Deep Links

Each EDMS `Document` with a `source_module` + `source_id` gets a "View Source" button:

```javascript
// frontend/src/apps/edms/pages/dashboards/EDMSDashboard.jsx
const getSourceLink = (doc) => {
    const linkMap = {
        'accounting.Invoice': `/admin/accounting/invoices/${doc.source_id}/`,
        'hrm.PaySlip':        `/admin/hrm/payroll/${doc.source_id}/`,
        'contracts.Quote':    `/admin/contracts/quotes/${doc.source_id}/`,
        // ...
    };
    return linkMap[doc.source_module] || null;
};
```

#### 5.3 — Document Expiry Alerts

Connect `erp.ErpDocument.expiry_date` to a dashboard alert:

- NDAs expiring in < 30 days → yellow alert on main dashboard
- Contracts expiring in < 60 days → orange alert
- Expired documents → red alert with renewal CTA

**File**: `backend/apps/notifications/tasks.py` — Add a scheduled task (Celery beat, daily):

```python
@shared_task
def check_document_expiry():
    from apps.erp.domain.models import ErpDocument
    from apps.notifications.services import NotificationService
    from django.utils import timezone
    
    expiring = ErpDocument.objects.filter(
        expiry_date__lte=timezone.now().date() + timedelta(days=30),
        expiry_date__gte=timezone.now().date(),
    )
    for doc in expiring:
        NotificationService.send_alert(
            tenant=doc.tenant,
            title=f"Document Expiring: {doc.title}",
            body=f"{doc.get_document_type_display()} expires on {doc.expiry_date}",
            level='warning',
        )
```

---

## Delivery Timeline

| Week | Work |
|------|------|
| **Week 1** | Phase 1 (WeasyPrint + EDMS hook) + Phase 2 core templates (Invoice, PO, Payslip, SOW, Proposal) + Phase 3.1 (backend `generate_report` actions) |
| **Week 2** | Phase 2 remaining templates (HR, IT, SCM) + Phase 3.2/3.3 (frontend wiring + CRM migration) |
| **Week 3** | Phase 4 (Document Hub UI upgrade — GeneratedDocuments, TemplateManager, Analytics) |
| **Week 4** | Phase 5 (EDMS vault auto-routing, deep links, expiry alerts) |
| **Month 2** | Remaining templates (RFP, LOI, Pitch Deck, Certification Reports) + Bulk download + Monaco editor |

---

## Files Touched Per Phase

### Phase 1
- `backend/requirements.txt` — add `weasyprint`
- `backend/apps/reporting/services/pdf_generator.py` — add EDMS auto-save hook
- `backend/apps/edms/domain/models.py` — add `source_module`, `source_id` fields
- `backend/apps/edms/migrations/` — new migration

### Phase 2
- `backend/apps/reporting/fixtures/default_templates.json` — all document templates as fixtures

### Phase 3
- `backend/apps/accounting/api/views.py` — `generate_report` action on InvoiceViewSet, VendorBillViewSet
- `backend/apps/erp/api/views.py` — `generate_report` action on DeliveryNoteViewSet
- `backend/apps/scm/api/views.py` — `generate_report` action on PurchaseOrderViewSet
- `backend/apps/contracts/api/views.py` — `generate_report` action on QuoteViewSet, ServiceContractViewSet
- `backend/apps/hrm/api/views.py` — `generate_report` action on PaySlipViewSet, EmployeeViewSet
- `backend/apps/itsm/api/views.py` — `generate_report` action on TicketViewSet
- `frontend/src/core/api/reportingService.js` — add `generateDocument()`, `downloadFromUrl()`
- `frontend/src/apps/crm/components/documents/*.jsx` — migrate from `window.print()` to reporting engine

### Phase 4
- `frontend/src/apps/reporting/pages/generated/GeneratedDocuments.jsx`
- `frontend/src/apps/reporting/pages/templates/TemplateManager.jsx`
- `frontend/src/apps/reporting/pages/dashboards/ReportingDashboard.jsx`

### Phase 5
- `frontend/src/apps/edms/pages/dashboards/EDMSDashboard.jsx` — source deep links
- `backend/apps/notifications/tasks.py` — document expiry alerts
- `backend/apps/reporting/api/views.py` — bulk download endpoint

---

*This plan follows the Odoo `ir.actions.report` architecture pattern and is designed for an IT MSP enterprise like BitGuard.*
