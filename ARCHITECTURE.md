# BitGuard Enterprise Platform — System Architecture & Developer Guide

This document is the **Technical Source of Truth** for the BitGuard Enterprise Platform. Any developer, AI agent, or architect contributing to this repository must follow the conventions defined herein.

> BitGuard is an IT technology company delivering: **Managed IT Services (MSP)**, **SaaS products**, **Digital products**, **Physical hardware**, and **Professional Services**.

---

## 1. High-Level Architecture

The platform is an Enterprise B2B multi-tenant SaaS operating on a decoupled client-server architecture:

*   **Backend Layer**: Django + Django REST Framework (DRF) serving JSON APIs.
*   **Frontend Layer**: React + Vite using Feature-Sliced Design (FSD).
*   **Aggregation Layer (BFF)**: The `dashboard` app is a read-only BFF aggregator for the Admin Command Center. It owns no database tables.
*   **Event Layer**: Django signals wire cross-module lifecycle events (e.g., Deal won → InternalProject created, Order paid → CRM Client created, Quote accepted → Invoice created).
*   **Audit Layer**: `AuditService` is called by every service-layer mutation. Every revenue and security event produces an immutable audit log entry.

---

## 2. Module Architecture Map

```
BitGuard Platform
│
├── Commerce Layer
│   ├── store/       Product catalog, checkout (Stripe), orders, LicenseKeys, subscriptions
│   ├── billing/     Subscription plans, Stripe webhooks, SaaS billing
│   └── erp/         Invoices, payments, expenses, InternalProject (delivery tracking)
│
├── Customer & Sales Layer
│   ├── crm/         Clients, Contacts, Leads, Deals (pipeline), Activities
│   ├── contracts/   ServiceContracts, SLATiers, SLABreaches, Quotes, QuoteLines
│   └── support/     Helpdesk tickets (SLA-enforced), threaded messages
│
├── Security Platform Layer        ← /api/security/
│   └── soc/         INTERNAL SOC:  Alerts, Incidents, ThreatIntelligence, LogAnalysis
│                    SAAS PRODUCT:  Workspaces, ManagedEndpoints (ITAM/MDR), CloudApps,
│                                   SystemMonitors, NetworkEvents, CloudIntegrations,
│                                   RemoteSessions
│
├── Operations Layer
│   ├── hrm/         Employees, Departments, LeaveRequests, Certifications, TimeEntries
│   └── scm/         Vendors, InventoryItems, PurchaseOrders, PurchaseOrderLines
│
├── Intelligence Layer
│   ├── dashboard/   BFF Command Center — aggregates KPIs, owns no tables
│   └── marketing/   Campaigns, interaction tracking
│
└── Platform Infrastructure
    ├── core/        Base models, AuditService, BaseService, signals, middleware
    ├── auth/        JWT login/logout, password reset (Django tokens), token refresh
    ├── users/       User profiles, roles (RBAC), EmailAuthBackend
    ├── tenants/     Multi-tenancy isolation, TenantMiddleware
    ├── notifications/ Cross-module real-time alerts (tenant nullable for system events)
    └── website/     Public CMS / Landing Pages API
```

---

## 3. API Routes Reference

| Route Prefix | Module | Status |
|---|---|---|
| `/api/store/` | Commerce: products, orders, checkout, licenses | ✅ |
| `/api/billing/` | Subscription plans, Stripe billing | ✅ |
| `/api/erp/` | Invoices, payments, expenses, projects | ✅ |
| `/api/crm/` | Clients, deals, leads, contacts, activities | ✅ |
| `/api/contracts/` | Service contracts, SLA tiers, quotes | ✅ NEW |
| `/api/support/` | Tickets, messages | ✅ |
| `/api/security/` | SOC + Security Platform product (unified) | ✅ Extended |
| `/api/hrm/` | Employees, leave, certifications, time entries | ✅ NEW |
| `/api/scm/` | Vendors, inventory, purchase orders | ✅ NEW |
| `/api/auth/` | JWT login, refresh, logout, password reset | ✅ |
| `/api/tenants/` | Tenant management | ✅ |
| `/api/dashboard/` | BFF aggregated stats | ✅ |
| `/api/marketing/` | Campaigns, interactions | ✅ |
| `/api/notifications/` | Real-time alerts | ✅ |
| `/api/users/` | User profiles, RBAC | ✅ |
| `/api/home/` | Public CMS / website pages | ✅ |
| `/api/ai/` | AI engine integrations | ✅ |
| `/api/automation/` | Scheduled tasks | ✅ |
| `/api/blog/` | Blog / content management | ✅ |

---

## 4. Backend Architecture (Django)

Located in `backend/`. Follows **Domain-Driven Design (DDD)** with enforced service layer separation per Charter §8.

