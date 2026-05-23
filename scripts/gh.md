BitGuard Platform — Master AI Builder Prompt
Code-verified audit. Copy this entire file into your AI builder.
MANDATORY FIRST STEP
Before writing a single line of code, read these four files in the repo root:

CHARTER.md — governance rules (authoritative)
ARCHITECTURE.md — technical source of truth
AUDIT_AND_REFACTOR_PLAN.md — module-by-module status
backend/api/urls.py — canonical API route map
COMPANY IDENTITY
BitGuard is NOT a generic SaaS. It is simultaneously:

MSP — Managed IT infrastructure, SOC/MDR, endpoint protection
IT & Cybersecurity Services — consulting, pen-testing, compliance
Technology Store — hardware, software licenses, SaaS subscriptions
The admin dashboard is the Command Center — the authoritative operational interface that controls all three business pillars. It must NEVER show mock data.

TECH STACK (do not change)
Layer	Technology
Backend	Django 5.2 + DRF + SimpleJWT
Frontend	React 18 + Vite + Tailwind CSS
DB (dev)	SQLite at backend/db.sqlite3
DB (prod)	PostgreSQL
Payments	Stripe (test mode)
Auth	JWT via /api/auth/jwt/
API Client	Axios at frontend/src/core/api/client.js
ARCHITECTURE RULES (from CHARTER.md — non-negotiable)
Service layer: Views orchestrate, services decide. Zero business logic in views.
Tenant isolation: Every queryset must call BaseService.filter_by_context(qs, request).
Audit logging: Every mutation calls AuditService.log_action(request, action, resource_type, resource_id, payload).
Serializers: Always use explicit fields = [...]. Never fields = '__all__'.
API response shape: { success: bool, message: string, data: object } — use standard_response() from apps.core.utils.response.
No mock data: Frontend components must call real API endpoints. No hardcoded arrays.
Signals: Cross-module side-effects live only in apps/core/signals.py.
BACKEND DIRECTORY MAP
backend/apps/
  auth/         JWT login, OTP, password reset
  users/        User, Role, UserRole, SecurityPolicy, ApiKey
  tenants/      Tenant, TenantMiddleware
  core/         BaseModel, BaseService, AuditService, signals.py
  dashboard/    BFF aggregator (NO database tables)
  crm/          Client, Contact, Lead, Deal, Activity
  contracts/    ServiceContract, SLATier, SLABreach, Quote, QuoteLine
  store/        Product, Category, Order, LicenseKey, Subscription
  billing/      Plan, Subscription, Stripe webhooks
  erp/          Invoice, Payment, Expense, InternalProject
  support/      Ticket, TicketMessage
  soc/          Alert, Incident, Workspace, ManagedEndpoint, ...
  hrm/          Employee, Department, LeaveRequest, Certification
  scm/          Vendor, InventoryItem, PurchaseOrder
  projects/     Project, Task, TimeEntry
  itam/         Asset
  itsm/         ChangeRequest
  approvals/    ApprovalRequest, ApprovalStep
  documents/    Document
  marketing/    Campaign
  notifications/ Notification
  reports/      (aggregation views only)
  sysadmin/     system logs, platform settings
  website/      Public CMS pages
