---
name: Enterprise Architecture Rules
description: Enforces Tier-1 ERP standards (Odoo modularity, Headless APIs, React SPA) for the BitGuard platform.
trigger: always_on
---

# BitGuard Enterprise Architecture Directives

You are operating within a Tier-1 Headless ERP platform. You must strictly adhere to the following architectural pillars regardless of which AI Model (Gemini, Claude, GPT) is currently active. Failure to follow these rules will result in catastrophic system fragmentation.

## 0. The Architecture Definition
If asked to define the system architecture, the exact technical definition is:
**"A Headless React SPA communicating via REST with a Modular Django Monolith."**
*   **Headless/Decoupled:** The frontend (React) and backend (Django) are completely physically separated. The backend sends pure JSON data; it does not render HTML or serve the UI.
*   **Modular Monolith:** The backend runs as a single unified server process (Monolith) rather than complex Microservices, but the code is strictly isolated into heavily decoupled plugin folders (`backend/apps/`).

## 1. Modular Encapsulation (The Odoo Backend Standard)
*   **Absolute Isolation:** Every business domain (`users`, `system`, `auth`, `inventory`, etc.) must be completely isolated within its own application folder in `backend/apps/`.
*   **The Manifest Law:** Every backend module MUST contain a strict `__manifest__.py` file declaring its technical name, dependencies, and configuration.
*   **No Spaghetti Code:** Applications must not have hard-coupled circular dependencies. If Module A requires Module B, Module B must be explicitly declared in Module A's `depends` array inside the manifest.
*   **Independent Lifecycles:** All modules must remain independently installable, upgradable, and uninstallable without breaking the core system.

## 2. Headless API-First Design
*   **The Data Plane:** The Django backend is strictly a Data/Logic Plane. It must NEVER render HTML, inject scripts, or concern itself with the UI.
*   **Pure JSON Communication:** All data transmission between the frontend and backend must occur via strictly typed REST JSON APIs.
*   **Domain-Driven Design (DDD):** Inside the backend, Views/Controllers are only used for orchestration and routing. Pure business calculations and database mutations must be delegated to dedicated Service layers (`services.py`).

## 3. Dynamic React SPA & Global State Synchronization
*   **Single Page Application (SPA):** The frontend (`frontend/src/`) is a decoupled React SPA. It must remain buttery-smooth and lightning-fast.
*   **No Jarring Reloads:** You are strictly forbidden from using lazy `window.location.reload()` hacks to refresh data. 
*   **Manifest Context Sync:** When major architectural events occur (e.g., installing or uninstalling a module via the App Store), you MUST use the global React Context (`useManifest()`, `await refreshManifest()`) to dynamically redraw sidebars, dashboards, and active routes instantly in memory.
*   **Feature-Sliced Design (FSD):** Frontend code must be logically grouped by Feature/Domain (e.g., `apps/apps/pages/`, `apps/settings/api/`), strictly avoiding chaotic flat folder structures.
*   **The "Page" Suffix Mandate (Smart vs Dumb Components):** All top-level route container components (components that act as the main screen for a URL route and handle data fetching/layout) MUST be named with the `Page` suffix (e.g., `SalesDashboardPage.jsx`, `SettingsPage.jsx`). This mathematically separates "smart" route containers from "dumb" reusable UI widgets (like `DashboardChart.jsx`), aligning with modern enterprise React standards.

