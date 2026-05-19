# BitGuard Platform — Full Audit & Production Refactor Plan

## Company Identity (Updated Charter Context)

BitGuard is **NOT** just a SaaS company. BitGuard is:

1. **Managed Service Provider (MSP)** — Delivers managed IT infrastructure, cybersecurity monitoring (SOC), endpoint protection, and network management to business clients
2. **IT & Cybersecurity Services Company** — Provides consulting, security audits, penetration testing, compliance readiness, and professional IT services
3. **Technology Store** — Sells hardware (servers, firewalls, networking gear), software licenses, digital products, and SaaS subscriptions — like any major tech company's online store

The admin dashboard is the **Command Center** that runs all three pillars of the business.

---

## Full Module Audit Results

I audited every module in the platform. Below is the status of each, organized by the sidebar menu sections.

### Legend
- ✅ **Functional** — Has pages, routes, backend API, and real data flow
- ⚠️ **Partial** — Pages exist but are mostly mock/hardcoded data or missing CRUD
- ❌ **Stub/Broken** — Empty shell, placeholder, or missing critical functionality
- 🔴 **Blocker** — Cannot function at all (missing imports, crashed, no backend)

---

### 1. Command Center (Main Dashboard)

| Component | File | Status | Issues |
|-----------|------|--------|--------|
| CommandCenter | `dashboard/pages/CommandCenter.jsx` (28KB) | ⚠️ Partial | Large file with hardcoded KPI data. Calls `dashboardService` but most widgets use static numbers. No real-time refresh. No error boundaries. |
| MRR Dashboard | `dashboard/pages/MrrDashboard.jsx` | ⚠️ Partial | Mock revenue data. Not connected to billing/stripe backend. |
| Sales Dashboard | `dashboard/pages/SalesDashboard.jsx` | ⚠️ Partial | Hardcoded pipeline stats. Should aggregate from CRM deals. |
| Notification Center | `dashboard/pages/NotificationCenter.jsx` | ✅ Functional | Connected to notifications API. |
| User Management | `dashboard/pages/UserManagement.jsx` | ⚠️ Partial | Basic list. Missing create/edit modals, role assignment, lock/unlock actions. |

**Verdict**: Dashboard shows data but most of it is **hardcoded/mock**. It needs to aggregate **real data** from each module's API.

---

### 2. Revenue & Growth

| Module | Pages | Status | Issues |
|--------|-------|--------|--------|
| **CRM** | 27 pages (clients, contacts, leads, deals, quotes, contracts, SLA, onboarding wizard, document generator) | ✅ Functional | Most comprehensive module. Has CRUD, modals, pipeline view. Some pages use mock fallbacks. |
| **Store** | 17 pages (products, orders, checkout, subscriptions, categories, customers, landing pages, shipping) | ⚠️ Partial | Product catalog works publicly. Admin pages have CRUD forms but many use **hardcoded data arrays**. Stripe checkout is a placeholder. |
| **Billing** | 6 pages (admin, plans, invoices, settings, success/cancel) | ⚠️ Partial | Plans list is mostly UI. Stripe integration is a stub. No real subscription lifecycle. |
| **Marketing** | 4 pages (dashboard, campaigns, integrations, settings) | ⚠️ Partial | Campaign list has CRUD. Dashboard uses **hardcoded chart data**. Integrations page is a static display. No actual email/campaign delivery engine. |

---

### 3. Service Operations

