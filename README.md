BitGuard Final Fullstack Package
# COMPANY IDENTITY DIRECTIVE — PERMANENT

> **THIS IS THE MOST IMPORTANT RULE IN THIS FILE.**
>
> BitGuard is a **Do-It-All Managed Service Provider (MSP) and Full-Service IT Enterprise**. It is NOT a cybersecurity SaaS company. It is NOT a SOC monitoring platform. It is a comprehensive IT services company that offers ALL of the following service pillars equally:
>
> 1. **Managed IT Services** — Helpdesk, NOC, Co-Managed IT, Hardware Procurement, Disaster Recovery
> 2. **Web Development & Digital** — Custom Web Dev, E-Commerce Platforms, App Development, UI/UX Design
> 3. **AI & Automation** — AI Workflow Automation, LLM Integration, Business Intelligence, Data Analytics
> 4. **Cloud & Infrastructure** — Azure/AWS Migrations, Microsoft 365, VDI, VoIP, Structured Cabling
> 5. **Cybersecurity** — Managed SOC/MDR, Penetration Testing, Compliance (vCISO), Zero Trust
> 6. **Physical Security** — Camera Surveillance, Access Control, Alarm Systems, Structured Cabling
> 7. **Digital Transformation** — Legacy modernization, ERP/CRM implementations, process automation


Context
You are working on BitGuard ERP, a full-stack ERP application built with:

Backend: Django REST Framework (DRF), PostgreSQL, multi-tenant architecture
Frontend: React 18, Vite, Tailwind CSS, Lucide React icons, React Router v6
Architecture: Modular ERP inspired by Odoo — each feature is a "module" (app) with a __manifest__.py, a Django app, and a React app

The codebase structure for each module follows this pattern:

backend/apps/<module_name>/
  __manifest__.py          ← module metadata
  domain/models.py         ← Django models
  api/views.py             ← DRF ViewSets
  api/serializers.py       ← DRF Serializers
  api/urls.py              ← URL routing
frontend/src/apps/<module_name>/
  pages/                   ← React page components
  api/                     ← API service functions
  config/menu.js           ← Sidebar menu config
  routes/<name>AdminRoutes.jsx  ← React Router route definitions
CONTEXT


Email: contact@bitguard.tech
Password: youness


Quick start:
# 1. Remove the broken environment
rm -rf venv

# 2. Create a fresh virtual environment
python3 -m venv venv --clear

# 3. Activate it
source venv/bin/activate

# 4. Upgrade pip and install all requirements
\\wsl$\
pip install --upgrade pip
pip install -r requirements.txt
1) cd backend
2) python3 -m venv venv
3) source venv/bin/activate
4) cd requirements
5) pip install -r base.txt
7) cp .env.example .env and set keys
8) python3 manage.py makemigrations && python3 manage.py migrate
8) python3 manage.py createsuperuser
9) python3 manage.py data.py
10) python3 manage.py runserver
python manage.py check                  # No system check errors
python manage.py shell
python manage.py remove_stale_contenttypes --noinput
pytest apps/erp apps/scm apps/accounting
python manage.py makemigrations --check # No unmigrated model changes
python manage.py showmigrations system
python manage.py test apps.crm          # All ERP tests pass
11) Frontend: cd frontend; npm install; npm start npm run dev
celery -A config worker -l info 
celery -A config beat -l info
python manage.py test apps.crm.tests
python manage.py sync_modules
cd backend
./venv/bin/python manage.py shell
from django.core.cache import cache
cache.clear()
echo "from django.core.cache import cache; cache.clear()" | ./venv/bin/python manage.py shell
Load and apply the BitGuard Platform Charter (CHARTER.md).
git status
git add .
git commit -am "Update: Describe what you changed here"
git push origin main

postgresql

sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
sudo -u postgres psql -c "CREATE DATABASE bitguard;"
sudo -u postgres psql -c "CREATE USER youness WITH PASSWORD 'admin';"
sudo -u postgres psql -c "ALTER ROLE youness SET client_encoding TO 'utf8';"
sudo -u postgres psql -c "ALTER ROLE youness SET default_transaction_isolation TO 'read committed';"
sudo -u postgres psql -c "ALTER ROLE youness SET timezone TO 'UTC';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE bitguard TO youness;"
pip install psycopg2-binary


curl -fsSL https://claude.ai/install.sh | bash
1) irm https://claude.ai/install.ps1 | iex (Windows) or curl -fsSL https://claude.ai/install.sh | bash (Linux/macOS)

Step 1 — Create a public repo on GitHub

Go to GitHub and log in.
Click "+" → "New repository".
Give it a name (e.g., bitguard).
Set Public.
Don't initialize with README (we'll push your local code).
Click Create repository.
After creation, GitHub will show commands to push existing repo — copy those.

