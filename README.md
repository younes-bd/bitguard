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


Email: contact@bitguard.tech
Password: youness

\\wsl$\

Quick start:
# 1. Remove the broken environment
rm -rf venv

# 2. Create a fresh virtual environment
python3 -m venv venv --clear

# 3. Activate it
source venv/bin/activate

# 4. Upgrade pip and install all requirements

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