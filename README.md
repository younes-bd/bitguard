BitGuard Final Fullstack Package

Includes:
- Django backend with server-rendered templates (dark cyber theme), models, serializers, API endpoints and admin.
- React frontend in /frontend that consumes APIs: products, auth tokens, dashboard.
- Stripe checkout redirect, webhook placeholder, secure download endpoint.
- JWT auth via SimpleJWT.

Email: admin@bitguard.tech
Password: admin

Quick start:
1) irm https://claude.ai/install.ps1 | iex (Windows) or curl -fsSL https://claude.ai/install.sh | bash (Linux/macOS)
2) python3 -m venv venv
3) source venv/bin/activate
4) pip install -r requirements.txt
5) cp .env.example .env and set keys
6) python3 manage.py makemigrations && python3 manage.py migrate
7) python3 manage.py createsuperuser
8) python3 manage.py data.py
9) python3 manage.py runserver

Frontend: cd frontend; npm install; npm start

Load and apply the BitGuard Platform Charter (CHARTER.md).

3️⃣ Recommended Production-Ready Structure

Here’s a professional, industry-standard structure for a BitGuard tech platform:

backend/ (or bitguard/)  # Django project root
├─ config/              # Core Django settings
│  ├─ settings/
│  │  ├─ base.py
│  │  ├─ dev.py
│  │  ├─ prod.py
├─ apps/                # Backend Business Modules
│  ├─ auth/             # Authentication, permissions, roles
│  ├─ users/            # Users, profiles
│  ├─ crm/               # Customers, tickets, alerts
│  ├─ erp/               # Inventory, operations, reporting
│  ├─ store/             # E-commerce, products, orders, payments
│  ├─ website/           # Homepage management
│  ├─ ai_engine/         # AI/automation integrations
│  ├─ automation/        # Scheduled jobs, background tasks
│  ├─ blog/              # Content management
│  ├─ security/          # Logging, monitoring, alerts
│  └─ tenants/           # Multi-tenancy management
├─ scripts/
│  ├─ populate_store.py
│  └─ start_servers.sh
├─ requirements/
├─ docker/
├─ .env
├─ README.md
└─ manage.py

1. New Frontend Folder Architecture (frontend/src/apps/)
We will create a new src/apps/ directory to mirror the exact modules present in the backend/apps/ folder. This ensures 1:1 parity across the entire stack. Each frontend app will encapsulate its own pages/, components/, api/, and routes/.

auth/: Login, Register, Forgot Password, and IAM (Identity) pages.
users/: Account settings, Personal Info, People/Profiles.
crm/: Customers, Leads, Deals, Activities.
erp/: Finance, Tasks, Invoices, Billing, HRM, SCM.
soc/: Alerts, Incidents, Threat Intelligence.
store/: Product Catalog, Orders, Store Settings.
website/: Landing Page, About, Contact, Services (formerly home).
dashboard/: Enterprise Admin Panel, Command Center, Logs (formerly admin).

API Routes:
/api/store/        ← Commerce
/api/billing/      ← Subscriptions, Plans
/api/erp/          ← Invoices, Projects
/api/crm/          ← Pipeline, Clients, Deals
/api/contracts/    ← SLA, Quotes, Contracts
/api/support/      ← Tickets
/api/security/     ← SOC + Security Platform
/api/hrm/          ← Employees, Leave, Time
/api/scm/          ← Vendors, Inventory, POs
/api/auth/         ← JWT, Password Reset
/api/tenants/      ← Multi-tenancy
/api/dashboard/    ← BFF Command Center
/api/marketing/    ← Campaigns