### Directory Layout
```text
backend/
├── api/
│   └── urls.py         # Unified routing organized by architectural layer
├── apps/
│   ├── auth/           # JWT, password reset (UID + Django token), token refresh
│   ├── billing/        # Plans, Stripe subscriptions, webhook handler
│   ├── contracts/      # ServiceContract, SLATier, SLABreach, Quote, QuoteLine [NEW]
│   ├── core/           # BaseModel, BaseService, AuditService, signals, middleware
│   ├── crm/            # Client, Contact, Lead, Deal, Activity
│   ├── dashboard/      # BFF aggregator — no database tables
│   ├── erp/            # Invoice, Payment, Expense, InternalProject
│   ├── hrm/            # Employee, Department, LeaveRequest, Certification, TimeEntry [NEW]
│   ├── marketing/      # Campaign, Interaction
│   ├── notifications/  # Notification (tenant nullable)
│   ├── scm/            # Vendor, InventoryItem, PurchaseOrder, PurchaseOrderLine [NEW]
│   ├── soc/            # Alert, Incident, ThreatIntelligence, LogAnalysis,
│   │                   # Workspace, ManagedEndpoint, CloudApp, SystemMonitor,
│   │                   # NetworkEvent, CloudIntegration, RemoteSession [Extended]
│   ├── store/          # Product, Category, Order, LicenseKey, Subscription
│   ├── support/        # Ticket, TicketMessage
│   ├── tenants/        # Tenant, TenantMiddleware
│   ├── users/          # User, EmailAuthBackend
│   └── website/        # Public CMS pages, Page Editor API [Extended]
├── config/
│   └── settings/
│       ├── base.py     # Shared settings (all environments)
│       ├── dev.py      # Development (SQLite, DEBUG=True)
│       └── prod.py     # Production (PostgreSQL, Redis, S3, SendGrid, Stripe)
├── integrations/
│   ├── ai_engine/
│   ├── automation/
│   └── blog/
└── scripts/            # DB seeding and utility scripts
```

### Backend Rules & Patterns

1. **Service Layer (Charter §8):** Views **must not** contain business logic. All mutations and queries go through a `services.py` class inheriting from `BaseService`. Pattern: `SomeService.action(request, data)`.

2. **Tenant Isolation (Charter §3):** Use `BaseService.filter_by_context(qs, request)` in every service `get_queryset()`. Never return raw `Model.objects.all()` from a view.

3. **Audit Logging (Charter §11):** Every service mutation calls `AuditService.log_action(request, action, resource, payload)`. Login, logout, and all revenue and security events are audited.

4. **Signal Architecture (Charter §20):** Cross-module side effects live in `apps/core/signals.py`:
   - `Deal(stage='won')` → creates `erp.InternalProject`
   - `store.Order(paid)` → creates/updates `crm.Client`
   - `contracts.Quote(accepted)` → creates `erp.Invoice` (in same transaction)
   - Low stock → `notifications.Notification` triggered

5. **State Machines:** Status transitions on Incident, Ticket, Deal, ServiceContract, PurchaseOrder are validated in the service layer. Invalid transitions raise `ValidationError`.

6. **Serializers:** Always use explicit `fields = [...]`. Never use `fields = '__all__'`.

7. **SoftDelete:** `SoftDeleteModel.delete()` sets `is_deleted=True` and emits a Django `post_delete` signal so external listeners still fire.

8. **Password Reset:** Uses Django's `default_token_generator` (UID + token), `send_mail`, and anti-enumeration protection (always returns HTTP 200).

---

## 5. Frontend Architecture (React)

Located in `frontend/` using **Feature-Sliced Design (FSD)**.

### Directory Layout
```text
frontend/src/
├── apps/               # Feature modules (pages + routes per domain)
│   ├── auth/           # Login, registration, password reset
│   ├── cms/            # Admin CMS Dashboard & Page Editor [NEW]
│   ├── crm/            # Pipeline, clients, deals, contacts
│   ├── dashboard/      # CommandCenter.jsx — Admin Suite BFF
│   ├── erp/            # Invoices, expenses, projects
│   ├── hrm/            # HR dashboard [stub — backend ready at /api/hrm/]
│   ├── marketing/      # Campaigns
│   ├── scm/            # Inventory, vendors [stub — backend ready at /api/scm/]
│   ├── soc/            # Security Operations Center UI
│   ├── store/          # E-commerce, checkout, subscriptions
│   ├── support/        # Helpdesk ticketing
│   ├── users/          # Account settings
│   └── website/        # Public landing pages
├── core/
│   ├── api/            # Axios service clients, one per domain module
│   │   ├── cmsService.js       # → /api/home/pages/
│   │   ├── platformService.js  # Security Platform → /api/security/ (not /api/platform/)
│   │   ├── crmService.js
│   │   ├── storeService.js
│   │   ├── hrmService.js       # → /api/hrm/
│   │   └── scmService.js       # → /api/scm/
│   ├── components/     # Reusable UI primitives (Buttons, Modals, Tables, Forms)
│   ├── context/        # AuthContext, TenantContext
│   ├── hooks/          # Shared custom React hooks
│   ├── layouts/        # PublicLayout, ConsoleLayout, ModuleLayout
│   └── routes/         # App.jsx, EnterpriseRouter.jsx, PortalRoutes.jsx
```