Step 2 — Open Git Bash (or terminal) on your PC

Navigate to your project folder:
cd path/to/your/project
Check if it's already a git repo:
git status
If you see fatal: not a git repository, run:
git init
If it's already a repo, skip this.

Step 3 — Add your files

git add .
git commit -m "Initial commit - BitGuard project"
This stages and commits all files.


Step 4 — Connect to GitHub

Use the URL from Step 1. It will look like:
https://github.com/younes-bd/bitguard.git

Note: To authenticate silently, paste your Personal Access Token in the URL:
git remote set-url origin https://<YOUR_GITHUB_TOKEN>@github.com/younes-bd/bitguard.git

Step 5 — Push your code to GitHub

git branch -M main
git push -u origin main
This sends your code to GitHub.
Now your repo is public.

Step 6 — Copy the repo link

Once pushed, your repo URL will be:

https://github.com/younes-bd/bitguard

This is the link you give me.

npm install eslint-plugin-boundaries --save-dev
npm install
npm run lint --fix

1. New Frontend Folder Architecture (frontend/src/apps/)
We will create a new src/apps/ directory to mirror the exact modules present in the backend/apps/ folder. This ensures 1:1 parity across the entire stack. Each frontend app will encapsulate its own pages/, components/, api/, and routes/.


"Run /scaffold-module for a new Support app"
"Run /scaffold-module for a new Marketing Campaign App"


Workflow Diagram showing how your platform should operate as a unified tech company management system: Website Visitor → CRM Lead → Deal Pipeline → Contract → Invoice → Billing → Client Portal → Support → SOC → Projects → HRM → SCM → ITAM → Reports.


I just want you to audit my website and make sure it matches with enterprise grade like my IT enterprise that offers SaaS services and managed services and like other IT enterprise. But I want you to make a full audit including the navigation bar, the headers, the sections, all of the pages of my website module and make it much with enterprise grade. Give me a audit, please. 

SYSTEM CONTEXT
You are refactoring BitGuard Enterprise Platform, a multi-tenant ERP SaaS built on:

Backend: Django 5 + Django REST Framework (DRF), following Domain-Driven Design (DDD) for internal business logic.
Frontend: React 18 + Vite, following Feature-Sliced Design (FSD).
Architecture: Registry-Driven Plugin Architecture for 100% decoupling (see ARCHITECTURE_REGISTRY_MIGRATION.md).
Root path: c:\Users\youne\Desktop\2-InfoTech\website\website13\
The platform has 53 frontend app modules and 40+ backend app modules. An automated deep audit has identified 38 total violations (24 frontend, 14 backend). Your job is to fix ALL of them without breaking any existing functionality.

CRITICAL OPERATING RULE: Never break a working feature to achieve modularity. Every fix must be a clean refactor: same behavior, stricter boundaries.

Phase 1 — Foundation (no risk of breakage)
  ├── A4: Register missing apps in api/urls.py (additive only)
  ├── A5: Fix AppConfig labels (low-risk with care)
  ├── B2: Eliminate inline API calls (pure refactor, no behavior change)
  └── B1: Fix flat directory structure (move files + update imports)