## 4. Multi-Tenancy (Micro-SaaS) & Security
*   **Tenant Isolation:** All database queries and API endpoints must strictly filter by `tenant` (unless operating within the absolute root `auth` gateway). Data bleed between companies is a Tier-0 critical security failure.
*   **Gateway Separation:** The `/login` and authentication flows are Root Gateways. Do not mix unauthenticated gateway routes into the protected `/admin/*` namespace.
*   **The Tenant Naming & Layer Law:** Multi-Tenancy is the fundamental physics of the ERP and belongs strictly in the **Layer 1 Kernel** (`tenants` module), mirroring modern enterprise SaaS structures (like Salesforce's Org ID). 
    *   **Backend Terminology:** The backend module and database models MUST use the term `Tenant` (e.g., `TenantAwareModel`, `tenant_id`). This is the strict mathematical term for data isolation.
    *   **Frontend Terminology:** The frontend UI must NEVER show the word "Tenant" to the end-user. It must be translated to business-friendly terms such as "Companies", "Organizations", or "Workspaces" (e.g., the menu item is "Companies").

## 5. Registry-Driven Plug-and-Play Architecture
*   **Dynamic Discovery (No Hardcoding):** Frontend UI elements (like Sidebars, Settings panels, and Command Center tiles) must NEVER be hardcoded into the global layout files. They must be automatically discovered via dynamic registries (e.g., using Vite's `import.meta.glob()` on `menu.js` files).
*   **Backend Global Registry Pattern:** The Backend API Routing (and other core integrations) must completely adhere to the Global Registry Pattern. The master router/core must have *zero* hardcoded knowledge of downstream apps or integrations (no `try/except` filesystem crawling or checking `if app.startswith()`). Instead, the core provides a singleton registry, and apps explicitly register their routes (e.g., in their `apps.py` `ready()` method) or use Django's native `AppConfig` registry to expose their endpoints.
*   **True Plug-and-Play:** A new module placed into the `apps/` directory must automatically hook into the global navigation simply by providing its own `config/menu.js`. The core system must seamlessly integrate it without requiring manual code changes in the core router.
*   **Loose Coupling:** Modules must register their capabilities (like dashboard widgets, reports engines, or API URLs) into a central registry rather than directly mutating the core application.

### 5B. The Headless Dual-Registry Law (Data vs. UI)
Because this is a decoupled Headless SPA, the Python backend cannot serve React `.jsx` components. Therefore, cross-module aggregators (like Dashboards, Analytics, or global Settings) must mathematically enforce a Dual-Registry approach to prevent Domain Leakage:
*   **The Backend Registry (Data Plane):** The backend strictly handles aggregating raw data and KPIs. The kernel (`core`) broadcasts a discovery loop (e.g., scanning for `services/kpi.py` or `services/analytics.py` inside installed apps) and exposes a single unified JSON endpoint for the frontend. Both files MUST live inside the app's `services/` directory to comply with Rule 11 (Fat Services, Skinny Views). Placing `kpi.py` or `analytics.py` at the app root is a Rule 11 violation.
*   **The Frontend Registry (UI Plane):** The React SPA strictly handles component rendering and routing. Cross-module apps (like `analytics`) MUST NOT hardcode static imports to downstream reports (e.g., `import CrmReport`). Furthermore, analytics `.jsx` components MUST physically live inside their owning module's directory (e.g., `apps/crm/pages/analytics/`). The frontend layout must use Vite's `import.meta.glob()` to dynamically discover and mount these external components strictly based on the backend's active manifest.

### 5C. The Registry Selection Law (When to use Backend vs. Frontend Registry)
When deciding which registry pattern to apply for a module's integration, an AI agent or developer MUST apply this strict decision test. Choosing the wrong registry is a Tier-0 architectural violation.

*   **Use the Backend Registry** (e.g., `kpi_registry`, `_scheduled_actions_registry`, `_api_routes`) when the module contributes **scalar data** to a global UI: numbers, labels, status flags, boolean toggles, or executable Python functions (e.g., scheduled tasks, automated action rules). The backend aggregates all contributions into a single unified JSON API endpoint. A single generic frontend component (like `<KpiCard />`) consumes this endpoint and renders all items uniformly.
    *   ✅ KPI tiles on the Command Center dashboard.
    *   ✅ Scheduled Action definitions.
    *   ✅ Automated Action (rule builder) definitions.
    *   ✅ API URL routing registration.

*   **Use the Frontend Vite Registry** (`import.meta.glob` + `{module}/config/analytics_plugin.js`) when the module contributes a **rich, interactive UI component** to a global shell app: charts, Kanban boards, drag-and-drop interfaces, filtered data tables, or any feature requiring complex React state and libraries (e.g., Recharts, DnD). The backend cannot describe this complexity in a flat JSON schema.
    *   ✅ Analytics dashboard charts per module (e.g., CRM funnel chart, Finance P&L chart).
    *   ✅ App-specific configuration panels inside a global Settings shell.
    *   ✅ Module-specific dashboard widgets inside a Dashboards builder.

*   **The Authorization Boundary is always the Backend:** Regardless of which registry is used, the Backend `InstalledModule` manifest (served via `useManifest()`) is always the final authority on whether a component or link is permitted to render. The Frontend must always cross-reference against this manifest before mounting any dynamically discovered component.

*   **Naming Law for Backend Analytics Files:** When a module needs to expose chart data to the Analytics shell, the backend service file MUST be named `analytics.py` (inside `services/`) and its view file `analytics_views.py` (inside `api/`). The filename `reports.py` is strictly reserved for the dedicated `reports` module which handles PDF/Excel/printable document generation only. Mixing these two concerns is a fatal naming violation.

### 5D. The Settings Host vs. Plugin Paradigm
The global Settings screen operates on a strict Host/Plugin mechanism using Vite's `import.meta.glob`.
*   **The Host (`system`):** The `system` module acts as the motherboard. It hardcodes its own base routes (General Settings, Logs) directly into its master `settingsAdminRoutes.jsx`. It does *not* use a plugin hook for itself.
*   **The Plugins (`users`, `reports`, etc.):** Downstream modules that require settings panels must provide a file named EXACTLY `settingsRoutes.jsx`. This breaks the standard `[appName]AdminRoutes.jsx` naming convention on purpose. The filename must be strictly identical across all modules so the Host can blindly discover and inject them without hardcoded imports.

## 6. ORM-Level Row Security (RLS)
*   **The Mixin Mandate:** Every single database model that belongs to a tenant MUST inherit from `TenantAwareModel`. The database enforces security at the lowest possible layer.
*   **Record Rules:** Similar to Odoo's `ir.rule`, domain-level security is enforced via `RecordRule` models, ensuring that even if a view is exposed, the ORM mathematically prevents users from querying rows they don't own.

## 7. Real-Time Event Broadcasting
*   **Unified WebSocket Gateway:** The frontend relies on a unified WebSocket connection (`NotificationContext`) to listen for server-side events, background task completions, and discuss messages.
*   **Graceful Polling Fallback:** The AI must ensure that any real-time feature degrades gracefully to HTTP polling if the WebSocket connection drops, maintaining enterprise reliability.

## 8. Event-Driven Extensibility (Webhooks)
*   **Out-of-Band Integrations:** The platform uses `WebhookEndpoint` models to dispatch asynchronous events to third-party systems. Code should emit generic signals (e.g., `invoice_paid`) rather than hardcoding HTTP requests to external APIs.

**CRITICAL DIRECTIVE ON ARCHITECTURE MAPS:** 
The `.agents/rules/` are for strict behavioral laws. The exhaustive lists of all 75+ modules are kept in reference files in the root directory to save AI context window. 
Before proposing cross-module changes, creating new apps, or deciding if a module needs an API, you MUST use your file reading tools to read:
1. `SYSTEM_ARCHITECTURE_MAP.md` (for the dependency graph and module list)
2. `TIER1_ERP_ARCHITECTURE_MAP.md` (to know exactly which layer the module belongs to and its API/Dashboard status).

## 9. The Odoo Master/App Architecture (Kernel vs Plugins)
The codebase strictly follows the Tier-1 Odoo "Kernel vs Plugin" pattern to ensure infinite horizontal scaling without spaghetti code. You must respect these distinct boundaries:

### A. The Kernel (The Master OS)
The foundation of the ERP. It handles ORM, authentication, multi-tenancy, and the Command Center dispatcher. It has ZERO business logic (it does not know what an invoice or lead is).
*   **Modules:** `core`, `auth`, `tenants`
*   **Kernel Classification Rules:** A module only qualifies as Kernel if ALL of the following are true:
    1. It cannot be uninstalled without destroying the entire platform.
    2. It contains zero business logic (it has no concept of invoices, leads, or HR).
    3. It is pure infrastructure (security gateway, ORM base, tenant isolation layer).
*   **The UI Boundary Law (Strict Prohibition):** The Kernel operates purely at the data and infrastructure plane.
    *   `core` and `tenants` are **strictly forbidden** from possessing frontend React pages, routing, or dashboards inside the protected `/admin/*` workspace.
    *   `auth` is permitted to have UI, but **strictly confined** to unauthenticated public gateway pages (e.g., `/login`, `/register`). It is mathematically barred from injecting admin dashboard routes.
    *   **The Control Panel Mandate:** All administrative UI required to configure Kernel-level models (e.g., managing Companies, Scheduled Actions, System Parameters, or Security Policies) MUST be physically built and routed inside the `system` (Settings) or `users` modules. The Kernel provides the backend OS; the Settings app provides the screen.
*   **Why `auth` is Kernel:** It is the Root Security Gateway. Every API endpoint is protected by it. Removing it makes the ERP a completely open, unsecured system.
*   **Why `tenants` is Kernel:** `TenantAwareModel` and `TenantScopedMixin` are the genetic DNA of the entire database. Every model and every API depends on it for data isolation.
*   **Command Center Rule:** The `core` module acts as the master launcher. It broadcasts a signal asking installed apps for their KPIs.
*   **The IAM Decoupling Law (Auth vs. Identity):** Unlike classic monoliths (which bloat the Kernel with user interfaces), this architecture strictly separates Identity and Access Management (IAM):
    *   **`auth` (Kernel - Layer 1):** The cryptographic security gateway. It handles JWT verification and login mechanics. It is strictly headless and has ZERO React code or UI.
    *   **`users` (Shared Utility - Layer 2):** The Identity provider. It handles the business concept of an employee (Names, Profiles, UI screens). 
    *   **Ownership of Security Rules:** Because the `Role` and `User` models live in the `users` app, **Access Rights** and **Record Rules** MUST also live entirely within the `users` app (both backend models and frontend UI). Placing them in the Kernel would force the Kernel to depend on a Layer 2 app, causing a fatal Architectural Inversion.

### B. Shared Utilities & Master Data (Hidden UI)
Foundational utilities that multiple apps share. They have a frontend UI for data entry, but they DO NOT get a dashboard or Command Center tile (`application: False` in `__manifest__.py`).
*   **Modules:** `product`, `users`, `reports`, `inbox`, `shipping`, `portal`, `automation`
*   **Why `automation` is Shared Utility (not Kernel):** The `AutomatedAction` model is an event-driven visual rule-builder (equivalent to Odoo's `base_automation` addon). A business can operate without it. The true kernel-level scheduling primitive (`ScheduledAction` / `ir.cron` equivalent) already lives inside `core`. The `automation` module adds the admin-facing configuration UI on top, which classifies it as a Shared Utility.

### C. Business Plugins (The Apps)
The heavyweights. They are 100% strictly encapsulated. They do not hack into the Kernel. Instead, they use Dynamic Registries (like providing `kpi.py`) to hook into the global Command Center. They have their own dedicated dashboards (`application: True`) and are strictly grouped into the following sequence pillars:

> **Naming Convention Note:** Where this ERP uses a modern SaaS name that differs from the classic Odoo module name, the format is: `folder_name` — **Modern Name** *(Odoo: Classic Name)*. Future AI agents must always reference both names when reasoning about a module's identity.

*   **1. Sales:** `sales`, `crm`, `pos`, `subscriptions`, `rental`, `amazon` — **Amazon Connector** *(Odoo: Amazon Connector)*
*   **2. Services:** `projects` — **Project** *(Odoo: Project)*, `timesheets`, `dispatch` — **Field Service** *(Odoo: Field Service)*, `helpdesk`, `planning`, `appointments`
*   **3. Accounting & Finance:** `accounting`, `invoicing`, `consolidation`, `equity`, `documents`, `sign`, `esg`, `expenses`, `spreadsheet` — **Spreadsheet** *(Odoo: Spreadsheet — belongs to Accounting in Odoo, not Productivity)*
*   **4. Inventory:** `inventory`, `procurement` — **Purchase** *(Odoo: Purchase)*, `barcode`
*   **5. Manufacturing:** `manufacturing`, `production` — **Shop Floor** *(Odoo: Shop Floor)*, `maintenance`, `quality`, `repair`, `iot` — **IoT** *(Odoo: IoT — belongs to Manufacturing/Technical in Odoo)*
*   **6. Website:** `website`, `ecommerce`, `learning` — **eLearning** *(Odoo: eLearning)*, `forum`, `blog`
*   **7. Journeys** *(Odoo: Marketing Automation / Email Marketing group)*: `campaigns` — **Email Marketing** *(Odoo: Email Marketing)*, `sms` — **SMS Marketing** *(Odoo: SMS Marketing)*, `social` — **Social Marketing** *(Odoo: Social Marketing)*, `events`, `journeys` — **Journeys** *(Odoo: Marketing Automation)*, `surveys`
*   **8. Human Resources:** `employees`, `recruiting` — **Recruitment** *(Odoo: Recruitment)*, `timeoff` — **Time Off** *(Odoo: Time Off)*, `timeclock` — **Attendances** *(Odoo: Attendances)*, `frontdesk`, `payroll`, `performance` — **Appraisals** *(Odoo: Appraisals)*, `referrals`, `fleet`, `lunch`
*   **9. Discuss** *(Odoo: Discuss group — VoIP, Live Chat, and WhatsApp are all classified under Discuss in Odoo, not Productivity or Marketing)*: `discuss`, `voip` — **VoIP** *(Odoo: VoIP)*, `messaging` — **Live Chat** *(Odoo: Live Chat)*, `whatsapp` — **WhatsApp** *(Odoo: WhatsApp)*
*   **10. Productivity:** `tasks` — **To-Do** *(Odoo: Note/To-Do)*, `approvals`, `knowledge`, `calendar`, `analytics` — **Dashboards** *(Odoo: Board/Dashboards)*
*   **11. Administration:** `system` — **Settings** *(Odoo: Settings)*, `apps` — **App Store** *(Odoo: Apps)*, `soc` — **Security Operations Center** *(No Odoo equivalent — custom enterprise security module)*, `studio` — **Studio** *(Odoo: Studio)*, `agents` — **Agents** *(Odoo: N/A — equivalent to Salesforce Agentforce)*

### D. External Integrations
Bridges to third-party APIs. They sit outside the core ERP logic in `backend/integrations/` and quietly power features inside other apps without having their own main dashboard tile.
*   **Modules:** `payments`, `ai_engine`
*   **Note:** If an integration grows a user-facing dashboard (like `agents`), it graduates from `integrations/` into `apps/` and becomes a Business Plugin (9C).


## 10. Strictly Forbidden Anti-Patterns
To protect the integrity of the ecosystem, you must actively scan for and refuse to implement the following anti-patterns:

### A. Domain Leakage (Context Leakage)
*   **Definition:** When a module imports or manipulates the database models or internal business logic of an unrelated module.
*   **The Rule:** A downstream app (like `board` or `journeys`) MUST NEVER directly query the models of another app (like `accounting.Invoice`). It must call an API or a registered service method instead.

### B. Separation of Concerns (SoC) Violations (The God Object)
*   **Definition:** When a single class, view, or file attempts to handle logic for multiple different domains simultaneously (e.g., a massive `ExportReportView` trying to export CSVs for Sales, HR, and Security all at once).
*   **The Rule:** Logic must be decentralized. Each app is responsible for its own data aggregation, its own exports, and its own calculations.

### C. Architectural Inversion
*   **Definition:** Flipping the hierarchy upside down. 
*   **The Rule:** The Kernel (`core`, `system`, `auth`) acts as the Master Orchestrator. A downstream business plugin MUST NEVER act as a global dispatcher or master API gateway for the rest of the system.


## 11. Domain-Driven Design (DDD) & The Service Layer
To maintain a Tier-1 modular backend, the architecture strictly enforces the **"Fat Services, Skinny Views"** paradigm.

*   **The `services.py` Mandate:** All core business logic, complex database transactions, orchestrations, and external API calls MUST be encapsulated within a dedicated Service Layer (usually a `services.py` file or a `services/` directory within the app).
*   **Skinny Views / Controllers:** Django REST Framework Views and ViewSets are strictly HTTP gateways. Their ONLY jobs are:
    1. Enforcing authentication and permissions.
    2. Parsing HTTP request parameters/payloads.
    3. Calling the appropriate Service Layer function.
    4. Returning the HTTP response.
    **Never** put raw business logic or complex ORM calculations directly inside a View.
*   **Model Boundaries:** Django Models should be restricted to schema definitions, relationships, and basic data integrity constraints (e.g., simple `@property` methods). Do not overload models with heavy business processes.
*   **Cross-Domain Communication:** If App A needs to perform an action in App B, App A's service must call App B's service. It must never directly mutate App B's models.

### The Service Naming & Symmetry Law
To maintain strict Domain Symmetry across the Headless divide, frontend and backend services must perfectly align:
*   **Domain Noun Matching:** If the backend model is `SystemParameter`, the backend service file must be `system_parameters.py` and the frontend Javascript caller must be `systemParameterService.js`. Mismatched domain nouns between frontend and backend are strictly forbidden.
*   **The Suffix Rule:** Frontend files must explicitly append `Service` (camelCase) to denote HTTP callers (e.g., `auditService.js`). Backend files inside `services/` must omit the redundant `_service` suffix (snake_case) to remain clean (e.g., `audit.py`).
*   **The Master App File vs. God Object:** Every backend module must have a primary "Master" service file named exactly after the module itself (e.g., `core.py`, `users.py`, `sales.py`) for generic app-level orchestration. However, distinct database entities MUST be isolated into their own dedicated service files (e.g., `system_parameters.py`) to mathematically prevent the Master App File from bloating into a God Object (Rule 10B).

## 12. Internal Integration Patterns (Hard vs. Soft Dependencies)
When App A needs to interact with App B, developers and AI agents must strictly choose the correct integration pattern based on whether App B is **Mandatory** or **Optional**. Do not blindly decouple everything, and do not blindly create hard imports.

### A. The Hard Dependency (Service-to-Service)
*   **When to use:** When App A mathematically *cannot function* without App B (e.g., Sales *requires* Products).
*   **The Rule:** App A's service layer directly imports and calls App B's service layer (`from apps.product.services import ProductService`). 
*   **The Manifest Law:** Because a hard import will cause a fatal crash if App B is uninstalled, App A MUST declare App B in the `depends` array of its `__manifest__.py`. This allows the system to block admins from uninstalling App B.

### B. The Soft Dependency (Optional Integrations)
*   **When to use:** When App B is an *optional* enhancement. (e.g., CRM works fine alone, but if Accounting is installed, we want to auto-generate an invoice, or show invoice counts on the CRM dashboard).
*   **The Rule for WRITING (Mutating Data):** Hard Python imports are strictly illegal. App A must emit a generic Django Signal (`deal_won_signal.send()`). App A does not know or care who is listening. (Event-Driven).
*   **The Rule for READING (Fetching Data):** You cannot use Signals to fetch data synchronously for a UI. Instead, App A must use a **Safe Read Hook** by checking `apps.is_installed('apps.accounting')` before performing a local import of the Service layer.
*   **Why:** If Accounting is uninstalled, the Signal simply fires into the void (for writes), and the `is_installed()` check safely skips (for reads), allowing CRM to continue working without crashing.

### C. Dynamic Registries (UI & Dashboard Decoupling)
*   **When to use:** Aggregating data for global UIs like the Command Center, Sidebar Menus, or Settings panels.
*   **The Rule:** The Core system broadcasts a dynamic discovery loop (e.g., iterating through installed apps to find `kpi.py` or `menu.js`).
*   **Why:** It allows new business apps to instantly inject themselves into the global UI upon installation without ever modifying the Core codebase.


## 13. Non-Destructive Extensibility (The "Open/Closed" Rule)
*   **The Problem:** What happens if the `Sales` app needs to add a "Loyalty Points" field to the `User` model, but the `User` model is locked inside the `Core` kernel?
*   **The Rule:** You are strictly forbidden from opening the Kernel code to add app-specific fields. Instead, the downstream app must create a separate extension table (e.g., a `OneToOneField` profile in Django) that "attaches" to the Kernel model.
*   **Why:** This maintains true modular scalability. You can install or uninstall the downstream app, and its custom fields attach or detach automatically without permanently hacking or breaking the core Master OS.

## 14. Strict State Machines (Business Lifecycles)
*   **The Problem:** A developer writes a script that accidentally changes an Invoice from "Draft" directly to "Paid", bypassing the "Sent" and "Confirmed" stages.
*   **The Rule:** Critical business models (Invoices, Orders, Leads, Tickets) must use a structured **State Machine**. Models can only move forward or backward through explicitly defined paths (e.g., `Draft` -> `Confirmed` -> `Paid`).
*   **Why:** Code must never arbitrarily force a status change. It must transition logically to ensure that secondary triggers (like generating accounting ledger entries when moving from Confirmed to Paid) are fired correctly and safely.

## 15. Financial Data Immutability & Auditability
*   **The Problem:** A user gets mad and clicks "Delete" on a $50,000 Sales Order from last year, causing it to disappear from the database completely.
*   **The Rule:** Never use hard `DELETE` SQL commands on core business data. Use **Soft Deletes** (an `is_active = False` or `archived = True` flag). Furthermore, posted financial documents (like Invoices or Journal Entries) are mathematically **Immutable**—they can *never* be edited or deleted. 
*   **Why:** If a mistake is made on a posted financial document, a "Credit Note" or "Reversal" must be issued to cancel it out. This ensures absolute legal compliance, auditability, and prevents catastrophic data loss by end-users.

## 16. Concurrency & Idempotency (The "Double-Click" Rule)
*   **The Problem:** A user with a slow internet connection clicks the "Process Payment" button three times really fast, accidentally charging a customer's credit card three times.
*   **The Rule:** All Service Layer functions that mutate financial or critical data must be protected against race conditions. The backend must use database locks (e.g., Django's `select_for_update()`) to lock the row while processing, or use "Idempotency Keys".
*   **Why:** This mathematically guarantees that sending the exact same API request simultaneously will only result in one single action, protecting the financial and structural integrity of the database.

## 17. The Tenancy Architecture (Micro-SaaS Data Isolation)
Because this platform operates as a multi-tenant Cloud ERP, absolute data isolation between companies is the highest security priority. 

*   **Shared Database, Row-Level Isolation:** All companies (tenants) share the same underlying database, but every single business record is mathematically locked to a specific Tenant.
*   **Global Users, Local Memberships:** The User model is a global entity (a person logs in once using their email). Users are granted access to specific companies via the TenantMembership bridge model. A user can seamlessly switch their active tenant session without re-authenticating.
*   **The TenantAwareModel Law:** Every new business database model (e.g., Invoices, Leads, Products) MUST inherit from TenantAwareModel. This ensures the 	enant_id foreign key is always generated.
*   **The TenantScopedMixin Law:** You are strictly forbidden from writing API Views that manually query raw records (e.g., Invoice.objects.all()). Every Django REST Framework ViewSet MUST inherit from TenantScopedMixin. This mixin intercepts the request at the gateway level and automatically forces .filter(tenant=request.user.tenant). This guarantees that even if a developer makes a mistake, the system mathematically prevents cross-tenant data bleed.

## 18. Model-View-Serializer (MVS) Symmetry
To maintain predictability and searchability across a massive monorepo, you must enforce strict naming symmetry across the stack for any given domain entity.
*   **The Rule:** If a database model is named InstalledModule, its corresponding API gateway must be named InstalledModuleViewSet, and its serializer must be named InstalledModuleSerializer. 
*   **Forbidden:** You are strictly forbidden from arbitrarily renaming the entity across layers (e.g., calling the model InstalledModule but naming the serializer ErpModuleSerializer).
*   **Why:** MVS Symmetry ensures that a developer can globally search for a domain entity's prefix (e.g., InstalledModule) and instantly find all associated logic, serializers, and views without having to guess aliases.

## 19. Topological Dependency Directionality
To prevent circular imports and architectural collapse, you must strictly respect the flow of dependencies across the four architectural layers defined in Rule 9. Dependencies can only flow **downwards** or **horizontally via events**.

*   **1. The Kernel Layer (core, auth, tenants):** 
    *   *Allowed to import:* Nothing (only Django/Python standard libraries). 
    *   *Forbidden:* The Kernel must never import Master Data or Business Plugins.
*   **2. Master Data Layer (product, users):**
    *   *Allowed to import:* The Kernel.
    *   *Forbidden:* Master Data must never import Business Plugins (e.g., a Product cannot import an Invoice).
*   **3. Business Plugins (sales, ccounting, inventory):**
    *   *Allowed to import:* The Kernel and Master Data (Hard Dependencies).
    *   *Forbidden:* A Business Plugin MUST NEVER hard-import another Business Plugin (e.g., Sales cannot import Inventory). Horizontal communication between Business Plugins must strictly use Soft Dependencies and Signals (Rule 12B).
*   **4. External Integrations (payments, i_engine):**
    *   *Allowed to import:* The Business Plugin they are extending.
    *   *Forbidden:* Core ERP logic must never depend on an External Integration. If the internet goes down, the ERP must still function.

## 20. Registry Placement Standard (The Module Root Law)

**The Problem:** A developer creates a registry file inside a sublayer folder
(e.g., \core/api/registry.py\), implying the registry only belongs to that
sublayer. As the system grows, other layers (background workers, test suites,
management commands) need to import from that registry, creating incorrect
cross-layer dependencies.

**The Rule:** All singleton registry files MUST be placed at the **root** of
their owning module, never inside a sublayer subfolder (like \pi/\, \domain/\,
or \infrastructure/\).

**Correct:**
- \pps/core/registry.py\ — The HTTP Route Registry
- \pps/automation/registry.py\ — The Automation Blueprint Registry

**Forbidden:**
- \pps/core/api/registry.py\ — Registry buried inside the HTTP sublayer ❌
- \pps/automation/api/registry.py\ — Registry buried inside the HTTP sublayer ❌

**Why:** A registry is a cross-cutting singleton. It is consumed by the HTTP
layer, background workers, test suites, and management commands equally.
Burying it inside one sublayer folder creates a false architectural signal
that it only belongs to that layer.

## 21. Full-Stack Lexical Symmetry (The Prefix Law)

**The Problem:** Developers often create arbitrary aliases for frontend pages (e.g., naming a module employees but calling its settings page HrmSettings.jsx, or naming a module quality but calling it QualitySettings.jsx). This breaks global text searching and mental mapping across the stack.

**The Rule:** The exact technical name of the backend module MUST dictate the exact prefix of all its frontend components, routes, and files. You are strictly forbidden from inventing arbitrary acronyms or shorthand aliases in the frontend.

**Correct:**
- Module: employees -> Frontend Folder: pps/hr/ -> Component: HrSettings.jsx
- Module: quality -> Frontend Folder: pps/quality_control/ -> Component: QualityControlSettings.jsx

**Forbidden:**
- Module: employees -> Component: HrmSettings.jsx ❌ (Arbitrary acronym)
- Module: quality -> Component: QualitySettings.jsx ❌ (Arbitrary shorthand)

**Why:** MVS Symmetry (Rule 18) applies to the backend (Model-View-Serializer). Lexical Symmetry (Rule 21) extends this vertically to the frontend. A developer must be able to globally search for the module's exact technical prefix (hr) and instantly find all associated React components without guessing acronyms.

## 22. Strict Prohibition of Temporal and Versioning Suffixes
**The Problem:** Developers sometimes create files like CrmSettings_new.jsx, InventorySettings_v2.jsx, or Dashboard_backup.jsx during a refactor. This causes severe routing confusion, breaks global search predictability, and leaves dead code in the repository.

**The Rule:** You are STRICTLY FORBIDDEN from using temporal or versioning suffixes in filenames (e.g., _new, _old, _v2, _backup, _temp). 
* If you are refactoring a file, you must overwrite the existing file in place or use Git branching.
* Code must always reflect the absolute present state. The codebase is not a graveyard for " old versions.


## 22. Strict Prohibition of Temporal and Versioning Suffixes
**The Problem:** Developers sometimes create files like `CrmSettings_new.jsx`, `InventorySettings_v2.jsx`, or `Dashboard_backup.jsx` during a refactor. This causes severe routing confusion, breaks global search predictability, and leaves dead code in the repository.

**The Rule:** You are STRICTLY FORBIDDEN from using temporal or versioning suffixes in filenames (e.g., `_new`, `_old`, `_v2`, `_backup`, `_temp`).
* If you are refactoring a file, you must overwrite the existing file in place or use Git branching.
* Code must always reflect the absolute present state. The codebase is not a graveyard for "old" versions.

**Why:** Combined with Lexical Symmetry (Rule 21), a developer must guarantee that `StockSettings.jsx` is the one and only source of truth for the `inventory` module's settings, without having to wonder if `StockSettings_new.jsx` is secretly the active route.


## 23. Headless Configuration (The Anti-Transient Law)
**The Problem:** Developers or AI agents accustomed to standard monolithic Odoo often attempt to create `ResConfigSettings` (Transient Models) to handle module configurations. In a server-rendered monolith, this makes sense (the ORM needs a fake database table to render the XML settings UI). In a Headless React architecture, creating and destroying fake database records just to generate a JSON response is a massive, highly inefficient anti-pattern.

**The Rule:** You are STRICTLY FORBIDDEN from using Transient Models or `ResConfigSettings` patterns to handle configuration. All system and module settings MUST use the unified `SystemSetting` Key-Value database table, governed strictly by the `SettingsRegistry` singleton in the Kernel.
* When a business app (e.g., `accounting`, `crm`) introduces a new configuration setting, it MUST explicitly register the key, type, and default value in the Kernel's `settings_registry` inside its `apps.py` `ready()` method.
* The backend will reject any attempt to save an unregistered setting key.

**Why:** React handles the UI; the backend does not need transient tables to build forms. The `SettingsRegistry` guarantees strong schema typing, default-value hydration, and strict modular boundaries (giving us Odoo-level safety with modern REST performance).


## 24. Explicit Push-Registries (Anti-Magic File Crawling)
**The Problem:** Developers often attempt to achieve modularity by making the Kernel "crawl" the filesystem (using `importlib` and `try/except ImportError`) to find dynamically named files (like `services/kpi.py` or `integrations/export.py`) in downstream apps. This creates hidden, implicit contracts, causes unnecessary filesystem I/O at runtime, and makes debugging extremely difficult.

**The Rule:** The Kernel (`core`, `system`, etc.) is STRICTLY FORBIDDEN from executing filesystem crawling or using "Duck Typing" imports to discover module capabilities. You must use an **Explicit Push-Registry**.
* **The Kernel:** Defines a Singleton registry in its root directory (e.g., `apps/core/registry.py`). It does zero discovery work.
* **Downstream Apps:** Explicitly "push" their capabilities into the Kernel's registry during the Django boot phase, exclusively inside their `apps.py` `ready()` method (e.g., `kpi_registry.register('accounting', get_kpis)`).

**Why:** This mathematically enforces the Dependency Inversion Principle. It shifts the responsibility from the Core (which shouldn't know about downstream apps) to the downstream apps (which know exactly what they provide). It also guarantees lightning-fast, O(1) memory lookups for global APIs like the Command Center instead of slow filesystem polling.

## 25. Distributed Registry Ownership (The Extension Point Law)
**The Problem:** Developers mistakenly believe that all Registries must be centralized inside the Kernel (`core` or `system`), turning the Kernel into a bloated God Object that manages registries for features it doesn't even understand (like payment gateways or automation triggers).

**The Rule:** Registries are NOT restricted to the Kernel. Any module that acts as a platform, orchestrator, or "extension point" for other modules MUST own its own registry.
* **The Ownership Law:** The module that *orchestrates* the feature owns the registry. The downstream modules that *consume* or *extend* it push to it.
* **Examples of Distributed Ownership:**
  * `core` (Kernel) owns `KPIRegistry` and `RouteRegistry`.
  * `automation` (Shared Utility) owns `TriggerRegistry` (where `sales` registers "Quote Won" events).
  * `reports` (Shared Utility) owns `ReportEngineRegistry`.
  * `payments` (External Integration) owns `ProviderRegistry` (where Stripe and PayPal register their keys).

**Why:** This guarantees infinite horizontal scaling and Separation of Concerns. If the `automation` module is uninstalled, its registry disappears with it, and downstream apps gracefully skip pushing to it. The Kernel remains completely unaware and mathematically pure.

## 26. The Full-Stack Vertical Naming Law (No Noun Switching)
**The Problem:** A feature is named `CommandCenter` in React, but the developer randomly switches the noun to `AnalyticsViewSet` in the Django backend, and serves it over the `/api/analytics/` route. This destroys global greppability and forces developers to memorize arbitrary aliases across the stack.

**The Rule:** Once a domain noun (e.g., "Command Center", "Bank Reconciliation") is chosen, it MUST be preserved strictly vertically across every single layer of the stack. You are strictly forbidden from "Noun Switching" mid-stack.
* **Correct Vertical Symmetry Example:**
  * **React Component:** `CommandCenter.jsx`
  * **Frontend API Client:** `commandCenterService.js`
  * **API URL Route:** `/api/v1/core/command-center/global/`
  * **Backend View:** `CommandCenterViewSet`
  * **Backend Service:** `CommandCenterService`
* **Forbidden:** Calling the frontend `CommandCenter` but naming the API route `/analytics/` or the backend view `AnalyticsViewSet`. 

**Why:** MVS Symmetry (Rule 18) covers the Backend, and Lexical Symmetry (Rule 21) covers the Frontend Module Prefix. Rule 26 enforces the bridge between them. A developer must be able to highlight a noun in the React UI, hit `Ctrl+Shift+F` (Global Search), and instantly see the perfectly aligned API route, View, and Service without guessing.

## 27. API Payload Splitting & Polling Isolation (The Anti-DDoS Law)
**The Problem:** Developers often group all dashboard data into a single massive API endpoint (e.g., combining Live CPU Health with Financial MRR). When the frontend tries to aggressively poll the endpoint every 5 seconds to animate the CPU progress bar, it accidentally forces the database to recalculate the entire company's financials every 5 seconds, bringing the ERP to its knees.

**The Rule:** APIs MUST be strictly separated by their **Computational Weight** and **Frontend Polling Frequency**. You are strictly forbidden from grouping lightweight telemetry data with heavy business aggregations.
* **Lightweight / High-Frequency APIs:** (e.g., `/command-center/system_health/`) These must execute in milliseconds, do minimal to zero database queries, and be completely safe for the React frontend to poll aggressively (every 3-5 seconds).
* **Heavyweight / Low-Frequency APIs:** (e.g., `/command-center/global/`) These aggregate complex cross-module data (e.g., `SUM(amount)`) and must be isolated to separate endpoints. The frontend must fetch these only on initial load or poll them infrequently (e.g., every 5 minutes).

**Why:** This Tier-1 standard mathematically prevents "Self-Inflicted DDoS" attacks. It ensures that the React SPA can maintain buttery-smooth, real-time UI animations without ever accidentally weaponizing heavy backend business logic against your own database.

## 28. Frontend Service Layer Domain Isolation
**The Problem:** A developer building a UI in the Settings module needs a dropdown list of users. Because they are working in SettingsDashboard.jsx, they conveniently add a getUsers() method directly inside settingsService.js. Later, the CRM module also needs a list of users and ends up importing settingsService.js, creating chaotic cross-domain spaghetti dependencies.

**The Rule:** Frontend API service files (*Service.js) are strictly bound to their BACKEND domain, NOT the UI module that happens to consume them. 
* If a UI component in the system (Settings) module needs to fetch records from the users backend module, it MUST import and call frontend/src/apps/users/api/usersService.js.
* You are strictly forbidden from writing API calls for Domain A inside the service file of Domain B just because Domain B is currently displaying the UI.

**Why:** This prevents the creation of God Object service files (Rule 10B) and enforces Domain-Driven Design (Rule 11) on the frontend. It guarantees that Shared Utility domains (like users or product) expose a single, predictable API contract to the entire frontend, regardless of which downstream apps need to consume their data.

## 29. Global UI Shells vs. Plugin Consumption (The Layout Mandate)
**The Problem:** A developer building the Settings or CRM app thinks they need a custom two-column layout, so they create a unique \SettingsLayout.jsx\ inside their plugin. This leads to 15 different layout wrapper files across the ERP, causing UI inconsistencies and ignoring the global application shell.

**The Rule:** Root execution shells (\AuthLayout\, \ModuleLayout\, \PortalLayout\, \WebsiteLayout\, \BackendLayout\) are strictly Kernel-level components and MUST live in \rontend/src/core/layouts/\. 
* Business Plugins (like \system\, \sales\, \crm\) are strictly forbidden from inventing their own structural layout wrappers.
* The global dynamic router (\BackendRoutes.jsx\) is responsible for wrapping Plugin routes in the standard \ModuleLayout\. 
* Plugins simply export their \menu.js\ and their inner page components. They consume the Kernel's layout; they do not dictate it.

**Why:** This completely standardizes the UI across all modules (just like Odoo's WebClient framework). It prevents duplicate code and ensures that if the core layout changes (e.g., moving the sidebar to the right), every single app updates instantly without needing to touch 50 different plugin folders.

## 30. Backend API Ownership
**The Problem:** A developer adds a link to Automated Actions and Reports inside the Settings menu. Because the UI is in the Settings app, they conveniently dump AutomatedActionsViewSet and ReportsViewSet into backend/apps/system/api/views.py. The system module balloons into a 5,000-line God Object that handles logic for 10 unrelated domains.

**The Rule:** A backend app's views.py and urls.py can ONLY expose endpoints for the specific domain models it mathematically owns. 
* You are strictly forbidden from placing a ViewSet inside a module just because the UI links to it from there. 
* If a model belongs to reports, its ViewSet MUST live in apps/reporting/api/views.py.
* The routing namespace (e.g., /api/v1/reporting/) must perfectly mirror the physical apps/reporting/ directory.

**Why:** This enforces Separation of Concerns (Rule 10B) and Domain-Driven Design (Rule 11). It ensures that if the reports module is uninstalled, its API endpoints are cleanly removed without leaving orphaned code inside the system module.

## 31. The Bulk Update Law for Grid UIs
**The Problem:** An admin is editing a grid of 50 Access Rights. The frontend fires an individual HTTP PATCH request the millisecond they click a single checkbox. Clicking 20 checkboxes fires 20 simultaneous API requests, causing database race conditions, locks, and taking down the server.

**The Rule:** Frontend UIs that display interactive grids, matrices, or sortable lists (e.g., Access Rights, Menu Sequences) MUST NOT fire individual HTTP PATCH/POST requests per row or per click.
* State must be managed locally in React until the user clicks a definitive Save button.
* The frontend must dispatch a single, unified JSON payload.
* The backend MUST process this via a dedicated bulk_update endpoint using atomic database transactions.

**Why:** This mathematically prevents Self-Inflicted DDoS attacks from within your own UI and guarantees data integrity during multi-row edits.


## 32. The Settings Architecture (Decentralized Configuration)
**The Problem:** Developers often create a massive "Settings" database table, a God Object `SettingsViewSet`, and tightly coupled UI components to manage application configuration, breaking modularity.
**The Rule:** The Settings infrastructure must strictly mimic Odoo's `base_setup` and `res.config.settings` paradigm through decentralization:
1. **Backend Separation:** The `system` backend module is strictly an Administration Control Plane. It owns IT-level infrastructure (`SystemParameters`, `InstalledModules`, `SecurityPolicies`). It must NEVER handle configurations for business apps. If the CRM module has settings, they must be handled by endpoints in `crm/api/views.py`.
2. **Frontend Dynamic Discovery:** The user-facing "Settings App" provides the illusion of a unified dashboard, but the code must remain completely decoupled. The `system` frontend uses Vite's `import.meta.glob()` to dynamically discover `*Settings.jsx` files residing inside the individual plugin folders (e.g., `apps/crm/pages/settings/CrmSettings.jsx`). 
3. **Layout Standardization:** Settings pages must not invent their own UI wrappers. They must map into the global Settings router, which is wrapped by the Kernel's standard `ModuleLayout`.
**Why:** True modularity requires that if you uninstall the CRM module, its settings page, APIs, and menu items vanish automatically without throwing a single 404 or missing import error in the core system.

## 33. Infrastructure vs. Administration (The Settings Illusion)
**The Problem:** Because an Admin configures Languages and Cron Jobs from the "Settings Menu" in the frontend, developers assume the database tables and backend APIs for these models belong in the `system` (Settings) module.
**The Rule:** You must never confuse Frontend UI Administration with Backend Infrastructure.
1. **Infrastructure belongs in the Kernel (`core`):** Low-level engines that keep the ERP running (e.g., `ScheduledActions`, `Languages`, `Translations`) MUST be isolated in the `core` kernel. 
2. **Administration belongs in Plugins (`system`):** IT-level controls and registries (e.g., `SystemParameters`, `AuditLogs`, `InstalledModules`) belong in the `system` administration plugin.
**Why:** If the `system` module is uninstalled or crashes, the backend background workers must continue to safely execute scheduled tasks, and the ORM must continue to process translations. True infrastructure is decoupled from the UI that configures it.

## 34. Enterprise Cloud Platform Mandate
**The Problem:** Treating the codebase as a single, static "web application" rather than an ecosystem, leading to tight coupling and poor scalability.
**The Rule:** The architecture must mathematically guarantee it can operate as a multi-tenant Cloud SaaS and an extensible Operating System for businesses.
1. **Platform Extensibility:** The Kernel provides open registries; Plugins provide the features. New apps must be completely plug-and-play without hardcoding.
2. **Cloud-Native SaaS:** Database scaling requires absolute Multi-Tenancy (Rule 17). The system is designed to host 10,000 independent companies on a single cluster with zero data bleed.
3. **API-First Hub:** The ERP acts as a central hub in the cloud. Webhooks, API keys, and decoupled REST layers are prioritized so external systems (Stripe, IoT devices, Amazon) can programmatically orchestrate business logic.

## 35. Settings Navigation Aggregation Law (The "Settings Illusion" Extended)

**The Problem:** A developer needs to build a settings UI page for managing Outgoing Mail Servers. Because the user accesses it from the Settings dashboard, the developer places the JSX page (`OutgoingMailServers.jsx`) and its service calls inside `frontend/src/apps/system/pages/`. This violates module ownership and forces `system` to know about and directly import from `notifications`.

**The Rule:** The `system` (Settings) frontend module is strictly a **Navigation Aggregator**. It owns only two things:
1. The Settings **Dashboard page** — a grid of category cards with navigation links.
2. Pages for **its own genuinely-owned models** (e.g., `CompanyBranding`, `Currencies`, `PortalSettings`, `ApiKeys`, `Webhooks`).

It must NEVER contain a JSX page or service call for a model owned by another module.

**The Correct Pattern:**
- The Settings Dashboard card for "Outgoing Mail Servers" contains a `<Link>` to `/admin/notifications/outgoing-servers`.
- The actual `OutgoingMailServers.jsx` page lives inside `frontend/src/apps/notifications/pages/`.
- That page imports from `notificationsService.js` — its own module's service file.
- The Settings dashboard never imports `notificationsService` or any other module's service.

**Module Ownership determines Page Location. Always.**

| Model | Owning Module | Page Location | Service File |
|---|---|---|---|
| `OutgoingMailServer` | `notifications` | `notifications/pages/` | `notificationsService.js` |
| `IncomingMailServer` | `notifications` | `notifications/pages/` | `notificationsService.js` |
| `EmailTemplate` | `notifications` | `notifications/pages/` | `notificationsService.js` |
| `AutomatedAction` | `automation` | `automation/pages/` | `automationService.js` |
| `PortalSettings` | `portal` | `portal/pages/` | `portalService.js` |
| `Language` | `core` (Kernel) | accessed via `system/pages/` (config UI only) | `coreService.js` |
| `ScheduledAction` | `core` (Kernel) | accessed via `system/pages/` (config UI only) | `coreService.js` |
| `CompanyBranding` | `system` | `system/pages/features/` | `settingsService.js` |
| `Currency` | `system` | `system/pages/features/` | `settingsService.js` |

**Frontend Service Purity Rule:** A module's service file (`xxxService.js`) must ONLY call API endpoints belonging to its own backend module. `settingsService.js` must never call `/api/v1/notifications/...`. `notificationsService.js` must never call `/api/v1/system/...`.

**Why:** This is a direct extension of Rules 21 (Lexical Symmetry) and 10A (Domain Leakage). If the `notifications` module is uninstalled, its pages, routes, and service file vanish cleanly. The Settings dashboard simply shows an empty or hidden card — it never crashes, because it owns no code from `notifications`.

## 36. Plugin Configuration Ownership (The "Portal Settings" Law)

**The Problem:** A developer adds a "Portal Access" section to the `system` (Settings) module, creating a `PortalSettings` model and `PortalSettings.jsx` page inside `system`. This seems reasonable because the admin configures it from the Settings dashboard. However, the `portal` module already exists as a dedicated plugin that owns all portal-related behavior. Placing `PortalSettings` in `system` creates a hard dependency from the Administration Kernel Plugin to a Business Plugin, which is an Architectural Inversion (Rule 10C).

**The Rule:** Any configuration model that governs the behavior of a specific Business Plugin or Shared Utility must be owned entirely by that plugin. This includes the database model, the backend ViewSet, the serializer, the frontend page, and the service file.

**Concrete Examples:**
- Portal configuration → `portal/domain/models.py`, `portal/api/views.py`, `portal/pages/PortalSettings.jsx`, `portalService.js`
- Notifications configuration → `notifications/pages/settings/NotificationSettings.jsx` (NEVER in `system/pages/settings/`)
- eCommerce configuration → `ecommerce/domain/models.py`, `ecommerce/pages/EcommerceSettings.jsx`, `ecommerceService.js`
- Helpdesk SLA configuration → `helpdesk/domain/models.py`, `helpdesk/pages/HelpdeskSettings.jsx`, `helpdeskService.js`

**The Settings dashboard role:** Display a navigation card with a `<Link>` pointing to the plugin's own settings page. The `system` module must have zero imports from, zero models for, and zero pages about a downstream plugin's configuration.

**Why:** If the `portal` module is uninstalled, all portal configuration — model, API, and UI — disappears cleanly with it. If `PortalSettings` lived in `system`, uninstalling `portal` would leave orphaned database tables and broken pages inside the Administration core, violating Rule 1 (Independent Lifecycles).

**AI Instruction:** If you are instructed to audit or create a Settings page (e.g. `NotificationSettings.jsx`, `PaymentSettings.jsx`), you MUST check which plugin actually owns that domain. You are strictly forbidden from placing these pages inside the `system` module's frontend folder. Flag any such placement as a Domain Leakage violation.

## 37. The Kernel Extension Pattern (The "Company Branding" Law)

**The Problem:** The admin needs to configure a company logo, brand colors, and document layout. A developer's first instinct is to add `document_layout` or `report_footer` fields directly to the `Company` model in the `core` Kernel module. But the Kernel must contain minimal business logic and mostly infrastructure. 

**The Rule:** When a downstream Administration Plugin (like `system`) needs to enrich a Kernel model (like `Company`) with heavy configuration fields, it must use the **OneToOneField Extension Pattern** (Rule 13). It is strictly forbidden to open the Kernel source code to add app-specific configuration layouts.

**The Correct Pattern for Extensions:**
```python
# In system/domain/models.py — NOT in core/domain/models.py
class DocumentConfiguration(TenantAwareModel):
    # Extends Company without touching the Kernel
    company_profile = models.OneToOneField(
        'core.Company',
        on_delete=models.CASCADE,
        related_name='document_config'
    )
    paper_format = models.CharField(max_length=50, default='A4')
    font = models.CharField(max_length=50, default='Inter')
    header_text = models.TextField(blank=True)
    footer_text = models.TextField(blank=True)
```

**Why:** If the `system` administration plugin is entirely uninstalled (or swapped for an entirely custom headless frontend), the core `Company` model remains pure and functional without carrying unused fields for document fonts or header text. The Kernel handles the data boundaries; the `system` plugin handles the configuration extension.

**The EXCEPTION: Core Identity Data**
There is exactly one exception to the Extension Rule: **Universal Company Identity Data**. 
Fields that represent the fundamental, cross-functional identity of the company (e.g., `logo`, `primary_color`, `currency`, `country`) MUST live directly on the `Company` kernel model (in `core/domain/models.py`). 
*   **Why:** Every module (Reporting, Portal, Invoicing) needs the logo and currency. If these were locked inside a `system` extension, every module would be forced to create an illegal dependency on the `system` module just to render a logo.
*   **The Boundary Test:** Does every single module across the entire ERP universally need to read this field just to display the company's basic identity? If yes → Kernel. If no (it's specific config like `document_layout`) → Extension.

## 38. Strict Separation of Tenant and Company (Multi-Company Architecture)

**The Problem:** Developers often merge the concept of a `Tenant` (SaaS subscription/data isolation) with a `Company` (legal business entity) by either renaming one to the other, or putting business fields on the Tenant. This breaks when the ERP needs to support Multi-Company (one subscriber owning multiple subsidiaries). It also violates Lexical Symmetry (Rule 21) if module names and models don't align.

**The Rule:** The architecture must strictly separate Infrastructure Isolation from Business Entities, exactly like Tier-1 ERPs (Odoo, SAP).
1. **The Tenant (Infrastructure):** Lives in the `tenants` module. Purely handles database row-level security (`TenantAwareModel`). It has ZERO business fields (no logos, no currencies). It represents the SaaS database shard/subscription.
2. **The Company (Business):** Lives in the `core` module. Represents the legal entity. Holds `logo`, `currency`, and tax IDs. It inherits from `TenantAwareModel` (meaning one `Tenant` can own multiple `Companies`).

**Why:** This perfectly aligns with the Odoo standard (Database = Tenant, `res.company` = Company). It mathematically prevents Domain Leakage, satisfies Lexical Symmetry perfectly, and future-proofs the platform for true Multi-Company SaaS operations.

## 39. Dynamic Settings Aggregation (The "App Settings" Law)

**The Problem:** The global Settings Dashboard needs to display configuration links for business modules like CRM, Sales, and Inventory. A naive approach hardcodes these links and imports directly into the `system` (Settings) app. This turns the Settings app into a monolithic "God Object" (violating Rule 10B) and causes the system to crash if a referenced business module is uninstalled.

**The Rule:** The `system` module must act purely as an empty, dynamic bulletin board for business apps. It must use the **Global Registry Pattern** (Rule 5) to dynamically discover and render settings. You are strictly forbidden from hardcoding business module links into the Settings Dashboard.

**The Implementation Standard (How to add settings to an app):**
1. **The Backend Manifest:** The business module must declare `'has_settings': True` and `'settings_url': '/admin/settings/{module_name}'` in its `__manifest__.py`. This allows the Database to instruct the frontend dashboard to draw a settings card.
2. **The Frontend File:** The business module must own its settings page UI. It must be placed at `frontend/src/apps/{module_name}/pages/settings/{ModuleName}Settings.jsx`.
3. **The Dynamic Discovery:** The global routing engine (`settingsAdminRoutes.jsx`) uses Vite's `import.meta.glob()` to silently scan for these `*Settings*.jsx` files and automatically mounts them.

**Why:** This is the modern React/Django equivalent of Odoo's `res.config.settings` architecture. It ensures 100% decoupling. Uninstalling a business module completely removes its database configuration, its API, its settings UI, and its dashboard card simultaneously, without modifying a single line of the core Settings codebase.

## 40. Kernel Purity & Database Foundation
**The Problem:** Grouping Administrative tools (like Webhook configuration, API Keys, and Settings UI) into the Kernel blurs the line between foundational infrastructure and user-facing administration. This leads to circular dependencies when the Kernel tries to check its own foundation.
**The Rule:** The Kernel (\core\, \uth\, \	enants\) must be entirely devoid of Administrative UI wrappers and high-level configurations. Foundational system registries—such as the \InstalledModule\ database table, which acts as the package manager for the entire ERP—must reside exclusively in the absolute lowest layer (\core\). The \system\ module is strictly a Layer 3 Administration UI layer, NOT a foundational kernel.

## 41. Scheduled Actions vs. Automated Actions (Trigger vs. Time)
**The Problem:** Treating all background tasks as " automations leads

## 40. Kernel Purity & Database Foundation
**The Problem:** Grouping Administrative tools (like Webhook configuration, API Keys, and Settings UI) into the Kernel blurs the line between foundational infrastructure and user-facing administration. This leads to circular dependencies when the Kernel tries to check its own foundation.
**The Rule:** The Kernel (`core`, `auth`, `tenants`) must be entirely devoid of Administrative UI wrappers and high-level configurations. Foundational system registries—such as the `InstalledModule` database table, which acts as the package manager for the entire ERP—must reside exclusively in the absolute lowest layer (`core`). The `system` module is strictly a Layer 3 Administration UI layer, NOT a foundational kernel.

## 41. Scheduled Actions vs. Automated Actions (Trigger vs. Time)
**The Problem:** Treating all background tasks as "automations" leads to severe architectural mixing. An event triggered by a user clicking "Save" requires a completely different execution context than a cron job firing at midnight.
**The Rule:** In a Tier-1 ERP, background tasks are structurally bifurcated:
1. **Automated Actions (`automation` module):** Strictly record-triggered events (e.g., "On Lead Creation -> Send Email").
2. **Scheduled Actions / Cron (`core` module):** Strictly time-based interval jobs (e.g., "Every 12 Hours -> Enrich Leads"). The scheduling engine is a kernel feature. Scheduled action blueprints must never be grouped under the `automation` utility registry.

## 42. The "Missing Link" Registry Sync (Blueprint to Database)
**The Problem:** Business apps declare predefined cron jobs (blueprints) in their `apps.py`. If the backend worker tries to execute these directly from memory, administrators have no way to see, pause, or edit the intervals of these jobs in the database.
**The Rule:** In-memory blueprints MUST physically synchronize (via `update_or_create`) into a dedicated Database Table (`core_scheduledaction`) at boot/install. This ensures background tasks are visible in the technical UI, natively executable by the cron worker, and editable by administrators without requiring code changes.

## 43. Safe Meta-Registries (Topological Compliance)
**The Problem:** The `ScheduledActions` UI (which belongs to `core`) needs a dropdown of available database models. If it fetches this from an endpoint inside the `automation` module, the absolute Kernel (Layer 1) has illegally created an upward dependency on a Shared Utility (Layer 2).
**The Rule:** When any layer needs to know global system state (e.g., "Which models belong to installed apps?"), that data must be served by a Kernel-level Meta-Registry (e.g., `/api/v1/core/models/`). Lower-level kernel features must never fetch dependency state from higher-level shared utilities, strictly adhering to Rule 19 (Topological Directionality).

## 44. The Global Meta-Registry (Table of Tables)
**The Problem:** Hardcoding lists of available database models, or creating duplicate endpoints across different modules (like `users` and `automation`) to list models, violates DRY principles and topological directionality. Furthermore, blindly exposing Django's native `ContentType` table leaks internal system tables (like migrations) and models of uninstalled apps to the end-user.
**The Rule:** The system must maintain a single, unified Kernel-level Meta-Registry (the exact equivalent of Odoo's `ir.model`). This is achieved by serving Django's native `ContentType` model via a single endpoint located strictly in the `core` module (Layer 1). 
**Enforcement:** This Kernel endpoint MUST mathematically cross-reference the `InstalledModule` table. It must physically filter out any `ContentType` that belongs to an uninstalled app or an internal backend system. All downstream modules (e.g., Automation, Reporting, Scheduled Actions) must query this single unified endpoint to populate their UI dropdowns.

## 45. Apps vs. Models (The Dual Kernel Registries)
**The Problem:** A developer or AI agent auditing the `core` API might notice `/api/v1/core/modules/` and `/api/v1/core/content-types/` and mistakenly assume they are duplicates, attempting to merge them into a single endpoint. This demonstrates a fundamental misunderstanding of ERP architecture and breaks RESTful MVS Symmetry.
**The Rule:** The architecture mathematically distinguishes between an **Application Package** and a **Database Table**. They must remain strictly separated into two distinct Kernel registries serving two distinct UIs:

1. **The App Store Registry (`/api/v1/core/modules/`)**
   * *What it is:* Powered by the `InstalledModule` database model (Odoo's `ir.module.module` equivalent).
   * *Purpose:* Tracks the installation state of entire Application Packages (e.g., "CRM", "Sales", "Accounting").
   * *Target UI:* Powers Layer 3 Administration screens (The App Store UI, the Settings Dashboard UI).

2. **The Meta-Registry / Card Catalog (`/api/v1/core/content-types/`)**
   * *What it is:* Powered by Django's native `ContentType` table (Odoo's `ir.model` equivalent).
   * *Purpose:* Tracks the actual Database Tables/Models inside those apps (e.g., `Lead`, `Invoice`, `Employee`).
   * *Target UI:* Powers Technical Automation screens (Scheduled Actions and Automated Actions UI dropdowns).

**Enforcement:** Never merge these endpoints. They operate in a master-slave relationship: The Meta-Registry (`content-types`) must continuously crawl the App Store Registry (`modules`), filtering out any database tables that belong to an uninstalled application to ensure absolute modular safety.

## 46. Frontend Registry Hydration (Global vs. On-Demand State)
**The Problem:** Fetching massive lists of database models into the global React Context causes severe UI lag, high memory consumption, and bandwidth bloat. Conversely, failing to put high-level Application states into global context forces the UI to rely on jarring hard reloads to update the navigation sidebar.
**The Rule:** The React SPA must strictly partition how it consumes the Dual Kernel Registries (defined in Rule 45) based on their data weight and purpose:

1. **The Global Blueprint (`useManifest` -> `/core/modules/`)**
   * *The Hydration:* The list of installed apps is lightweight (~20-50 records). It MUST be fetched globally at application boot by the `ManifestContext`.
   * *The Usage:* It resides in global memory to instantly and dynamically render the Sidebar navigation, App Store buttons, and Settings configuration cards without ever reloading the browser.

2. **The Technician's Toolkit (Local Fetch -> `/core/content-types/`)**
   * *The Hydration:* The list of database models is massive (300-500+ records). It MUST NEVER be placed into global state or the `useManifest` hook. 
   * *The Usage:* It is fetched strictly on-demand, living entirely in local component state (`useState`), exclusively inside specific technical administration pages (e.g., `ScheduledActions.jsx`) to populate `<select>` dropdown menus.

**Why:** This Tier-1 pattern guarantees buttery-smooth SPA performance. It keeps the global React state incredibly lean while gracefully loading heavy, technical meta-data only when an administrator explicitly requests a technical screen.

## 47. The Service Layer Directory Standard (No Application Folders)

**The Problem:** Developers and AI agents sometimes create an `application/` directory to hold services (e.g., `application/services.py`), misinterpreting strict Domain-Driven Design. This causes unnecessary deep nesting and fragmentation within a modular monolith where the Django app itself acts as the bounded context.

**The Rule:** You are STRICTLY FORBIDDEN from creating or using an `application/` directory. All business logic must go directly into a `services.py` file or a `services/` directory at the root of the module.

*   **Small Modules:** If the business logic is less than ~300-500 lines, use a single `services.py` file at the root of the module (e.g., `apps/inventory/services.py`).
*   **Large Modules:** If the business logic is extensive, use a `services/` directory at the root of the module with an `__init__.py` and multiple split service files (e.g., `apps/system/services/settings_service.py`).

**AI Instruction:** If you are auditing a module or adding a feature and you notice an `application/` folder, you must flag it as an architectural violation. If you are instructed to fix it, you must refactor it by moving the files to the root `services.py` or `services/` directory (following the size guidelines above), updating imports globally, and deleting the `application/` folder.

## 48. The Frontend Layering Mandate (Dashboards vs. UI vs. Services)

**The Problem:** Developers often create standalone dashboards for Master Data (like `users`), or put UI components inside the `core` Kernel, or confuse API service files with UI ownership. This leads to broken navigation, orphaned screens, and violates the Odoo-style application structure.

**The Rule:** Frontend capabilities are strictly dictated by the backend architectural layer (Rule 9). You must differentiate between Frontend Services (API fetching), UI Components (Forms/Lists), and Dashboards (Main Menu Icons/Apps).

1. **Layer 1: The Kernel (`core`, `auth`, `tenants`)**
   * **Frontend Services:** YES (`coreService.js`). Needed to fetch data.
   * **UI Components:** NO. The Kernel is mathematically "headless". It has no `.jsx` forms or lists.
   * **Dashboards:** NO. Never appears on the main menu.
   * *Note:* UI to view Kernel data (like Audit Logs or Languages) is built and owned by the Layer 3 `system` (Settings) app.

2. **Layer 2: Shared Utilities / Master Data (`users`, `product`, `notifications`)**
   * **Frontend Services:** YES (`usersService.js`).
   * **UI Components:** YES. Owns `.jsx` forms and lists (e.g., User Profile form). They act as a UI library imported by other apps.
   * **Dashboards:** NO. You cannot click a "Users" icon on the main menu. They have `application: False`.

3. **Layer 3: Business Plugins (`sales`, `inventory`, `system`, `crm`)**
   * **Frontend Services:** YES (`salesService.js`).
   * **UI Components:** YES.
   * **Dashboards:** YES. These are the heavyweights (`application: True`). They get App Store icons, top-level Command Center tiles, and full layout wrappers.

**AI Instruction:** When auditing or building frontend code, you MUST flag an architectural violation if you see a Layer 1 module containing UI components (`.jsx`), or a Layer 2 module trying to register a top-level Dashboard or main menu route. Layer 1 is invisible, Layer 2 is a parts bin, and Layer 3 is the drivable car.

## 24. Frontend Service Layer Encapsulation (Skinny Components)

**The Problem:** React components (.jsx) hardcoding raw HTTP client calls (piClient.get('core/modules/')) instead of delegating to a frontend service layer. This causes scattered API definitions, breaks DRY principles, and violates cross-module boundary encapsulation on the frontend.

**The Rule:** The "Fat Services, Skinny Views" paradigm extends strictly to the frontend.
1. **No Raw HTTP in Components:** React components (.jsx) MUST NEVER contain raw piClient.get(), post(), patch(), or delete() calls. All HTTP communication must be strictly encapsulated within dedicated Frontend Service files located in the app's pi/ directory (e.g., rontend/src/apps/core/api/coreService.js).
2. **Cross-Domain Imports:** If a component in App A needs data from App B, it must import App B's service file (import { usersService } from '../../users/api/usersService'). It is strictly forbidden to manually construct URLs to another module's backend endpoints directly inside a React component.
3. **Skinny Components:** Components must only handle React state (useState, useEffect) and pass parameters to these imported service methods.

**AI Instruction:** When an AI agent performs audits or edits a frontend component, it MUST actively flag and refactor any legacy direct piClient or client HTTP calls into proper service layer methods. If the required service method does not exist in the target module's service file, the AI must create it.

## 25. The Omni-Channel Communication Standard (Layer 2 vs Layer 3)

**The Problem:** Developers often confuse the foundational messaging engine with journeys applications, placing models like `OutgoingMailServer` inside the `system` settings, or naming journeys apps ambiguously (like `campaigns`).

**The Rule:** The architecture strictly splits communication into two distinct layers: The **Engine** (Layer 2) and the **Journeys Apps** (Layer 3).

### A. The Engine: `inbox` (Layer 2 - Shared Utility)
The `inbox` module is the Tier-1 master communication engine. It is NOT just for emails. It is an omni-channel unified engine that handles:
1.  **Email Servers:** `OutgoingMailServer`, `IncomingMailServer`, and `EmailTemplate` must natively live in the `inbox` module (not in `system`).
2.  **The Chatter:** The discussion thread at the bottom of business records (`ChatterMixin`, `RecordMessage`, `RecordActivity`, `RecordFollower`). The Chatter belongs natively to `inbox` (not `core`).
3.  **Push Notifications:** In-app alerts (the Bell icon).

*Behavioral Note:* The `inbox` module sends transactional, one-to-one messages. It has absolutely no concept of a "Journeys Campaign" or "Newsletter".

### B. Journeys Plugins (Layer 3 - Business Apps)
Journeys applications are dedicated plugins in the Journeys pillar. They do not send messages directly; they build campaigns and pass them down to the Layer 2 engine (like `inbox` or an SMS gateway) to dispatch. 

To maintain clean, separated namespaces without ambiguity, they must be named strictly by channel:
*   **`campaigns`**: Handles newsletters, mailing lists, and open/click tracking. (Do not use the generic `campaigns` or the archaic `campaigns`).
*   **`sms_marketing`**: Handles blasting SMS texts to a lead list.
*   **`whatsapp`**: Handles WhatsApp marketing.
*   **`journeys`** (or `journeys`): The orchestrator module that creates multi-channel drip campaigns (e.g., "Wait 3 days, send email, if opened, send SMS").

## 26. The App Store & Module Lifecycle Architecture
To maintain a Tier-1 modular ecosystem, the installation, discovery, and initialization of modules must adhere to strict, deterministic rules.

### A. The Discovery vs. Installation Mandate
*   **The Scanner (Discovery):** Scripts that scan the filesystem for __manifest__.py files (e.g., sync_modules) MUST ONLY populate the InstalledModule registry. They MUST default all business modules to is_installed = False. Scanning must NEVER trigger business logic or auto-install apps.
*   **The Installer (State Hook):** The transition from Uninstalled to Installed is a highly privileged operation. It is handled exclusively by a dedicated Installer Service (install_module()), triggered deliberately (e.g., by clicking "Install" in the App Store UI). This service checks dependencies, fires setup hooks, and creates audit logs.

### B. Service Encapsulation (Where does install_module belong?)
*   **The Rule:** The install_module() service MUST reside inside the **core** Kernel (e.g., pps/core/services/modules.py), not inside the system settings or the pps App Store.
*   **Why:** Installing a module modifies the master OS state (routes, database registries) and manipulates the InstalledModule model (which lives in core). Placing the logic in a downstream module (like the App Store UI) creates a dangerous architectural inversion. The UI should merely call down to the core service.

### C. The Singleton vs. Service Collision (Clarifying Rule 11 & 20)
*   **The Root Singleton (pps/core/registry.py):** Used exclusively for in-memory, dynamic hooking at boot time (e.g., API routing, KPI dashboard injection). It does NOT touch the database.
*   **The Service Layer (pps/core/services/modules.py):** Used for database-mutating business logic (like sync_modules or install_module). Never name a service file 
egistry.py if it collides conceptually with the root Singleton.

### D. Automated Tenant Initialization & Master Data Seeding
*   **No Lazy UI Creation:** Scanners and setup scripts must NEVER use lazy get_or_create blocks with hardcoded fallbacks (e.g., sequence: 99) to build critical UI elements like Command Center sections. 
*   **Deterministic Fixtures:** Master architectural data (like the 10 standard ERP pillars) must be defined in immutable data fixtures.
*   **Signal-Driven Bootstrapping:** Tenant initialization is completely automated. A post_save Signal intercepts the creation of a new Tenant, instantly seeds the Master Fixtures, and runs the Module Discovery scanner. Zero manual setup steps are allowed.

## 27. Separation of State: Boot-Time Memory vs. Runtime Actions
To prevent the creation of architectural "God Objects" and maintain true Separation of Concerns (Rule 10B), developers must strictly differentiate between code that maps memory during server startup and code that mutates the database at runtime.

### A. The Root Registry (The RAM Hook)
*   **What it is:** Singleton files like pps/core/registry.py.
*   **The Rule:** These files are strictly for **ephemeral, in-memory configurations** (like API routing or dashboard KPI registration). When Django boots up (
eady()), apps quickly map their capabilities here.
*   **Forbidden:** A root registry MUST NEVER execute database queries, validate business rules, or write to the database. It is a lightweight "memory map" only.

### B. The Service Layer (The Database Mutator)
*   **What it is:** Files like pps/core/services/modules.py (which houses install_module()).
*   **The Rule:** These files handle **persistent, transactional database actions**. They are triggered imperatively at runtime by human interaction or background workers. They execute complex logic, validate dependencies, and write Audit Trails.
*   **Forbidden:** Service layer business logic must never be embedded directly into a boot-time registry file. 

### C. The Definition of True Modularity
True modularity does not mean grouping all module-related logic (like routing and installing) into a single file. It means separating *what things are* based on their execution context. By keeping ephemeral "RAM maps" physically separated from persistent "Database Actions," the architecture remains infinitely scalable, testable, and protected from circular imports.

## 28. Master Data Placement (The Core Utilities)
Foundational entities that are universally required across all business domains MUST be placed in the core kernel module. 
*   **Examples:** Currency, Language, Translation, and base Company profiles.
*   **The Rule (Topological Dependency):** Because downstream apps (Sales, Accounting, HR) all require currencies and languages, placing them in a specific business app would create circular dependencies and tangled imports. By placing them at the absolute bottom in core, all apps can safely import them downwards. This mirrors the Tier-1 standard (e.g., Odoo's ase module).

## 29. Cloud Infrastructure vs. ERP Framework (The Tenants Module)
In a modern, Multi-Tenant Cloud ERP, tenancy and data isolation must remain a strictly dedicated module (e.g., pps/tenants/), and must NEVER be merged into the core framework.
*   **ERP Framework (core):** Handles business-level orchestration (Currencies, Languages, Installed Modules, Command Center).
*   **Cloud Infrastructure (	enants):** Handles server-level security and routing (Subdomain resolution, Row-Level Security, Tenant Isolation, SaaS bridges).
*   **The Rule:** Tenancy dictates the mathematical isolation of data between different companies in a shared database. Because this is the highest level of security boundary in a Micro-SaaS, it demands its own fortified, dedicated module. This guarantees future-proofing (e.g., if the platform ever migrates from Row-Level Security to Schema-Level Tenancy, the logic is safely encapsulated).

## 30. User Preferences vs. Global Settings (The Notification Rule)
In a Tier-1 ERP, it is critical to distinguish between **Global System Configurations** and **Individual User Preferences**.
*   **Global Settings (pps/system):** Configurations that affect the entire tenant (e.g., configuring the actual Twilio API Key or the Global SMTP Server credentials). These are strictly locked behind Admin privileges.
*   **User Preferences (pps/mail):** Configurations that dictate how an individual user interacts with the system (e.g., choosing whether to receive new Lead alerts via Email, Push, or SMS). 
*   **The Rule:** You must NEVER use global tenant settings to manage user-level notification toggles. Notification preferences are strictly individual and must be managed via the NotificationPreference model (or equivalent) wired to the authenticated user. Every employee controls their own noise level.

## 31. The Settings & Configuration Hierarchy (Global vs. User)
The platform must mathematically separate **Global Configurations** (managed by Admins, applied to the Tenant) from **Personal Overrides** (managed by Employees, applied to the User Profile). You are forbidden from blurring these boundaries.

*   **Languages (Dual-Layer):** 
    *   *Global:* The default Tenant language (used to render external PDFs, Invoices, and default states).
    *   *User:* The personal UI override. A French user working in a US company can view their own UI in French without affecting the company's default English setting.
*   **Currencies (Strictly Global):**
    *   Users do **not** have a personal currency preference. The ERP's General Ledger must balance in a single unified base currency. Currency settings belong exclusively in the Global Admin configuration.
*   **Translations (Strictly Global):**
    *   The translation dictionary is an OS-level component. Users cannot define personal dictionary overrides, as this would cause severe fragmentation during training and support.
*   **Notifications & IAM (Dual-Layer):**
    *   *Global:* Infrastructure setup (SMTP credentials, Twilio API Keys, MFA enforcement policies).
    *   *User:* Personal noise control (Opting into Email vs. Push vs. SMS for specific business events).
