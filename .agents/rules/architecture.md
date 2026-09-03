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

## 4. Multi-Tenancy (Micro-SaaS) & Security
*   **Tenant Isolation:** All database queries and API endpoints must strictly filter by `tenant` (unless operating within the absolute root `auth` gateway). Data bleed between companies is a Tier-0 critical security failure.
*   **Gateway Separation:** The `/login` and authentication flows are Root Gateways. Do not mix unauthenticated gateway routes into the protected `/admin/*` namespace.


## 5. Registry-Driven Plug-and-Play Architecture
*   **Dynamic Discovery (No Hardcoding):** Frontend UI elements (like Sidebars, Settings panels, and Command Center tiles) must NEVER be hardcoded into the global layout files. They must be automatically discovered via dynamic registries (e.g., using Vite's `import.meta.glob()` on `menu.js` files).
*   **Backend Global Registry Pattern:** The Backend API Routing (and other core integrations) must completely adhere to the Global Registry Pattern. The master router/core must have *zero* hardcoded knowledge of downstream apps or integrations (no `try/except` filesystem crawling or checking `if app.startswith()`). Instead, the core provides a singleton registry, and apps explicitly register their routes (e.g., in their `apps.py` `ready()` method) or use Django's native `AppConfig` registry to expose their endpoints.
*   **True Plug-and-Play:** A new module placed into the `apps/` directory must automatically hook into the global navigation simply by providing its own `config/menu.js`. The core system must seamlessly integrate it without requiring manual code changes in the core router.
*   **Loose Coupling:** Modules must register their capabilities (like dashboard widgets, reporting engines, or API URLs) into a central registry rather than directly mutating the core application.


## 6. ORM-Level Row Security (RLS)
*   **The Mixin Mandate:** Every single database model that belongs to a tenant MUST inherit from `TenantAwareModel`. The database enforces security at the lowest possible layer.
*   **Record Rules:** Similar to Odoo's `ir.rule`, domain-level security is enforced via `RecordRule` models, ensuring that even if a view is exposed, the ORM mathematically prevents users from querying rows they don't own.

## 7. Real-Time Event Broadcasting
*   **Unified WebSocket Gateway:** The frontend relies on a unified WebSocket connection (`NotificationContext`) to listen for server-side events, background task completions, and chat messages.
*   **Graceful Polling Fallback:** The AI must ensure that any real-time feature degrades gracefully to HTTP polling if the WebSocket connection drops, maintaining enterprise reliability.

## 8. Event-Driven Extensibility (Webhooks)
*   **Out-of-Band Integrations:** The platform uses `WebhookEndpoint` models to dispatch asynchronous events to third-party systems. Code should emit generic signals (e.g., `invoice_paid`) rather than hardcoding HTTP requests to external APIs.

**CRITICAL DIRECTIVE ON ARCHITECTURE MAPS:** 
The `.agents/rules/` are for strict behavioral laws. The exhaustive lists of all 75+ modules are kept in reference files in the root directory to save AI context window. 
Before proposing cross-module changes, creating new apps, or deciding if a module needs an API, you MUST use your file reading tools to read:
1. `SYSTEM_ARCHITECTURE_MAP.md` (for the dependency graph and module list)
2. `TIER1_ERP_ARCHITECTURE_MAP.md` (to know exactly which layer the module belongs to and its API/Dashboard status).

## 9. The Odoo Master/App Architecture (Kernel vs Plugins)
The codebase strictly follows the Tier-1 Odoo "Kernel vs Plugin" pattern to ensure infinite horizontal scaling without spaghetti code. You must respect these three distinct boundaries:

### A. The Kernel (The Master OS)
The foundation of the ERP. It handles ORM, authentication, multi-tenancy, and the Command Center dispatcher. It has ZERO business logic (it does not know what an invoice or lead is).
*   **Modules:** `core`, `system`, `auth`, `tenants`, `automation`
*   **Command Center Rule:** The `core` module acts as the master launcher. It broadcasts a signal asking installed apps for their KPIs (via `kpi.py`).

### B. Master Data (Hidden UI)
Foundational utilities that multiple apps share. They have a frontend UI for data entry, but they DO NOT get a dashboard or Command Center tile (`application: False` in `__manifest__.py`).
*   **Modules:** `product`, `users`, `reporting`, `notifications`, `delivery`, `portal`, `approvals`

### C. Business Plugins (The Apps)
The heavyweights. They are 100% strictly encapsulated. They do not hack into the Kernel. Instead, they use Dynamic Registries (like providing `kpi.py`) to hook into the global Command Center. They have their own dedicated dashboards (`application: True`).
*   **Finance:** `accounting`, `invoicing`, `hr_expense`, `documents`, `spreadsheet`, `board` (Custom Dashboards), `consolidation`, `sign`
*   **Supply Chain:** `stock`, `purchase`, `mrp`, `mrp_plm`, `maintenance`, `quality_control`, `repair`, `barcode`, `iot`
*   **Sales & Services:** `crm`, `sale`, `subscriptions`, `rental`, `pos`, `projects`, `timesheets`, `helpdesk`, `field_service`, `appointments`, `planning`
*   **HR:** `hr`, `hr_payroll`, `hr_attendance`, `hr_holidays`, `hr_recruitment`, `fleet`, `lunch`, `hr_appraisal`
*   **Marketing/Web:** `website`, `ecommerce`, `marketing`, `mass_mailing`, `social`, `events`, `blog`, `forum`, `elearning`, `surveys`
*   **Comms:** `discuss`, `voip`, `sms`, `livechat`

### D. External Integrations
Bridges to third-party APIs. They sit outside the core ERP logic.
*   **Modules:** `payments`, `whatsapp`, `ai_engine`, `soc`


## 10. Strictly Forbidden Anti-Patterns
To protect the integrity of the ecosystem, you must actively scan for and refuse to implement the following anti-patterns:

### A. Domain Leakage (Context Leakage)
*   **Definition:** When a module imports or manipulates the database models or internal business logic of an unrelated module.
*   **The Rule:** A downstream app (like `board` or `marketing`) MUST NEVER directly query the models of another app (like `accounting.Invoice`). It must call an API or a registered service method instead.

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

*   **1. The Kernel Layer (core, system, uth):** 
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