Phase 2 — Service Layer (moderate complexity)
  ├── A1: Create services.py for 27 apps (move logic, don't delete)
  ├── A2: Add missing AuditService calls (additive only)
  └── A3: Fix serializer fields (be careful not to break API contracts)

Phase 3 — Structural Boundaries (higher complexity)
  ├── A6: Fix cross-app model imports → string references
  ├── A7: Fix base class inheritance (requires migration)
  ├── B3: Remove cross-module component imports
  ├── B4: Fix cross-module API imports → backend orchestration
  └── B5: Fix core importing from apps

Phase 4 — Architectural Patterns (advanced)
  ├── A8: Centralize signals in core/signals.py
  └── B6: Implement app registry for BackendRoutes


🔴 Fix all hardcoded company data and credentials (move to env vars and tenant context)
🔴 Add QuerySet-level tenant isolation to ALL ViewSets
🔴 Fix WebSocket authentication
🔴 Implement atomic transactions on all state transitions
⚠️ Add read_only_fields to all serializers
⚠️ Move business logic from views to services across all modules
⚠️ Implement React Query for server state
⚠️ Complete Lead→Order→Invoice→Payment frontend flow
⚠️ Link Helpdesk tickets to ServiceContracts
⚠️ Add DB indexes on high-query fields
📋 Remove all console.log statements
📋 Add Error Boundary to React app
📋 Complete "coming soon" stubs (payroll, reporting exports, appointments)
📋 Standardize FSD folder structure across all 54 frontend modules
Implement read_only_fields on all model serializers to protect audit fields.
Apply select_related and prefetch_related to complex ViewSets to prevent N+1 query issues.
Add database indexes to high-query fields (Ticket.status, Invoice.due_date, Notification.user).
Add robust file upload security validation (extensions and size limits).



Module	Documents Required

Accounting	
Invoice, Credit Note, Vendor Bill, Payment Receipt, Statement of Account, Aged Receivables Report, Aged Payables Report, Bank Reconciliation Report, Tax Report (VAT), Trial Balance, P&L, Balance Sheet

Sales
Quotation/Proposal, Sales Order Confirmation, Delivery Order, Proforma Invoice, Customer Portal Order Summary

Purchases	
Purchase Order, Request for Quotation (RFQ), Goods Receipt Note (GRN), Vendor Bill confirmation

Inventory/Stock
Delivery Slip, Reception Report, Inventory Adjustment Report, Picking List, Packing List, Barcode Label, Stock Valuation Report

HR
Employment Contract, Payslip, Leave Request, Expense Report, Employee Badge

CRM	
Meeting/Activity Report, Pipeline Summary

Projects	
Project Status Report, Timesheet Report

E-sign
 / EDMS	Document templates with signature blocks


"Act as a Senior Tier-1 ERP Architect. Audit my codebase for Domain Leakage, Separation of Concerns (SoC) violations, and Architectural Inversions. Specifically, verify that downstream business plugins are perfectly encapsulated and are not accidentally hosting global dispatchers, system infrastructure, or cross-module orchestrators that rightfully belong in the core or system modules



Layer 3 — Business Plugins (application: True) ✅
All 61 business plugin modules are correctly classified with application: True. Sections are now correct after this session's pillar fix:

Administration: system(1), apps(2), soc(3), studio(99), agents(98)
Sales: sales(1), crm(2), pos(3), subscriptions(4), rental(5), amazon(6)
Services: projects(1), timesheets(2), dispatch(3), helpdesk(4), planning(5), appointments(6)
Accounting: accounting(1), invoicing(2), consolidation(3), documents(3⚠), sign(4⚠), spreadsheet(4⚠), esg(5), equity(6), expenses(7)
Inventory: inventory(1), procurement(2), barcode(3)
Manufacturing: manufacturing(1), production(2), maintenance(4), quality(5), repair(6), iot(7)
Website: website(1), ecommerce(2), learning(3), forum(4), blog(5)
Marketing: campaigns(1⚠), journeys(1⚠), sms(2), events(3), social(4⚠), surveys(4⚠)
Human Resources: employees(1), recruiting(2), timeoff(3), timeclock(4), frontdesk(5), payroll(6), performance(8), referrals(8), fleet(10), lunch(11)
Discuss: discuss(3), voip(8), messaging(6), whatsapp(3)
Productivity: tasks(2), approvals(5), knowledge(6), calendar(7), analytics(5)



General Settings          ← Hardcoded kernel (system app)
─────────────────────────
Users & Companies         ← Static inject (users app)
  Users
  Companies
  User Groups
  Active Sessions
─────────────────────────
Translations              ← Hardcoded kernel (system app)
  Languages
  Export Translations
  Import Translations
─────────────────────────
Email / Discuss           ← Static inject (inbox/discuss app)
  Outgoing Mail Servers
  Incoming Mail Servers
  Email Templates
  Channels
─────────────────────────
Financial                 ← Hardcoded kernel (system app)
  Financial & Banking
  Currencies
─────────────────────────
Technical                 ← Hardcoded kernel + static injects
  System Parameters       ← kernel
  Scheduled Actions       ← kernel
  Automated Actions       ← automation app inject
  Webhooks                ← automation app inject
  Document Layouts        ← kernel
  Sequences               ← kernel
  Menu Sequences          ← kernel
  Access Rights           ← users app inject
  Record Rules            ← users app inject
  Security Policy         ← users app inject
  Virtual Agents          ← ai_engine app inject
  Audit Logs              ← kernel
  Server Logs             ← kernel
  Backup & Restore        ← kernel
  Integration Keys        ← kernel
─────────────────────────
[Dynamic — from backend InstalledModule manifest]
Sales                     ← if sales module is_installed
  Settings (/admin/settings/sales)
Inventory                 ← if inventory module is_installed
  Settings (/admin/settings/inventory)
Accounting                ← if accounting module is_installed
  Settings (/admin/settings/accounting)
CRM                       ← if crm module is_installed
  Settings (/admin/settings/crm)
eCommerce                 ← if ecommerce module is_installed
  Settings (/admin/settings/ecommerce)
Website                   ← if website module is_installed
  Settings (/admin/settings/website)
Employees                 ← if employees module is_installed
  Settings (/admin/settings/employees)
Manufacturing             ← if manufacturing module is_installed
  Settings (/admin/settings/manufacturing)
Helpdesk                  ← if helpdesk module is_installed
  Settings (/admin/settings/helpdesk)