BitGuard Final Fullstack Package

Includes:
- Django backend with server-rendered templates (dark cyber theme), models, serializers, API endpoints and admin.
- React frontend in /frontend that consumes APIs: products, auth tokens, dashboard.
- Stripe checkout redirect, webhook placeholder, secure download endpoint.
- JWT auth via SimpleJWT.

Email: admin@bitguard.tech
Password: admin
follo AI_INSTRUCTIONS.md

Quick start:

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
pytest apps/erp apps/scm apps/accounting
python manage.py makemigrations --check # No unmigrated model changes
python manage.py test apps.erp          # All ERP tests pass
11) Frontend: cd frontend; npm install; npm start npm run dev
celery -A config worker -l info 
celery -A config beat -l info
python manage.py test apps.crm.tests
python manage.py test apps.accounting.tests
python manage.py test apps.projects.tests
python manage.py test apps.scm.tests
python manage.py test apps.hrm.tests
python manage.py sync_modules

Load and apply the BitGuard Platform Charter (CHARTER.md).
git status
git add .
git commit -am "Update: Describe what you changed here"
git push origin main

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


3️⃣ Recommended Production-Ready Structure

Here’s a professional, industry-standard structure for a BitGuard tech platform:

backend/ (or bitguard/)  # Django project root
├─ config/              # Core Django settings
│  ├─ settings/
│  │  ├─ base.py
│  │  ├─ dev.py
│  │  ├─ prod.py
├─ apps/                 # Backend Business Modules
│  ├─ auth/              # Authentication, permissions, roles
│  ├─ users/             # Users, profiles
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

"Run /scaffold-module for a new Support app"
"Run /scaffold-module for a new Marketing Campaign App"


Workflow Diagram showing how your platform should operate as a unified tech company management system: Website Visitor → CRM Lead → Deal Pipeline → Contract → Invoice → Billing → Client Portal → Support → SOC → Projects → HRM → SCM → ITAM → Reports.


I just want you to audit my website and make sure it matches with enterprise grade like my IT enterprise that offers SaaS services and managed services and like other IT enterprise. But I want you to make a full audit including the navigation bar, the headers, the sections, all of the pages of my website module and make it much with enterprise grade. Give me a audit, please. 