### Frontend Rules & Patterns

1. **Dual Router Strategy:**
   - `EnterpriseRouter.jsx` → `/admin/*` — restricted to `SUPER_ADMIN` / `TENANT_ADMIN` — renders the Command Center sidebar and BFF dashboard.
   - `PortalRoutes.jsx` → `/*` — accessible to standard users, shoppers, and employees.

2. **Subscription Guard:** Route-level `SubscriptionGuard` checks `included_modules` on the active `billing.Plan` before rendering gated enterprise features.

3. **API Services:** Each module has its own `*Service.js`. The Security Platform uses `platformService.js` which calls `/api/security/` — **not** `/api/platform/` (that route does not exist).

4. **Component Scope:** Module-specific components live in `src/apps/<module>/components/`. Shared components live in `src/core/components/`.

5. **Styling:** Tailwind CSS. Do not add standalone `.css` files unless for global animations in `index.css`.

---

## 6. Key Business Workflows

### A — Customer Purchases a SaaS Plan
```
User registers → billing.Plan selected → billing.subscribe()
→ Stripe Checkout → webhook fires → billing.Subscription activated
→ SubscriptionGuard grants access to included_modules
```

### B — MSP Client Onboarding (Full Cycle)
```
crm.Lead → qualified → crm.Deal (pipeline)
→ Deal won → contracts.Quote drafted → sent → accepted
→ Quote.accept() transaction: erp.Invoice auto-created
→ contracts.ServiceContract created, linked to SLATier
→ core.signal: erp.InternalProject created (service obligation)
→ soc.Workspace created → soc.ManagedEndpoints registered (ITAM)
```

### C — Support Ticket + SLA Enforcement
```
support.Ticket created → matched to client's contracts.ServiceContract
→ contracts.SLATier defines first_response_hours
→ Response not posted in time → contracts.SLABreach auto-logged
→ Breach → notifications.Notification fired → soc.Alert raised
```

### D — Physical Hardware Sale
```
store.Order (product_type='physical') paid via Stripe
→ scm.InventoryItem.quantity_on_hand decremented
→ Shipment tracked → order fulfilled
→ quantity_on_hand ≤ reorder_level → low_stock alert
→ scm.PurchaseOrder created → vendor confirms → PO received
→ /purchase-orders/{id}/receive/ → InventoryItem auto-restocked
```

---

## 7. Production Infrastructure

| Component | Development | Production |
|---|---|---|
| Database | SQLite | PostgreSQL |
| Cache | None | Redis |
| File Storage | Local `media/` | AWS S3 / Cloudflare R2 |
| Email | Gmail SMTP (dev) | SendGrid or AWS SES |
| Task Queue | Synchronous | Celery + Redis |
| Payments | Stripe test keys | Stripe live keys (env var) |
| Deployment | `runserver` | Docker + Gunicorn + NGINX |
| SSL | None | Let's Encrypt / Cloudflare |
| Secrets | `.env` file | Environment variables only |

```bash
# Run production server
DJANGO_SETTINGS_MODULE=config.settings.prod gunicorn config.wsgi:application
```

---

## 8. Development Setup

```bash
# Backend
cd backend
python manage.py migrate
python manage.py runserver
# Default admin: admin@bitguard.tech / admin

# Seed test data
python scripts/data.py

# Frontend
cd frontend
npm install
npm run dev
```

---

## 9. Scaffolding a New Module

Follow these steps when adding a new business domain app:

1. `mkdir apps/<name> && python manage.py startapp <name> apps/<name>`
2. Update `apps/<name>/apps.py`: set `name = 'apps.<name>'` and `label = '<name>'`
3. Write `models.py` — inherit `TenantAwareModel`, `UUIDPrimaryKeyModel`, `TimeStampedModel`
4. Write `services.py` — inherit `BaseService`, add `AuditService.log_action()` to mutations
5. Write `serializers.py` — use explicit `fields = [...]`, no `fields = '__all__'`
6. Write `views.py` — delegate all logic to service methods
7. Write `urls.py` — use `DefaultRouter`
8. Register in `INSTALLED_APPS` in `config/settings/base.py`
9. Add `path('<name>/', include('apps.<name>.urls'))` to `api/urls.py`
10. `python manage.py makemigrations <name> && python manage.py migrate`
11. Create `frontend/src/apps/<name>/` with `pages/` and `routes/`
12. Add `<name>Service.js` in `frontend/src/core/api/`