| Module | Pages | Status | Issues |
|--------|-------|--------|--------|
| **Support (Service Desk)** | 7 pages (dashboard, tickets, escalations, SLA breaches, knowledge base, settings) | ✅ Functional | Ticket CRUD works. SLA breach log connected to backend. Knowledge base has articles. |
| **Contracts & SLAs** | Rendered via CRM pages (ContractList, SlaTiersPage, SlaBreachesPage, QuoteList, QuoteDetail) | ⚠️ Partial | UI exists. Backend models exist. But contract→invoice automation is **not wired**. Quote acceptance doesn't trigger ERP invoice creation. |
| **Project Management** | 6 pages (dashboard, kanban, detail, reports, resources, time tracking) | ✅ Functional | Recently upgraded with premium UI. Kanban, time tracking, and reports work. |
| **ITSM (Change Mgmt)** | 2 pages (dashboard, settings) | ⚠️ Partial | Dashboard is a large 28KB component with **all-in-one UI**. No separate change request list/detail. Settings is basic. |
| **ITAM (Asset Mgmt)** | 3 pages (dashboard, asset list, settings stub) | ⚠️ Partial | Asset list renders. Settings is a 233-byte placeholder. Dashboard uses **mock data**. |
| **SCM (Procurement)** | 5 pages (inventory, vendors, purchase orders, reports, settings) | ⚠️ Partial | Lists render with backend data. But PO→inventory automation is **not wired**. |

---

### 4. People & Governance

| Module | Pages | Status | Issues |
|--------|-------|--------|--------|
| **HRM** | 7 pages (dashboard, employees, leave, time tracking, certifications, payroll, settings) | ⚠️ Partial | Employee list works. Payroll is **UI-only** (no calculation engine). Leave management has forms but no approval workflow. |
| **Approvals** | 2 pages (dashboard, settings) | ⚠️ Partial | Dashboard shows pending items. But there's **no approval engine** — no approve/reject API calls wired. |
| **Documents** | 2 pages (dashboard, settings) | ⚠️ Partial | Document upload/list works visually. Version control and access-control are **not implemented**. |

---

### 5. Finance

| Module | Pages | Status | Issues |
|--------|-------|--------|--------|
| **ERP** | 11 pages (dashboard, invoices, create/detail, expenses, projects, reports, settings, risks) | ⚠️ Partial | Invoice list/create works. But **no Stripe payment reconciliation**. Expense tracking is manual-only. Financial dashboard uses **mock charts**. |

---

### 6. Security & Compliance

| Module | Pages | Status | Issues |
|--------|-------|--------|--------|
| **SOC** | 17 pages (dashboard, alerts, incidents, assets, workspaces, cloud, network, remote, email, intel, logs, gaps, vulnerabilities, platform dashboard) | ✅ Functional | Most complete security module. Alert/incident CRUD. Log analysis. Workspace management. Some pages use **mock threat data**. |
| **IAM** | Rendered via auth module (IamDashboard, UserList, RoleList, MfaManagement, AuditLog, SecurityPolicy) | 🔴 Blocker | **Login is broken** (400 error). Role list was 404 (fixed to `/api/iam/`). Audit log was 500 (fixed null user). MFA setup is UI-only. |

---

### 7. Intelligence

| Module | Pages | Status | Issues |
|--------|-------|--------|--------|
| **Reports** | 6 pages (dashboard, revenue, CRM, support, security, export) | ⚠️ Partial | Pages exist with chart layouts. All use **hardcoded/mock data**. Export page has CSV button but **doesn't generate real exports**. |

---

### 8. Platform

| Module | Pages | Status | Issues |
|--------|-------|--------|--------|
| **System Admin** | 3 pages (dashboard, platform settings, system logs) | ⚠️ Partial | Dashboard shows system metrics (mock). Platform settings has form fields but **doesn't save to backend**. Logs page exists. |
| **CMS** | 5 pages (dashboard, page editor, landing pages, inquiries, settings stub) | ⚠️ Partial | Page editor is functional (14KB). Dashboard lists pages. Settings is a 230-byte stub. |

---

### 9. Marketing Website (Public)

| Module | Pages | Status |
|--------|-------|--------|
| **Website** | 16 pages (landing, about, team, services, contact, careers, compliance, events, podcasts, free tools, brochure, support, reports, privacy, terms, remote-join) | ✅ Functional |
| **Blog** | Full blog module with components | ✅ Functional |
| **Auth** | Login, Register, ForgotPassword + IAM identity pages | 🔴 Blocker (login broken) |