FRONTEND DIRECTORY MAP
frontend/src/
  core/
    App.jsx                   — root router
    api/client.js             — Axios with JWT + X-Tenant-ID interceptors
    api/*Service.js           — one service file per domain module
    api/menu.js               — sidebar menu definitions (productMenu object)
    layouts/ConsoleLayout.jsx — admin shell with sidebar
    layouts/ModuleLayout.jsx  — per-module layout with sub-nav
    context/AuthContext.jsx   — useAuth hook source
    context/TenantContext.jsx
    context/NotificationContext.jsx
    routes/PortalRoutes.jsx   — /portal/* routes
  apps/
    dashboard/routes/EnterpriseRouter.jsx  — /admin/* routes
    dashboard/pages/CommandCenter.jsx      — main BFF dashboard
    auth/pages/                            — Login, Register, ForgotPassword
    auth/pages/identity/                   — IAM pages
    crm/pages/    erp/pages/   soc/pages/  store/pages/
    hrm/pages/    scm/pages/   support/pages/
    billing/pages/ marketing/pages/ projects/pages/
    itam/pages/   itsm/pages/   approvals/pages/
    documents/pages/ reports/pages/ cms/pages/
    sysadmin/pages/  website/pages/
API ROUTES (canonical — do not invent new prefixes)
/api/auth/          Login, refresh, logout, password reset
/api/iam/           Users, roles (maps to apps.users.urls)
/api/crm/           Clients, deals, leads, contacts
/api/contracts/     Quotes, service contracts, SLA tiers, breaches
/api/store/         Products, orders, checkout
/api/billing/       Plans, subscriptions, Stripe
/api/erp/           Invoices, payments, expenses, projects
/api/support/       Tickets, messages
/api/security/      SOC alerts, incidents, workspaces (NOT /api/soc/)
/api/hrm/           Employees, leave, certifications
/api/scm/           Vendors, inventory, purchase orders
/api/projects/      Projects, tasks, time entries
/api/itam/          Assets
/api/itsm/          Change requests
/api/approvals/     Approval requests, steps
/api/documents/     Documents
/api/marketing/     Campaigns
/api/notifications/ Notifications
/api/dashboard/     BFF: metrics/, health/, mrr/
/api/reports/       Aggregated reports
/api/sysadmin/      System logs, platform settings
/api/home/          Public CMS pages
CONFIRMED SIGNALS IN core/signals.py (already wired — verify, don't duplicate)
post_save(crm.Deal, stage='won') → creates erp.InternalProject
order_paid signal → creates/updates crm.Client + crm.Contact
post_save(contracts.Quote, status='accepted') → creates erp.Invoice + erp.InternalProject
post_save(scm.InventoryItem, qty <= reorder_level) → creates notifications.Notification
post_save(contracts.ServiceContract, created=True) → creates soc.Workspace
Missing signals to implement:

SLA breach → soc.Alert created
HRM leave approved → calendar event (if calendar module exists)
Approval decision → AuditService.log_action()
MODULE STATUS & EXACT ISSUES TO FIX
🔴 BLOCKER — Auth / IAM
File: backend/apps/auth/views.py

CustomTokenObtainPairView.post() references logger which is NOT imported. Add import logging; logger = logging.getLogger(__name__).
The serializer returns access_token / refresh_token but client.js token refresh calls /api/auth/jwt/refresh/ expecting access key — align keys.
File: frontend/src/core/api/client.js

Token refresh reads res.data.access || res.data.data?.access — confirm backend CustomTokenRefreshView returns { data: { access_token: ... } } and unify field name to access_token throughout.
Fix sequence:

Add logger import to auth/views.py
Confirm admin user exists: python manage.py shell -c "from apps.users.models import User; User.objects.filter(email='admin@bitguard.tech').exists()"
If missing: create via management command or seed script
IAM Pages (frontend/src/apps/auth/pages/identity/):

iamService.js calls /api/iam/ — confirm backend/apps/users/urls.py exposes all endpoints (users list, roles list, audit log, MFA, API keys, sessions)
RoleList.jsx — add Create/Edit/Delete modals (currently display-only)
MfaManagement.jsx — wire actual TOTP setup (generate secret → QR → verify OTP)
AuditLogPage.jsx — needs date-range filter + CSV export button
⚠️ Command Center Dashboard
File: frontend/src/apps/dashboard/pages/CommandCenter.jsx

Line 121: calls dashboardService.getMetrics() — but dashboardService.js exposes getStats() not getMetrics(). Rename getStats → getMetrics in core/api/dashboardService.js OR update the call in CommandCenter.
Line 123: calls dashboardService.getSystemHealth() — service exposes getHealth(). Align names.
Line 123: calls dashboardService.getRecentActivity(8) — service returns [] hardcoded. Wire this to GET /api/notifications/?limit=8.
Module tile for Procurement (line 247): reads metrics.scm?.pending_pos but analytics service returns pending_orders key. Fix key name.
Module tile for Procurement (line 249): reads metrics.scm?.low_stock but service returns low_stock_items. Fix key name.
Add global error boundary wrapping the entire component.
Add React.Suspense fallback for lazy-loaded sub-components.
File: backend/apps/dashboard/services/analytics.py

Already aggregates 14 modules with real DB queries — this is correct.
Add billing metrics: active subscriptions count, MRR from Subscription.plan.price_monthly.
Add error logging: replace bare except Exception: pass with logger.warning(...).
⚠️ CRM Module
Status: Most complete module. Issues:

ContractList.jsx, QuoteList.jsx, SlaTiersPage.jsx — import from contractsService.js — confirm all CRUD endpoints exist at /api/contracts/.
Quote detail page missing — create QuoteDetail.jsx showing line items.
Quote accept button must call PATCH /api/contracts/quotes/{id}/ with {status: 'accepted'} which fires the signal to create Invoice.
OnboardingWizard.jsx — confirm it creates Lead → Deal → Client in sequence via API.
Deal pipeline: drag-and-drop stage update must call PATCH /api/crm/deals/{id}/ with {stage: newStage}.
⚠️ Store / Commerce
Status: Product catalog works. Admin pages have issues.

Replace all hardcoded product arrays in admin pages with storeService.getProducts().
Stripe checkout: storeService.js must call POST /api/store/checkout/ → return Stripe session URL → window.location.href = sessionUrl.
Order management: add status filter (pending / processing / completed / refunded).
Inventory sync: on order completion, fire order_paid signal (already defined in core/signals.py).
⚠️ Billing
Status: UI exists. Stripe is stub.

PlansList.jsx — call GET /api/billing/plans/ (replace hardcoded plan objects).
BillingAdminPage.jsx — show real subscription counts from GET /api/dashboard/mrr/.
Implement Stripe webhook handler in backend/apps/billing/views.py for events: customer.subscription.created, customer.subscription.deleted, invoice.payment_succeeded.
BillingSettings.jsx — wire form submission to PATCH /api/billing/settings/.
⚠️ ERP / Finance
Status: Invoice CRUD works. Charts are mock.

ErpDashboard.jsx — replace hardcoded chart data with GET /api/erp/dashboard/ aggregated endpoint.
Create GET /api/erp/dashboard/ view in backend/apps/erp/views.py returning: total_revenue, monthly_revenue, overdue_count, expense_total, top_clients.
Stripe reconciliation: Payment.stripe_payment_intent field should be populated from Stripe webhook.
Export: GET /api/erp/invoices/export/?format=csv — implement in ERP views.
⚠️ Marketing
MarketingDashboard.jsx — replace hardcoded chart arrays with GET /api/marketing/dashboard/.
Create GET /api/marketing/dashboard/ in backend/apps/marketing/views.py.
CampaignIntegrations.jsx — currently static display; add connect/disconnect API calls.
✅ Support / Service Desk (functional — minor fixes)
Confirm SLA enforcement: when Ticket is saved, check ServiceContract.sla_tier.first_response_hours. If breached, auto-create SLABreach. Wire this in support/signals.py or support/services.py.
KnowledgeBase.jsx — add article create/edit modal.
⚠️ SCM / Procurement
PO receive endpoint: POST /api/scm/purchase-orders/{id}/receive/ must auto-increment InventoryItem.quantity_on_hand.
ScmDashboard.jsx — replace mock inventory chart with real GET /api/scm/dashboard/ call.
Low stock alert: signal already in core/signals.py — verify it fires correctly on InventoryItem.save().
⚠️ HRM
HrmDashboard.jsx — replace mock headcount chart with GET /api/hrm/dashboard/.
Leave approval: POST /api/hrm/leave-requests/{id}/approve/ must exist in backend/apps/hrm/views.py.
Payroll page: read-only summary of employee salaries from Employee.salary field.
Certification expiry: query Certification.expiry_date < today + 30 days and surface in dashboard.
⚠️ Approvals
Backend (backend/apps/approvals/views.py):

approve and reject actions are wired correctly. ✅
Missing: perform_create calls service but also lets serializer save — this double-saves. Fix: override create() to call service only and return serializer response.
Missing: tenant scoping. Add get_queryset() that filters by request.tenant.
Frontend (ApprovalsDashboard.jsx):

Wire POST /api/approvals/{id}/approve/ and /reject/ buttons.
Add approval comment input field before submission.
⚠️ ITSM / Change Management
ItsmDashboard.jsx — 28KB monolith. Extract into sub-components: ChangeRequestList, ChangeRequestDetail, ChangeRequestForm.
Create separate route /admin/itsm/requests/:id for change request detail.
Risk assessment field missing from frontend form — add risk_level select (low/medium/high/critical).
⚠️ ITAM / Asset Management
ItamSettings.jsx — 233 bytes placeholder. Build settings form: asset categories, depreciation method, warranty alert threshold.
AssetDashboard.jsx — replace mock data with GET /api/itam/dashboard/.
Create GET /api/itam/dashboard/ endpoint in ITAM views.
⚠️ Reports
All 6 report pages use hardcoded chart data.
Create aggregation endpoints:
GET /api/reports/revenue/ — from ERP + Store
GET /api/reports/crm/ — pipeline conversion, deal velocity
GET /api/reports/support/ — ticket volume, avg resolution time, SLA rate
GET /api/reports/security/ — alert counts, incident MTTR
ExportPage.jsx — wire CSV button to GET /api/reports/{type}/export/?format=csv.
⚠️ System Admin
SysadminDashboard.jsx — mock system metrics. Wire to GET /api/dashboard/health/ (already exists).
Platform settings form — wire PATCH /api/sysadmin/settings/ to save company info.
System logs — wire to GET /api/audit/logs/ with pagination.
⚠️ Documents
DocumentsDashboard.jsx — upload button must call POST /api/documents/ with multipart/form-data.
Add version history: GET /api/documents/{id}/versions/.
Access control: document create form must accept allowed_roles field.
UNIT TESTS REQUIRED
Backend — create in backend/tests/ directory
tests/
  test_auth.py          — login success, login failure, token refresh, logout
  test_dashboard_bff.py — CommandCenterAnalyticsService returns correct keys
  test_crm.py           — Deal CRUD, stage transitions, deal_won signal fires
  test_contracts.py     — Quote accept creates Invoice (signal test)
  test_store.py         — Order paid fires order_paid signal, CRM client created
  test_scm.py           — PO receive restocks inventory item
  test_support.py       — SLA breach auto-created on overdue ticket
  test_approvals.py     — approve/reject changes status, logs audit
  test_signals.py       — all 5 core signals tested end-to-end
Test pattern (follow for all tests):

python
from django.test import TestCase
from rest_framework.test import APIClient
from apps.users.models import User, Role
class TestName(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_superuser(
            email='test@bitguard.tech', 
            username='testadmin', 
            password='TestPass123!'
        )
        self.client.force_authenticate(user=self.user)
    def test_something(self):
        response = self.client.get('/api/endpoint/')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['success'])
Signal test pattern:

python
from unittest.mock import patch
from django.test import TestCase
class TestQuoteAcceptedSignal(TestCase):
    def test_quote_accepted_creates_invoice(self):
        # Setup tenant, client, quote
        quote = Quote.objects.create(status='draft', ...)
        quote.status = 'accepted'
        quote.save()
        # Assert invoice was created
        self.assertTrue(Invoice.objects.filter(client=quote.client).exists())
Frontend — Vitest + React Testing Library
src/apps/dashboard/pages/__tests__/CommandCenter.test.jsx
src/apps/auth/pages/__tests__/Login.test.jsx
src/core/api/__tests__/client.test.js
src/apps/crm/pages/__tests__/DealPipeline.test.jsx
Frontend test pattern:

jsx
import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import CommandCenter from '../CommandCenter'
vi.mock('../../../core/api/dashboardService', () => ({
  dashboardService: {
    getMetrics: vi.fn().mockResolvedValue({ crm: { active_clients: 5 } }),
    getSystemHealth: vi.fn().mockResolvedValue({ database: { status: 'Healthy' } }),
    getRecentActivity: vi.fn().mockResolvedValue([]),
  }
}))
test('renders KPI cards with API data', async () => {
  render(<CommandCenter />)
  await waitFor(() => expect(screen.getByText('5')).toBeInTheDocument())
})
BACKEND/FRONTEND COMPLIANCE CHECKLIST
For every module, verify:

Check	Status
Service file *Service.js calls correct /api/prefix/	Verify per module
platformService.js calls /api/security/ (NOT /api/platform/)	✅ confirmed
cmsService.js calls /api/home/pages/ (NOT /api/cms/)	✅ confirmed
iamService.js calls /api/iam/	✅ confirmed
All admin routes wrapped in ProtectedRoute	✅ in App.jsx
EnterpriseRouter only renders when isAdmin=true	✅ in App.jsx
All API responses unwrapped via response.data?.data ?? response.data	Check each service
Key mismatch to fix:

CommandCenter.jsx calls dashboardService.getMetrics() and getSystemHealth() but dashboardService.js exports getStats() and getHealth() — rename service methods.
SCM metrics keys: frontend reads pending_pos / low_stock, backend returns pending_orders / low_stock_items — align to backend.
UI/UX STANDARDS (apply to every page)
Dark cyber-theme: background bg-slate-950, cards bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl
Every table: pagination + column sorting + search input + bulk select checkboxes
Every form: Zod or manual validation + loading spinner on submit + toast.success() / toast.error() on result
Every dashboard widget: skeleton loader while fetching, error state if API fails, empty state with CTA
Color palette (already in CommandCenter.jsx COLOR_MAP): emerald, blue, rose, amber, violet, purple, pink, orange, cyan, teal
Font: Inter (already loaded via Tailwind)
Animations: hover:-translate-y-0.5 transition-all duration-300 on cards, animate-pulse on alert badges
Global error boundary: wrap <AppContent> in an ErrorBoundary component
CROSS-MODULE WORKFLOWS TO VERIFY END-TO-END
Workflow A — Client Onboarding
1. Create Lead via POST /api/crm/leads/
2. Qualify → Create Deal via POST /api/crm/deals/
3. Move Deal to 'won' → Signal creates erp.InternalProject (verify in DB)
4. Create Quote via POST /api/contracts/quotes/
5. Accept Quote → Signal creates erp.Invoice (verify in DB)
6. Create ServiceContract → Signal creates soc.Workspace (verify in DB)
Workflow B — E-Commerce Order
1. Customer places order → POST /api/store/orders/
2. Stripe payment → fire order_paid signal
3. Verify crm.Client created/updated
4. If physical product → verify scm.InventoryItem.quantity_on_hand decremented
5. If quantity <= reorder_level → verify notifications.Notification created
Workflow C — Support SLA
1. Create Ticket → POST /api/support/tickets/
2. Match to client's ServiceContract → get SLATier
3. If first response not posted within sla_tier.first_response_hours → create SLABreach
4. SLABreach → create soc.Alert + notifications.Notification
Workflow D — Approval Chain
1. Create ApprovalRequest → POST /api/approvals/
2. Approve → POST /api/approvals/{id}/approve/ with comments
3. Verify status = 'approved', decided_at set, AuditService logged
4. Reject → POST /api/approvals/{id}/reject/ with comments
5. Verify status = 'rejected'
EXECUTION ORDER (recommended phases)
Phase 1 — Unblock (do first)
Fix logger import in backend/apps/auth/views.py
Fix method name mismatch: dashboardService.getStats() → getMetrics(), getHealth() → getSystemHealth()
Fix SCM metrics key names in CommandCenter.jsx
Wire getRecentActivity() to real notifications API
Add tenant scoping get_queryset() to ApprovalRequestViewSet
Phase 2 — Wire Real Data
Create missing aggregation endpoints: /api/erp/dashboard/, /api/hrm/dashboard/, /api/scm/dashboard/, /api/marketing/dashboard/, /api/itam/dashboard/
Replace all hardcoded chart data in dashboards with API calls
Wire billing Stripe webhooks
Wire reports endpoints
Phase 3 — Complete Features
IAM: Role CRUD modals, MFA TOTP setup, Audit log export
ITSM: Split monolith into sub-components + change detail route
ITAM: Build ItamSettings, wire AssetDashboard
Documents: upload, versioning, access control
HRM: Leave approval endpoint, certification expiry alerts
Complete Stripe checkout flow end-to-end
Phase 4 — Tests & Polish
Write all backend tests in backend/tests/
Write frontend tests for critical paths
Add global error boundary in App.jsx
Add skeleton loaders to all dashboard widgets
Run python manage.py test — all tests must pass
Run npm test — all tests must pass
VERIFICATION COMMANDS
bash
# Backend
cd backend
python manage.py test                           # All tests pass
python manage.py check                          # No system check errors
python manage.py shell -c "from apps.dashboard.services.analytics import CommandCenterAnalyticsService; print(CommandCenterAnalyticsService.get_global_metrics())"
# Seed data
python scripts/data.py
# Frontend
cd frontend
npm test                                        # All tests pass
npm run build                                   # No build errors
MANUAL E2E VERIFICATION
POST /api/auth/jwt/ with {email, password} → returns access_token ✅
GET /api/dashboard/metrics/ with Bearer token → returns 14-key metrics object ✅
Login at /login → redirect to /admin → Command Center loads with real data
Click every sidebar item → page loads without console errors
CRM: Create client → create deal → move to won → verify InternalProject in /api/erp/projects/
Store: Create order → mark paid → verify CRM client updated
Support: Create ticket → let SLA timer expire → verify SLABreach at /api/contracts/sla-breaches/
Approvals: Submit request → approve → verify audit log at /api/audit/logs/
WHAT NOT TO CHANGE
CHARTER.md and ARCHITECTURE.md — read-only governance
frontend/src/core/api/client.js — interceptor logic is correct
backend/api/urls.py — route prefixes are canonical
backend/apps/core/signals.py — existing signals are correct; only add missing ones
backend/config/settings/ — do not alter settings files without explicit instruction
The monorepo structure — all code stays in website12/