---

## Critical Blockers Summary

| # | Blocker | Impact | Fix Required |
|---|---------|--------|-------------|
| 1 | **Login returns 400** | Cannot access any admin functionality | Serializer fixed (awaiting password reset via WSL) |
| 2 | **Most dashboards use hardcoded data** | Admin sees fake numbers, not real business state | Wire each dashboard to its module's aggregation API |
| 3 | **No cross-module automation** | Quote→Invoice, Order→Inventory, Deal→Project signals don't fire | Implement Django signals per ARCHITECTURE.md workflows |
| 4 | **Stripe integration is a stub** | No real payments, subscriptions, or billing | Complete Stripe webhook handler + checkout flow |
| 5 | **Reports use mock charts** | Intelligence module is useless | Create real aggregation endpoints in dashboard BFF |

---

## Proposed Changes

> [!IMPORTANT]
> The scope below is massive. I recommend tackling it in **3 phases**:
> - **Phase 1**: Fix login + wire all dashboards to real data
> - **Phase 2**: Implement cross-module automation (signals/workflows)
> - **Phase 3**: Polish UI, add missing CRUD, complete Stripe

### Phase 1 — Fix Auth & Wire Real Data (Priority)

1. **Fix Login** — Run `python3 manage.py reset_admin` in WSL
2. **Dashboard BFF** — Create real aggregation endpoints in `apps/dashboard/views.py` that query each module
3. **Wire all module dashboards** — Replace hardcoded arrays with API calls
4. **Fix IAM module** — Ensure user/role CRUD, audit logs, and MFA all work end-to-end

### Phase 2 — Cross-Module Automation

1. **Implement signals** in `apps/core/signals.py`:
   - Deal won → InternalProject created
   - Order paid → CRM Client created/updated
   - Quote accepted → Invoice auto-created
   - Low stock → Notification triggered
   - SLA breach → Alert raised
2. **Approval engine** — Wire approve/reject actions to backend
3. **Contract lifecycle** — ServiceContract → SLA enforcement → breach detection

### Phase 3 — UI Polish & Completions

1. **Complete Stripe** — Real checkout, webhooks, subscription management
2. **Complete CRUD** for all modules (edit/delete where missing)
3. **Export engine** — Real CSV/PDF generation for reports
4. **Settings pages** — Wire all settings forms to backend config storage
5. **Design system polish** — Consistent dark theme, animations, responsive

---

## Updated Charter Additions

The CHARTER.md should be updated to reflect:

```markdown
1. Purpose and Scope

BitGuard is a Managed Service Provider (MSP) and technology company providing:
- Managed IT infrastructure and cybersecurity services (SOC, MDR, endpoint protection)
- IT consulting and professional services (security audits, compliance, penetration testing)
- Physical and digital product sales (hardware, software licenses, SaaS subscriptions)
- Subscription-based managed services
- Customer lifecycle management (CRM, contracts, SLA enforcement)
- Operational and financial execution (ERP, billing, procurement)

The platform operates as a unified business operating system for a technology company
that sells products, delivers services, and manages client infrastructure.
```

---

## AI Website Builder Prompt

Copy-paste this prompt to have an AI refactor your entire admin dashboard:

```
You are an expert full-stack engineer. I am giving you the complete codebase of
BitGuard — a Managed Service Provider (MSP) and technology company platform.

COMPANY IDENTITY:
BitGuard is NOT just a SaaS company. BitGuard is:
1. A Managed Service Provider (MSP) delivering managed IT infrastructure,
   cybersecurity monitoring (SOC/MDR), endpoint protection, and network management
2. An IT & Cybersecurity Services company providing consulting, security audits,
   penetration testing, compliance readiness, and professional services
3. A Technology Store selling hardware (servers, firewalls, networking gear),
   software licenses, digital products, and SaaS subscriptions

TECH STACK:
- Backend: Django 5.2 + DRF + SimpleJWT + SQLite (dev) / PostgreSQL (prod)
- Frontend: React 18 + Vite + Tailwind CSS
- Payments: Stripe (test mode)
- Architecture: Enterprise monorepo, DDD service layer, multi-tenant

ADMIN DASHBOARD MODULES (all under /admin/*):
The admin dashboard is the Command Center. Every module must be fully functional
with real CRUD operations, real API calls, and real data — NO hardcoded/mock data.

1. COMMAND CENTER (/admin)
   - Real-time KPI dashboard aggregating data from ALL modules
   - Revenue metrics from billing/stripe, pipeline value from CRM deals,
     open tickets from support, active incidents from SOC
   - Notification center with real-time alerts

2. CRM & SALES (/admin/crm/*)
   - Full client lifecycle: Leads → Deals (pipeline) → Clients
   - Contact management with relationship mapping
   - Deal pipeline with drag-and-drop stage management
   - Onboarding wizard for new MSP clients
   - Activity timeline, document generator, quote management
   - Integration with contracts module for service agreements

3. SERVICE CATALOG & STORE (/admin/store/*)
   - Product management (hardware, software, SaaS, services)
   - Category management with nested hierarchies
   - Order management with status tracking
   - Real Stripe checkout integration
   - Subscription management (recurring billing)
   - Inventory sync with SCM module
   - Customer account management

4. BILLING & SUBSCRIPTIONS (/admin/billing/*)
   - Subscription plan management (create/edit plans)
   - Real Stripe integration (checkout sessions, webhooks, portal)
   - Invoice generation linked to ERP module
   - Payment history and reconciliation

5. MARKETING (/admin/marketing/*)
   - Campaign management (email, social, content)
   - Campaign analytics with real metrics
   - Lead source tracking integrated with CRM
   - Marketing ROI dashboards

6. SERVICE DESK (/admin/support/*)
   - Ticket management with full lifecycle (open→assigned→resolved→closed)
   - SLA enforcement linked to client contracts
   - SLA breach detection and escalation
   - Knowledge base with article CRUD
   - Auto-escalation rules

7. CONTRACTS & SLAs (/admin/contracts/*)
   - Service contract CRUD with SLA tier assignment
   - Quote management (create→send→accept→invoice)
   - Quote acceptance auto-creates ERP invoice (signal)
   - SLA tier definitions (response times, resolution times)
   - SLA breach logging and alerting

8. PROJECT MANAGEMENT (/admin/projects/*)
   - Project portfolio dashboard
   - Kanban board with drag-and-drop
   - Resource allocation and loading charts
   - Time tracking per project/task
   - Status reports and analytics
   - Auto-created from won CRM deals (signal)

9. ITSM / CHANGE MANAGEMENT (/admin/itsm/*)
   - Change request CRUD with approval workflow
   - Change advisory board (CAB) review process
   - Risk assessment per change
   - Implementation scheduling
   - Post-implementation review

10. IT ASSET MANAGEMENT (/admin/itam/*)
    - Asset inventory (hardware, software, licenses)
    - Asset lifecycle tracking (procured→deployed→retired)
    - Assignment to clients/employees
    - Warranty and maintenance tracking
    - Integration with SOC for endpoint security

11. PROCUREMENT / SCM (/admin/scm/*)
    - Vendor management with contact info and ratings
    - Inventory management with reorder levels
    - Purchase order CRUD with approval workflow
    - PO receipt auto-restocks inventory (signal)
    - Low stock alerts (signal → notification)

12. HRM / PEOPLE (/admin/hrm/*)
    - Employee directory with department hierarchy
    - Leave management with approval workflow
    - Time tracking (billable vs non-billable)
    - Certification tracking with expiry alerts
    - Payroll overview (read-only summary)

13. APPROVAL CENTER (/admin/approvals/*)
    - Unified approval queue across all modules
    - Approve/reject with comments
    - Approval chain configuration
    - Audit trail for all decisions

14. DOCUMENT MANAGEMENT (/admin/documents/*)
    - Document upload with categorization
    - Version control
    - Access control per role/tenant
    - Document templates

15. FINANCE & ERP (/admin/erp/*)
    - Invoice management (create, send, track payment status)
    - Expense tracking with categorization
    - Financial dashboard with real P&L, revenue, expenses
    - Payment reconciliation with Stripe
    - Risk register

16. SOC / SECURITY OPERATIONS (/admin/security/*)
    - Security dashboard with threat overview
    - Alert management (triage, investigate, resolve)
    - Incident management with full lifecycle
    - Endpoint monitoring (managed clients)
    - Workspace management (per-client security contexts)
    - Cloud app security monitoring
    - Network event analysis
    - Remote session management
    - Threat intelligence feed
    - Log analysis (SIEM-lite)
    - Vulnerability tracking
    - Security gap analysis

17. IAM / IDENTITY & ACCESS (/admin/iam/*)
    - User management (CRUD, lock/unlock, MFA toggle)
    - Role management (CRUD, permission assignment)
    - Tenant management
    - Audit log viewer with filters and export
    - Security policy configuration
    - Session management

18. ANALYTICS & REPORTS (/admin/reports/*)
    - Revenue report (from billing + store)
    - CRM report (pipeline, conversion rates)
    - Support report (ticket volume, resolution times)
    - Security report (incidents, alerts, compliance)
    - Export to CSV/PDF
    - MRR dashboard

19. SYSTEM ADMINISTRATION (/admin/system/*)
    - Platform settings (company info, branding, email config)
    - System logs viewer
    - Health check dashboard
    - Background job monitoring

20. WEBSITE & CMS (/admin/cms/*)
    - Page management (create/edit/delete pages)
    - Visual page editor
    - Landing page management
    - Contact form inquiries
    - SEO settings per page

CROSS-MODULE INTEGRATIONS (Django signals):
These MUST work end-to-end:
- CRM Deal won → ERP InternalProject auto-created
- Store Order paid → CRM Client created/updated
- Contract Quote accepted → ERP Invoice auto-created
- SCM Inventory low → Notification triggered
- Support SLA breached → SOC Alert raised + Notification
- HRM Leave approved → Calendar updated
- Approval decisions → Audit log entries

UI/UX REQUIREMENTS:
- Dark cyber-theme with glassmorphism (HSL palette, Inter font)
- Every table must have: pagination, sorting, search/filter, bulk actions
- Every form must have: validation, loading states, success/error toasts
- Every dashboard must show REAL data from API — NO hardcoded arrays
- Responsive design (desktop-first, tablet/mobile friendly)
- Smooth micro-animations and transitions
- Global error boundary with recovery
- Role-based menu visibility (hide items user can't access)

API PATTERN:
- All responses use: { success: bool, message: string, data: object }
- All mutations go through service layer (not views)
- All mutations are audit-logged
- All data is tenant-scoped

Deliver a complete, production-ready refactor of the admin dashboard where
every module listed above is fully functional with real CRUD operations,
real API integration, and professional UI. No mock data. No placeholder
components. No stub pages.
```

---

## Verification Plan

### Automated Tests
- `python3 manage.py test` — All backend serializers and views
- `npm test` — Frontend component rendering
- Manual E2E: Login → Navigate every sidebar item → Verify data loads

### Manual Verification
1. Login with `admin@bitguard.tech` / `admin`
2. Click every sidebar menu item — verify page loads without errors
3. Perform CRUD in CRM (create client, create deal, move through pipeline)
4. Create a store order → verify it appears in ERP
5. Create a support ticket → verify SLA enforcement
6. Check all report pages show real aggregated data
