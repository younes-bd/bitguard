> **THE PRIME DIRECTIVE: MACH ARCHITECTURE**
> This ERP is strictly governed by the **MACH** enterprise standard. 
> *   **[M]icroservices (Modular):** Django apps must be strictly isolated (No soft dependencies).
> *   **[A]PI-First:** All business logic must be exposed via DRF. No server-side HTML rendering is permitted.
> *   **[C]loud-Native SaaS:** The system operates on a Shared-Schema, Logical Multi-Tenant database (The Skyscraper Doctrine).
> *   **[H]eadless:** The React Control Plane is physically and logically decoupled from the Django Kernel. 
> 
> *Every architectural decision must uphold these 4 pillars. If a proposed design couples the UI to the database, or breaks tenant isolation, it is invalid.*

> **Important:** For a complete, definitive mapping of all modules and their architectural layers (1, 2, 3, or 4), always refer to `SYSTEM_ARCHITECTURE_MAP.md` at the root of the project.

## THE ODOO 17 MANDATE (CRITICAL AI INSTRUCTION)
All architectural classifications, UI layouts, and system behaviors must strictly mirror the modern **Odoo 17** standard. 
* Do NOT reference, assume, or suggest behaviors from legacy ERPs or older versions of Odoo (e.g., Odoo 14/15/16).
* Older versions used cluttered admin dashboards with System/Settings/App tiles. Odoo 17 strictly forbids this. 
* In Odoo 17, Layer 2 Platform Services (Settings, App Store) must NEVER appear as tiles on the Command Center grid. They belong exclusively in the top navigation bar.

## Rule 0 — The Four-Layer Headless ERP Architecture Model (THE PRIME CLASSIFICATION LAW)

BitGuard adopts the **4-Layer Headless ERP Model**, derived from and compatible strictly with the **Odoo 17** module classification standard (`application` flag + `installable` flag). This is the ONLY classification framework you must use. Do NOT reference Salesforce's 5-layer model, SAP's Basis model, or older versions of Odoo (e.g., Odoo 15/16).

Every module in this codebase MUST be classified into exactly one of these four layers. The layer determines: how the module is routed in Settings, whether it gets a Command Center tile, how it injects its menu, and whether it can be installed/uninstalled by a tenant.

**Where the classification lives:** the layer of every module is recorded ONLY in `.agents/rules/layer_registry.json` (see Rule 65). This rule defines what each layer *means*; the registry defines *which module is in which layer*. Never hardcode a module list in this file or in any other document.

---

### Layer 1 — Kernel (Non-Optional Foundation)

**Definition:** The absolute lowest-level infrastructure. Non-removable. Zero standalone UI of its own. Every other module depends on it, directly or transitively. Equivalent to Odoo's `base` module.

**Decision Rules (ALL must be true):**
- Cannot be uninstalled under any circumstance
- Every other module depends on it (directly or transitively)
- Has NO standalone navigation menu
- Has NO Command Center tile (`application: False`)
- Contains foundational models (ORM base classes, tenant isolation, auth primitives)

**Layer 1 Modules:** see `.agents/rules/layer_registry.json` (filter `layer: 1`). Like Odoo's `base` (`depends: []`), `core` is the root of the manifest dependency graph: no Layer 1 module may declare a Layer 2, 3 or 4 module in `depends`.

**Settings Sidebar:** Layer 1 modules do NOT inject into the sidebar. Their configuration is hardcoded directly into `system/config/menu.js` baseSettings.

**CRITICAL MACH ENFORCEMENT:** The `core` module is the invisible data engine of the ERP. It is strictly **Headless**. 
* **Backend:** Contains Database schemas, multi-tenant isolation, and ORM primitives.
* **Frontend:** Contains ONLY Hooks (`useFormatters`), Contexts (`ConfigContext`), API Clients, and routing logic. 
* **THE BAN:** The `frontend/src/core/` directory is **strictly forbidden** from possessing visual React components, Pages, Layouts, or UI libraries. Dumping UI components into `core` violates the MACH standard and permanently entangles the presentation layer with the data layer.

---

### Layer 2 — Platform Services (Shared Infrastructure with Admin UI)

**Definition:** Cross-cutting platform services that every business app uses but that are NOT business apps themselves. They have admin-only configuration UI accessible through Settings only. They have no standalone Command Center tile. Equivalent to Odoo *platform* modules (`base_setup`, `portal`, `product`, `payment`, `base_automation`). Odoo marks these `application: False`; BitGuard deliberately sets `application: True` (so a tenant can install and uninstall them) and hides the tile with a separate `launcher_tile: False` gate. `application` and `launcher_tile` are two different concepts: the first means "installable app", the second means "has a Command Center tile".

**Decision Rules (ALL must be true):**
- Has NO Command Center tile (`launcher_tile: False`), while being `application: True` in the database so tenants can install it
- Has admin configuration UI (accessible only through Settings — never as a primary nav app)
- Provides a shared service consumed by Layer 3 Business Apps (e.g., user identity, approval gates, mail servers, reports engine)
- CAN be installed or uninstalled by a tenant (unlike Layer 1)

**Layer 2 Modules:** see `.agents/rules/layer_registry.json` (filter `layer: 2`).

**Settings Sidebar:** Layer 2 modules MUST export a static `settingsMenu` array from their `config/menu.js`. This is the static injection pattern (see Rule 5H).

### Rule 9B: The Layer 2 Control Plane Split (`system` vs `shell`)
To maintain strict Domain-Driven Design (DDD) and prevent "God Modules", Layer 2 platform services are split into two distinct, highly specialized modules. Both are classified as Layer 2 (`application: True`, `launcher_tile: False`):

1.  **The `shell` Module (The Visual Control Plane):**
    *   This module is the UI Framework of the ERP (matching Odoo's `web` module).
    *   **Domain:** It is responsible for rendering the Operating System shell. 
    *   **Contents:** It houses the App Launcher (`CommandCenterPage`), the Master Layouts (`Sidebar`, `TopBar`), and the shared UI primitives (`DataTable`, `KanbanBoard`, `<FormattedDate />`). 
    *   **Rule:** Business apps (Layer 3) import from `shell` to render their views.

2.  **The `system` Module (The IT Control Plane):**
    *   This module is the Configuration Engine (matching Odoo's `base_setup` module).
    *   **Domain:** It is responsible for IT Administration, Global Settings, and Security Policies.
    *   **Contents:** It houses `GeneralSettingsPage`, `SecurityPolicyPage`, and infrastructure triggers (e.g., "Run Backup"). 
    *   **Rule:** It does *not* contain global layout wrappers or generic UI components.

---

### Layer 3 — Business Applications (Standalone Apps)

**Definition:** Full-featured business modules with their own Command Center tile, standalone navigation, and dedicated settings page. Tenants install and uninstall these. Equivalent to Odoo modules with `application: True`.

**Decision Rules (ALL must be true):**
- Has a Command Center tile (`application: True`)
- Has a standalone primary navigation menu
- Has its own settings page at `/admin/settings/<technical_name>/`
- Can be independently installed and uninstalled by a tenant

**Examples:** `crm`, `sales`, `inventory`, `accounting`, `employees`, `helpdesk`, `ecommerce`

**Settings Sidebar:** Layer 3 modules MUST NEVER export a static `settingsMenu` array. Their settings link is dynamically generated from the backend `InstalledModule` manifest (`has_settings: True`, `settings_url`). This is the dynamic injection pattern (see Rule 5H).

---

### Layer 4 — External Integrations (Third-Party Connectors)

**Definition:** Modules that act as bridges to external third-party platforms or services. They depend on Layer 3 apps and add capabilities by connecting to an outside system. They may or may not have their own UI.

**Decision Rules (at least one must be true):**
- Connects to an external SaaS platform (WhatsApp, Amazon, Stripe, etc.)
- Communicates via external API/webhook with a service your codebase does not own
- Would break if the external service's API changed or was discontinued

**Flags:** `application: False`, `launcher_tile: False`. No Command Center tile; settings are injected into `system` (Rule 55). A Layer 4 module is an external connector, not an internal glue module (internal glue between two apps is a Rule 12 soft dependency, not a module).

**Layer 4 Modules:** see `.agents/rules/layer_registry.json` (filter `layer: 4`). Payment *provider* connectors are Layer 4; the `payments` framework itself is Layer 2.

---

### The One-Line Decision Test (for AI Agents)

Before classifying ANY module, answer these questions in order:

1. **Is it non-removable, headless, and the root of the dependency graph (or a UI-less universal foundation)?** → Layer 1 (`application: False`, `launcher_tile: False`)
2. **Is it a shared platform service with an admin-only UI that apps consume, with `launcher_tile: False`?** → Layer 2 (`application: True`, `launcher_tile: False`)
3. **Is it an app with its own Command Center tile?** → Layer 3 (`application: True`, `launcher_tile: True`)
4. **Does it primarily bridge an external third-party system and add capability on top of Layer 3 apps?** → Layer 4 (`application: False`, `launcher_tile: False`)

If none of these apply, the module is not yet properly defined — escalate to the user. A module is not classified until it has an entry in `.agents/rules/layer_registry.json`.

---

### Critical Constraints (NEVER violate these)

- A Layer 1 module MUST NEVER import from a Layer 2, 3, or 4 module.
- A Layer 2 module MUST NEVER import from a Layer 3 or 4 module.
- A Layer 3 module MUST NEVER hard-depend on a Layer 4 module (reach it through a Rule 12 soft dependency or registry).
- A Layer 3 module MAY depend on another Layer 3 module only when that dependency is declared in its manifest `depends` (this mirrors the Odoo module graph, e.g. `hr_expense` depends on `hr` and `account`).
- Dependency ALWAYS flows upward (higher layers depend on lower, never the reverse).
- `.agents/rules/layer_registry.json` is the **single source of truth** for which layer each module belongs to (see Rule 65). Always read it before making architectural decisions. `SYSTEM_ARCHITECTURE_MAP.md` is only a human-readable view of it.

---

### 5H. The Hybrid Settings Routing Law (Dynamic vs. Static Menus)

To maintain both the predictable uniformity of Business Apps and the granular flexibility of Platform Services, the ERP must employ a hybrid routing strategy for the Global Settings Sidebar, mirroring the modern **Odoo 17** standard.

*   **Layer 3 Business Apps (100% Dynamic):** Apps like CRM, Sales, or Inventory must NEVER export a static `settingsMenu` array. Their settings link is dynamically generated and grouped by the `system` aggregator purely by reading the `has_settings` and `command_center_section` flags from the API manifest payload. This enforces the "1 App = 1 Settings Page" uniformity.
*   **Layer 2 Platform Services (Explicit/Static):** Platform infrastructure modules (e.g., `users`, `automation`, `approvals`, `inbox`) often have deep, multi-link configuration menus that do not map to a simple manifest flag. These modules MUST explicitly export a static `settingsMenu` array in their `config/menu.js` file to allow developers to manually orchestrate their complex UI trees.
*   **Layer 1 Kernel Modules:** Do NOT export `settingsMenu` at all. Their sidebar entries (if any) are hardcoded directly in `system/config/menu.js` baseSettings as non-removable kernel configuration.

## Rule 32. Multi-Tenancy Serializer Validation (The Master Data Trap)

In a Row-Level Security architecture, the `TenantAwareManager` aggressively hides any records that do not belong to the active tenant. While this protects tenant isolation, it creates a severe vulnerability in Django REST Framework's validation pipeline when dealing with Global Master Data (e.g., Countries, Currencies).

**The Trap:**
When a Serializer validates a ForeignKey (e.g., assigning a Country to a Company), DRF implicitly uses the default `objects` manager of the target model. Because Master Data typically has `tenant_id = NULL`, the `TenantAwareManager` hides it. The Serializer assumes the ID does not exist and throws a fatal `400 Bad Request (Invalid pk)`.

**The Tier-1 Standard (Dynamic Initialization):**
You must NEVER bypass this by simply defining `queryset=Country.all_objects.all()` on the Serializer class attribute, as this creates an IDOR vulnerability allowing users to select data owned by *other* tenants.
Instead, you must intercept the Serializer's `__init__` method to mathematically allow Global Master Data OR the user's specific data:

```python
class CompanySerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        tenant = getattr(request, 'tenant', None)
        if request and tenant:
            secure_filter = Q(tenant=tenant) | Q(tenant__isnull=True)
            self.fields['country'].queryset = Country.all_objects.filter(secure_filter)
```

## Rule 33. The Tenant-to-Request Law (Decoupled Authentication)

**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
You must **NEVER** attach a `tenant` ForeignKey directly to the `User` model. This is a legacy SaaS anti-pattern that creates a strict 1-to-1 limitation, destroying the ability for a single user account to manage multiple workspaces seamlessly.

**The Tier-1 Standard (Middleware Resolution):**
This system strictly uses **Decoupled Authentication** via Request Middleware.
*   **The User** is a global identity. One user can belong to multiple tenants (Many-to-Many).
*   **The Tenant** is resolved dynamically on every single API call (via headers or subdomains) and is attached directly to the `request` object (i.e., `request.tenant`), **NOT** `request.user.tenant`.
*   **Agent Rule:** When writing Views, Serializers, or Services that require the active tenant context, you must ALWAYS retrieve it using `getattr(request, 'tenant', None)`. Never attempt to query the user's database profile for their tenant.

---

## Rule 34. Dual-Mode Architecture (Single-Tenant vs. Multi-Tenant)

This master codebase natively supports both **Multi-Tenant (SaaS)** and **Single-Tenant (Dedicated Enterprise)** deployments using the exact same underlying infrastructure. 

**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
If requested to adapt the system for a Single-Tenant deployment, you are strictly forbidden from stripping out, bypassing, or deleting the `TenantAwareModel` architecture or database columns. The core database schema and ORM queries must remain 100% identical across all deployments to prevent code fragmentation.

**To activate Single-Tenant Mode, you must use the "Default Tenant Toggle" Method:**
1.  **Environment Toggle:** The system relies on a global environment variable (e.g., `SINGLE_TENANT_MODE=True`).
2.  **Middleware Override:** When this mode is active, the backend `TenantMiddleware` must ignore all frontend headers or subdomains. It automatically forces `request.tenant = Tenant.objects.first()` (the primary dedicated database record) for every incoming request.
3.  **UI Simplification:** The React frontend detects this mode and visually hides all "Workspace Switcher" dropdowns and multi-tenant onboarding screens.

**Why this is enforced:** This architectural pattern ensures that features built for dedicated Single-Tenant deployments can be merged directly back into the Multi-Tenant SaaS core without rewriting any database queries. It also preserves a seamless upgrade path if a Single-Tenant client later acquires subsidiaries and needs to instantly unlock Multi-Company capabilities.


**The Dual-Power of Request-Level Resolution:**
Rule 33 strictly forbids `request.user.tenant`. We do this for two massive architectural reasons:

1.  **SaaS Scalability (The Skyscraper):** It allows a single global user account (e.g., an external accountant) to access multiple different SaaS workspaces. If you hardcode `request.user.tenant`, you lock the user into a 1-to-1 relationship and break the SaaS model.
2.  **Dual-Mode Compatibility:** By forcing all API logic to read the tenant from the `request` (populated centrally by `TenantMiddleware`), the business logic becomes completely agnostic to how the system is deployed:
    *   *In SaaS Mode:* The Middleware reads the URL subdomain and dynamically attaches the correct tenant.
    *   *In Dedicated Mode:* The Middleware ignores the URL and blindly attaches `Tenant.objects.first()`.

Because the Middleware absorbs all this complexity, the underlying API code never has to change. The Middleware is the brain; the Request is the messenger. Trust the Request.

## Rule 35. The FormData Serialization Rule (Empty String Interception)

When the React frontend submits multipart/form-data (which is mathematically mandatory when a form includes file uploads like logos or documents), all cleared or empty fields are transmitted as empty strings ("") rather than JSON 
ull. 

Because Django REST Framework (DRF) strictly rejects "" for UUIDs and ForeignKeys (resulting in a 400 Bad Request), we must handle this limitation at the backend gateway.
*   **CRITICAL INSTRUCTION FOR AI AGENTS:** You are strictly forbidden from "fixing" this by having the React frontend omit empty fields. Omitting fields prevents users from deliberately clearing existing database relationships.
*   **The Standard Fix:** When writing a DRF ModelSerializer that processes FormData with nullable Foreign Keys, you must ALWAYS override the to_internal_value method. You must intercept the raw data and explicitly convert "" into Python None before DRF's internal validation begins.

## Rule 36. Global File Validation Standard

To protect the server from storage bloat and malicious file execution, all file uploads must be strictly governed at the database level. 
*   **CRITICAL INSTRUCTION FOR AI AGENTS:** You must never create a naked models.FileField or models.ImageField in this codebase.
*   **The Standard Fix:** Every file field must utilize the global validators located in apps.base.validators. 
    *   For standard documents, attach validators=[validate_document_file]. 
    *   For images, attach validators=[validate_image_file]. 
*   This ensures that the 10MB file size limit and the strict whitelist of safe extensions (e.g., .pdf, .png, .jpg) are mathematically enforced across every module in the ERP.


## Rule 37. The UI Proximity Fallacy & Layer 1 Infrastructure Ownership

**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
You must **NEVER** place heavy business logic or infrastructural actions inside generic "Settings" services, regardless of where the trigger button is located on the frontend UI. Furthermore, fundamental infrastructure logic must reside in the correct architectural layer.

**The Fallacy:**
Just because a button (e.g., "Trigger Backup", "Sync Search Indexes") lives on a "Settings" page in the React frontend, does NOT mean the backend logic belongs in the `SettingsService` or the `system` module.

**The Tier-1 Standard (Odoo 17 Alignment):**
1. **Segregation of Settings:** A "Settings" backend service (equivalent to `res.config.settings` in Odoo) has exactly ONE architectural responsibility: **Saving, loading, and validating configuration values**.
2. **Layer 1 Infrastructure Ownership:** Fundamental system infrastructure (e.g., Database Backups, Base Models, Master Data) belongs exclusively to the **`core`** module (Layer 1) — exactly how Odoo places `ir.model` and database management into its `base` module.

**By Example:**
If the user clicks "Trigger Database Backup" on the General Settings page:
*   ❌ **WRONG:** Routing the API call to `apps/system/services/settings.py` and writing a file-copying script inside the `SettingsService`. This creates a "God Object" anti-pattern and violates Layer 1 kernel boundaries.
*   ✅ **CORRECT:** The frontend Settings page calls a dedicated API endpoint (`/api/v1/base/database/backup/`), which triggers a strictly isolated `DatabaseManagementService` located in `apps/base/services/` (Layer 1).

Always isolate execution logic into dedicated, single-responsibility services, and place infrastructure services in the `core` module.

## Rule 38. The Skyscraper Doctrine (Logical Multi-Tenancy vs. Database-per-Tenant) [CLOUD-NATIVE]

**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
You must fundamentally understand that this ERP operates on a **Logical Multi-Tenancy (Shared Database, Shared Schema)** architecture—often referred to as the SaaS "Skyscraper" model. You must NEVER confuse this with standard Odoo's "Multi-Company" feature, which operates on a **Database-per-Tenant** architecture (the "Detached House" model).

**The Architectural Distinction:**
1.  **Standard Odoo (Database-per-Tenant):** Odoo is inherently Single-Tenant. One customer = one physical database (a detached house). Inside that database, the customer can create multiple legal entities (Multi-Company).
2.  **This BitGuard ERP (Logical Multi-Tenancy):** This system is a true SaaS Skyscraper. A single shared database holds data for millions of different SaaS customers, mathematically separated by `tenant_id`. 
    *   **The `Tenant` model:** Represents the entire SaaS subscription / Workspace (e.g., "Disney's Workspace" vs. "Netflix's Workspace"). This is the absolute, impenetrable data boundary.
    *   **The `Company` model:** Inherits from `TenantAwareModel`. It represents the legal entities *inside* a specific tenant (e.g., "Pixar" and "Marvel" inside the Disney workspace). 

**Agent Enforcement Rules:**
*   **Zero Cross-Tenant Sharing:** Unlike Odoo's Multi-Company where products and users can be shared across companies, Tenant A and Tenant B in this ERP exist in parallel universes. The `TenantAwareManager` enforces mathematical isolation.
*   **Decoupled Identity:** Because a single global `User` might be an external accountant invited to both Tenant 1 and Tenant 2, you can NEVER rely on a user's database profile to determine the active tenant. You must always extract the active tenant from the HTTP Request (via `TenantMiddleware`).

## Rule 39. The Data Gravity Law (Domain Ownership of Services) [API-FIRST & HEADLESS]

**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
You must strictly enforce **Domain Ownership** across both the Backend API and the Frontend Services. You must NEVER place data-fetching or data-mutating methods inside a generic `settingsService.js` (or any generic service) just because the frontend UI happens to display that data on a "Settings" page.

**The Fallacy:**
Because there is a "Document Configuration" tab on the Settings UI, previous agents hallucinated a `getDocumentConfig()` method inside the frontend `settingsService.js` and pointed it to a fake backend endpoint.

**The Tier-1 Standard (Domain Dictates Service):**
Frontend Service files and Backend API endpoints are dictated by the underlying **Domain Model**, never by the UI layout.\n\n**EXCEPTION TO THE DATA GRAVITY LAW (The Kernel Delegation):**\nBecause the re module (Layer 1) is strictly headless and forbidden from possessing UI pages (per Rule 9), it cannot host its own frontend views. Therefore, any UI pages required to display or manage re database models (e.g., System Events, Tenants, Settings) **MUST be delegated to the system app** (Layer 2 Control Plane).
*   **The Rule by Example:** Because document fields (like `logo` or `font`) physically belong to the `Company` model in the database, ALL frontend calls to update them MUST be routed through `companyService.js`, calling the standard `core/companies/{id}/` backend endpoint. 
*   **Universal Enforcement:** This applies to every feature. If a UI setting modifies a `User` property, the method belongs in `userService.js`. If a UI setting modifies an `AutomationRule`, the method belongs in `automationService.js`. 
*   The `settingsService.js` file is only permitted to handle pure, abstract system configurations (like clearing system cache) that do not belong to any other distinct business domain.


## Rule 40: The Lexical Symmetry Law
File names, class names, and service names MUST be perfectly symmetrical across the stack. If a database model is named `AuditTrail`, the backend service file must be `audit_trail.py`, the backend class must be `AuditTrailService`, and the frontend file must be `auditTrailService.js`. Never abbreviate or arbitrarily change names between layers.

## Rule 41: The Vertical Mixin Law (Strict Layered DDD)
Do **NOT** use horizontal slicing for mixins (e.g., do not create a global `core/mixins/` folder). Mixins must be strictly segregated by the architectural layer they operate on:
*   **API-Layer Mixins:** Mixins that modify ViewSets or HTTP Requests (e.g., `TenantScopedMixin`) MUST live in `apps/<module>/api/mixins.py`.
*   **Domain-Layer Mixins:** Mixins that intercept database ORM operations (e.g., `ChatterMixin`, `AuditTrailMixin`) MUST live in `apps/<module>/domain/mixins.py`.
Never mix HTTP logic with Database logic.

## Rule 42: The Middleware Segregation Protocol
All global application middleware must live centrally in `apps/base/middleware/`. Furthermore, they must be separated by network protocol:
*   **WSGI / HTTP:** Standard request middlewares (Tenant routing, ThreadLocals) live in `apps/base/middleware/http.py`.
*   **ASGI / WebSockets:** Django Channels middlewares live in `apps/base/middleware/websockets.py`.
Never merge ASGI and WSGI middleware into the same file.

## Rule 43: ThreadLocal User Resolution (The Deep ORM Rule)
Because Django Models sit at the very bottom of the architecture, they inherently do not have access to the `request` object. **NEVER** pass the `request` object through layers of function arguments just to reach the database. 
Instead, if a Model or deep ORM interceptor needs to know the active user, you must retrieve it from the ThreadLocal memory by calling:
`from apps.base.middleware.http import get_current_request`

## Rule 44: The Dual-Layered Auditing Doctrine (Strict Split)
To match Tier-1 ERP standards (like Salesforce and Odoo), the ERP utilizes a strictly split, dual-layered auditing system. **Never attempt to merge these two systems into a single database table.** They have different schemas, different retention policies, and different use cases.

#### Layer 1: System Event Logging (Global Security & IT)
This layer tracks *who* did *what* to the global system. It cares about IP Addresses, Endpoints, and User Agents.
*   **Database Model:** `SystemEventLog`
*   **Backend Service:** `system_event_service.py` (`SystemEventService.log_action()`)
*   **Frontend UI:** `SystemEventPage.jsx`
*   **When to use:** Use this explicitly in Service files for high-level technical events (e.g., "User Login Failed", "Database Backup Triggered", "Module Installed", "Permission Granted").

#### Layer 2: Field History Tracking (Data Lifecycle & ORM)
This layer tracks the step-by-step lifecycle of *specific business records*. It cares about Generic Foreign Keys, Field Names, Old Values, and New Values. It does *not* care about HTTP data.
*   **Database Model:** `FieldHistory`
*   **Backend Mixin:** `FieldHistoryMixin` (Intercepts `save()` to calculate diffs)
*   **When to use:** Use this to automatically track value changes on business records (e.g., "Invoice Amount changed from $100 to $200").

#### The Opt-In Law (Precision Auditing for Field History)
Do NOT blindly apply `FieldHistoryMixin` to all models. It causes database bloat and performance death. It must be selectively applied.
*   **MUST Inherit (High-Risk/Core Models):** Financial & Inventory (`SalesOrder`, `PurchaseOrder`, `Invoice`), Security (`User`, `Company`, `SystemParameter`), and Core Operations (`CRMLead`).
*   **MUST NOT Inherit (Transient/Low-Risk Models):** Logging tables (`SystemEventLog`, `FieldHistory`), Technical data (`Session`, `Token`, `BackgroundJob`), and Metadata (`Tag`, `Category`, `Language`).

## Rule 45: The Service Domain Law (Frontend Decoupling)
Frontend API services must ALWAYS be strictly mapped to the backend endpoint's domain, regardless of where the UI lives. 
*   If an endpoint is /api/v1/base/..., the frontend service MUST live in src/apps/base/api/. 
*   The system app is a pure UI Control Plane and should contain almost NO internal services; it must import services from the domain kernels (base, tenants).


## Rule 46: The Configuration Cascade Law (Tenant vs. Company vs. Headless)
**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
When building configuration fallbacks (Language, Timezone, Currency, Themes), you must strictly obey these two MACH principles:

**1. Business Data Ownership (The Tenant Trap):** 
The `Tenant` model is purely invisible infrastructure (the walls of the skyscraper). You must NEVER add business settings (Language, Timezone, Currency) to the `Tenant`. All organizational business configurations belong strictly to the `Company` model.

**2. The Headless Resolution Engine:** 
Because this is a MACH architecture, the Django backend must remain "dumb." It must never compute configuration fallbacks or format localized data on the server. The backend strictly returns raw, decoupled data (User preferences + Company preferences). The fallback logic (`User -> Active Company -> System Default`) must ALWAYS be computed on the Frontend Control Plane (e.g., inside a React Global Context).

## Rule 47: The Asymmetric Module Law (Frontend-Only Modules)
**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
Unlike legacy monolithic ERPs (e.g., Odoo) that require a backend Python folder for every piece of UI, this system is a strict **MACH (Headless) ERP**. The Django backend must remain completely blind to visual orchestration. 

**The Rule (The Dead-Code Ban):**
If a module possesses **zero database tables** and **zero backend API endpoints**, you are strictly forbidden from creating a corresponding `backend/apps/<module>` directory. You must never create empty Django apps just to hold metadata or maintain "folder symmetry."

Modules that are pure UI Consumers must exist **exclusively on the frontend.**

**Key Examples of Frontend-Only Modules:**
1.  **The `shell` Module (Layer 2):** This module houses the global React layouts, the Command Center grid, and shared UI components (DataTables, TopBar). Because it relies on no specific database tables, it exists **exclusively** at `frontend/src/apps/shell/`. It has zero backend presence.
2.  **The `apps` Module (The App Store):** According to Rule 39 (Data Gravity), the `InstalledModule` database table and its API ViewSets are strictly owned by the `base` kernel. Because the data and API live in `base`, the `apps` module is reduced to a pure UI React consumer. Therefore, it exists **exclusively** at `frontend/src/apps/apps/`. It has zero backend presence.

## Rule 48: The Headless Registry Pattern (Vite Glob Imports)
**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
To maintain strict MACH headlessness, **Layer 2 (The Shell)** must remain 100% agnostic to the existence of any Layer 3 business apps. 

**The Rule (The Hard-Import Ban):**
You are strictly forbidden from writing static `import` statements inside the Shell (e.g., `ModuleLayout.jsx`, `GlobalSearch.jsx`) that point downward into a specific business application folder (e.g., `apps/crm` or `apps/analytics`).

**The Solution:**
All cross-module feature aggregation (Menus, Search Plugins, Routing) must be resolved dynamically at build time using Vite's `import.meta.glob` registry pattern. 
*   **Example (Menus):** `const appMenus = import.meta.glob('../../apps/*/config/menu.js', { eager: true });`
*   **Example (Search):** `const searchPlugins = import.meta.glob('../../apps/*/config/search.js', { eager: true });`
This guarantees the shell will never crash if a tenant uninstalls a module.

## Rule 49: Cross-App UI Isolation (Layer-3 to Layer-3 Soft Dependencies)
**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
While business applications (Layer 3) often share data contexts (e.g., Sales relies on Accounting Invoices), they are strictly prohibited from statically importing React Components from each other. 

**The Rule:**
An app (e.g., `sales`) cannot write a static import statement importing a `.jsx` component from a sibling app (e.g., `accounting/components/InvoiceLineItems.jsx`). Doing so creates a fatal build-time coupling that crashes the app if the sibling module is missing.

**The Solution:**
You must use the global `ComponentRegistry.jsx` and `<SuspenseComponent name="..." />` wrapper.
1.  The owning app registers its exportable UI pieces in its `config/components.js` file using `React.lazy()`.
2.  The consuming app requests it dynamically: `<SuspenseComponent name="accounting.InvoiceLineItems" />`.
If the requested app is uninstalled or deactivated, the registry handles it gracefully with a fallback UI instead of crashing the React Tree.



## Rule 9C: The Headless UI Proxy (The Split-Layer Phenomenon)
**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
You must understand the MACH asymmetry between the Backend Data Plane and the Frontend Control Plane, specifically regarding Layer 1 Kernel modules (e.g., `auth`, `tenants`).
*   **The Rule:** Layer 1 is strictly headless and has zero UI.
*   **The Phenomenon:** Humans still require a visual way to authenticate or switch workspaces. Therefore, the frontend spawns "Proxy UI Modules" (e.g., `frontend/src/apps/auth` and `frontend/src/apps/tenants`). 
*   **Classification:** The *backend* Python code is the pure Layer 1 Data Plane. The *frontend* React UI acts as a **Layer 2 Control Plane** application. It is one single module mathematically split across two planes. You are strictly forbidden from forcing Frontend UI pages into `frontend/src/core/` just to make the folder structures "match."

## Rule 48B: The Registry Dictatorship Law (Single Source of Truth)
While Rule 48 mandates the use of `import.meta.glob` for dynamic UI aggregation, you must **never** duplicate these registries across modules. 
*   **The Rule:** If a module owns a specific business domain, it is the *sole dictator* of that domain's registry.
*   **The Settings Dictator:** The `system` module (The IT Control Plane) is the absolute, sole dictator of the Global Settings Menu. It alone runs `import.meta.glob` to aggregate plugin menus inside `apps/system/config/menu.js`. 
*   **The Ban:** The `shell` module (The Canvas) and the `core/useManifest` hook (The Kernel) are strictly forbidden from running glob imports to calculate, aggregate, or override settings menus. The `shell` must act as a pure visual canvas that simply accepts and draws the finalized array provided by the `system` module.

## Rule 50: The 3-Tier Settings Architecture (Control Plane Routing)
To maintain Tier-1 MACH decoupling (similar to Odoo's `base_setup` modularity), the global Settings Menu (owned exclusively by the `system` module) must aggregate settings links using a strict 3-tier classification strategy. This prevents Business Apps from polluting the IT Control Plane.

#### 1. Layer 1 (The Kernel): Hardcoded Foundation
Because the `system` module acts as the explicit Control Plane proxy for the `core` and `auth` backend modules, it inherently knows the foundational infrastructure. These core routes must be hardcoded to guarantee system stability.
*   **Mechanism:** Static Array Definition
*   **Code Standard:**
    `javascript
    // frontend/src/apps/system/config/menu.js
    const baseSettings = [
        {
            section: 'Technical',
            items: [
                { label: 'System Events', path: '/admin/settings/logs' },
                { label: 'System Parameters', path: '/admin/settings/parameters' }
            ]
        }
    ];
    `

#### 2. Layer 2 (Platform Services): Dynamic Plugin Injection
Other IT infrastructure apps (e.g., `users`, `automation`, `inbox`) are peers to the `system` app. To prevent fatal React crashes if an IT administrator uninstalls one of them, they must inject their settings menus dynamically at build-time.
*   **Mechanism:** Vite `import.meta.glob` (The Registry Dictatorship)
*   **Code Standard:**
    `javascript
    // frontend/src/apps/system/config/menu.js
    const pluginMenus = import.meta.glob('../../*/config/menu.js', { eager: true });
    
    Object.entries(pluginMenus).forEach(([path, mod]) => {
        if (mod.settingsMenu && Array.isArray(mod.settingsMenu)) {
            // Dynamically extract mod.settingsMenu and inject it into baseSettings
        }
    });
    `

#### 3. Layer 3 (Business Apps): Data-Driven Manifest (Data Gravity)
Business apps (`sales`, `crm`, `accounting`) are strictly forbidden from writing custom React UI settings menus into the `system` app. Instead, their settings link is automatically generated based purely on their Backend Database metadata (`has_settings: true`). 
*   **Mechanism:** API Manifest Resolution
*   **Code Standard:**
    `javascript
    // frontend/src/apps/system/config/menu.js
    export const getSettingsMenu = (manifestData = []) => {
        manifestData
            .filter(mod => mod.application === true && mod.has_settings === true)
            .forEach(mod => {
                // Auto-generate settings link derived purely from the DB
                unifiedMenu.push({
                    label: mod.display_name || mod.name,
                    path: mod.settings_url // e.g., /admin/crm/settings
                });
            });
        
        return unifiedMenu;
    };
    `


## Rule 51: The Settings UI Decoupling Law (The Manifest Truth)
**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
When determining which apps have a Settings page, you are strictly forbidden from hardcoding routes, arrays, or React components in the frontend.
*   **The Backend Truth:** The existence of a settings page (has_settings: True) and its path (settings_url) MUST be defined in the app's __manifest__.py file.
*   **The API Enforcement:** The backend sync_modules service extracts these manifest keys and saves them to the PostgreSQL InstalledModule table.
*   **The Frontend Rule:** The React frontend (specifically system) must act as a 'dumb' client, dynamically generating the settings navigation based purely on the has_settings JSON flag returned by the API.

## Rule 52: The Settings Schema Protocol (The `res.config.settings` Headless Equivalent)

**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
When managing global system or app-specific settings, you must understand how this Headless ERP modernizes Odoo's legacy settings architecture. You are strictly forbidden from creating "Transient Models" (fake/temporary database tables) to handle settings forms.

**The Monolithic Fallacy (Odoo's `res.config.settings`):**
In standard Odoo, `res.config.settings` is a `TransientModel`. Because Odoo's server-side XML views require a physical database row to bind to, Odoo creates a temporary database record when an admin opens the Settings page, extracts the values upon save, writes them to `ir.config_parameter`, and then deletes the temporary row. This is a monolithic workaround that wastes database I/O.

**The Tier-1 MACH Standard (Stateless Validation):**
Because BitGuard is a Headless ERP, the backend does not render UI views and does not need temporary database rows. We split Odoo's `res.config.settings` into two stateless halves:

1. **The Temporary State (Frontend Control Plane):** 
   The React frontend natively holds uncommitted settings in browser memory (React State) while the admin edits the form.
2. **The Validation Registry (Backend Data Plane):** 
   When the user saves, the backend does NOT accept arbitrary keys. Every setting must be explicitly declared in a `settings_schema.py` file within the app's directory. 
3. **The Persistent Store (`SystemParameter`):**
   The `/batch_update/` API endpoint intercepts the payload, validates the keys and data types against the central `settings_registry.py`, and securely saves them into the `SystemParameter` model (the exact equivalent of Odoo's `ir.config_parameter`), scoped by `tenant_id`.

**Agent Enforcement:**
You must NEVER write settings directly to the database without schema validation. If you add a new setting for an app, you MUST define it in that app's `settings_schema.py` using the standard dot-notation (e.g., `crm.lead_scoring`), or the central registry will reject the save request.

## Rule 53: The Strict Tree-Shaking Standard (The Icon Registry)
**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
You are strictly forbidden from writing wildcard imports for heavy UI libraries (e.g., 'import * as LucideIcons from 'lucide-react''). This destroys Webpack/Vite tree-shaking and causes massive frontend bundle bloat, violating Tier-1 performance standards.

*   **The Problem:** The backend database often stores icon names as plain text strings. Agents often use wildcard imports to dynamically map these strings to React Components.
*   **The Standard Fix:** You MUST use the central `IconRegistry` located strictly at `frontend/src/apps/shell/components/ui/iconRegistry.js`. If an app requires a new icon, you must explicitly add it to the named exports in that registry file. All dynamic icon resolution must pass through this single file.

## Rule 54: The Manifest Segregation Protocol (menu.js vs settingsManifest.js)
To maintain strict Domain-Driven Design on the frontend, an app's primary navigation must be physically separated from its IT configuration hooks.

*   **config/menu.js (Primary Navigation):** This file is STRICTLY reserved for the app's primary navigation inside the Command Center and its main layout. It must never contain links to the /admin/settings/ domain.
*   **config/settingsManifest.js (Control Plane Hooks):** If a Layer 2 Platform App (like users or inbox) needs to inject configuration menus into the system settings pages, it MUST export them from this dedicated manifest file. The system module will dynamically aggregate these via import.meta.glob.
*   **The Ban:** Never export a settingsMenu array from a standard menu.js file.

## Rule 55: Layer 4 Settings Injection (The Edge Integration Standard)
**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
Layer 4 modules (Smart Add-ons, AI Engines, Payment Provider Connectors, Carrier Integrations, External Integrations) sit *on top* of the business logic. They are "Global Enhancers."

Because they are enhancements rather than standalone business apps, **Layer 4 modules are strictly forbidden from occupying a dedicated link in the left Settings sidebar.** (They must not rely on the 'has_settings: True' Layer 3 mechanism).

Instead, Layer 4 must inject its settings using one of two MACH methods:
1.  **Global UI Injection ('settingsManifest.js'):** If the module has global configurations (e.g., "Enter Stripe API Keys", "Enable AI Virtual Agents"), it must export a 'generalSettingsCards' array from its 'settingsManifest.js'. The 'system' module will dynamically aggregate these into the root "General Settings" page. It must never export a 'settingsMenu'.
2.  **Contextual Backend Injection ('settings_schema.py'):** If the configuration is specific to a business app (e.g., a "Use AI Lead Scoring" toggle for CRM), the Layer 4 module must declare that setting using the target app's prefix (e.g., 'crm.use_ai'). The backend Settings Registry will seamlessly merge it into the target app's schema.

## Rule 56: The AI Engine vs. AI Agent Decoupling Law
**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
To comply with Tier-1 MACH ERP standards, you must strictly decouple AI Infrastructure from AI Business Logic. You are forbidden from creating a monolithic "AI App". 

In this codebase, this separation is physically enforced by two explicitly named modules:

#### 1. The AI Engine (ai_engine module - Layer 4 Edge Infrastructure)
The ai_engine module is the headless technical plumbing. It handles LLM provider routing (OpenAI, Claude), token limits, API keys, vector databases, and security guardrails. It does not know what a "Lead" or "Invoice" is.
*   **Settings Management:** Because it is infrastructure, the ai_engine must inject its configuration cards (e.g., "LLM Providers", "Global Token Limits") directly into the **General Settings** page using the settingsManifest.js -> generalSettingsCards method.
*   **The Ban:** The ai_engine module must NEVER store business prompts, personas, or app-specific logic.

#### 2. The Global Fleet of Agents (agents module - Layer 3 Business Application)
BitGuard utilizes a **Global Fleet Model** for its digital workers. All autonomous agents, copilots, and their personas are managed centrally within the dedicated agents module. 
*   **Settings Management:** The agents module is a standard Layer 3 Business App. It acts as the global dispatch and configuration dashboard for all AI personas across the ERP. Future AI developers must not fragment agent management across individual apps (e.g., do not build a standalone agent manager inside CRM; instead, link the CRM to the global agents module).
*   **The Ban:** The agents module must NEVER store, request, or manage API keys or model endpoints. It must send clean requests to the ai_engine, allowing the engine to handle the external authentication.

**The MACH Execution Flow:**
The agents module compiles the business prompt and tools -> sends an internal request to the ai_engine -> the ai_engine attaches the central API key, executes the external LLM call, logs the token usage, and returns the response to the agent.

## Rule 57: The General Settings Aggregation Law (The IT Control Panel)
**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
The GeneralSettingsPage.jsx inside the system module serves strictly as the global "IT Control Panel." It must maintain perfect MACH decoupling. 

You must adhere to the 3-Tier General Settings strictures:

#### 1. The Hardcoded Foundation (Layer 1 Kernel)
Because the system frontend module is the explicit UI proxy for the headless base and tenants backend modules, it inherently owns the system's foundational configuration.
*   **Allowed:** Base infrastructure sections like "Users & Companies", "Permissions", and "Developer Tools" must be statically hardcoded into the baseKernelCards array inside GeneralSettingsPage.jsx.

#### 2. The Dynamic Injectors (Layer 2 Platform & Layer 4 Edge)
Global platform services (e.g., inbox emails, portal) and external integrations (e.g., ai_engine, stripe) must inject their configurations dynamically to prevent hard-coupling.
*   **Mechanism:** They must export a generalSettingsCards array from their respective settingsManifest.js. 
*   **Execution:** The GeneralSettingsPage.jsx uses Vite's import.meta.glob to retrieve these manifests, automatically grouping and rendering them by their Section Title (e.g., merging all AI and Payment cards under a single "Integrations" header). The page must NEVER import these plugins statically.

#### 3. The Strict Ban on Business Apps (Layer 3 Isolation)
Business Applications (e.g., sales, crm, accounting, inventory) manage vast amounts of domain-specific data. 
*   **The Ban:** Layer 3 Business Apps are **STRICTLY FORBIDDEN** from injecting cards into the General Settings page. 
*   **The Alternative:** They must utilize the has_settings: True backend database parameter, which automatically generates a dedicated, isolated settings page in the left sidebar exclusively for that business app. Do not mix Business Settings with IT Settings.

## Rule 58: The settingsManifest.js Injection Protocol
**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
You must never hardcode settings navigation links. All Settings routing is dynamically aggregated based on the MACH Layer of the app.

1.  **Layer 3 Business Apps:** Never use a manifest file for navigation. Simply set has_settings: True in the backend database. The system will automatically generate a dedicated settings link in the left sidebar (e.g., /admin/settings/sales).
2.  **Layer 2 / Layer 4 Technical Apps:** Must use frontend/src/apps/<app>/config/settingsManifest.js. You have two injection targets:
    *   generalSettingsCards: [] ? Injects visual blocks directly into the global General Settings page.
    *   topMenu: [] ? Injects navigation links into the Settings Top Bar. You must provide {category, group, label, path, devOnly: true/false}.
3.  **The Left Sidebar Ban:** The left sidebar of the Settings App is strictly reserved for Business Apps. You are forbidden from placing Technical, IT, or Security links there.

## Rule 59: Global Context Layering (The Developer Mode Law)
**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
In a Headless MACH frontend, there is a strict separation between global state (core) and visual layouts (shell).

*   Global State Providers (like DeveloperModeContext, AuthContext, ManifestContext) must **strictly reside in frontend/src/core/context/**.
*   Even if a state (like Developer Mode) is primarily used to toggle UI elements, it is still a global variable that any Layer 3 app might need to read. 
*   If you place a React Context inside the visual shell module, you are violating the Kernel Boundaries (Rule 9) and will cause circular dependency failures when business apps try to consume it.

## Rule 60: The Schema-Driven UI Law (Settings Architecture)
**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
You are **STRICTLY FORBIDDEN** from writing custom HTML, Tailwind components, forms, or manual state management (e.g., `useState`, `<input>`, `<Switch>`) for App Settings pages. 

BitGuard ERP enforces a **100% Headless, Schema-Driven UI** for configuration pages. The frontend React component must act as a "dumb" canvas that mathematically generates the UI based entirely on the backend Python schema.

If you are tasked with adding a new setting to any module, you must strictly follow this 3-step mechanism:

#### 1. Data Plane: The Python Schema (Single Source of Truth)
All UI parameters (type, default value, grouping, and labels) must be defined in the backend app's `settings_schema.py` file. The frontend generic renderer will use this to automatically choose the correct UI element (e.g., "type": "boolean" renders a toggle).

`python
# backend/apps/crm/settings_schema.py
SETTINGS_SCHEMA = [
    {
        "key": "crm.enable_ai_scoring",
        "type": "boolean",
        "default": False,
        "label": "Enable AI Lead Scoring",
        "help": "Automatically score leads using the global AI engine.",
        "group": "Lead Generation"
    }
]
`

#### 2. Discovery: The Manifest Declaration
You must ensure the app's backend `__manifest__.py` file includes `has_settings = True`. This signals the Layer 2 `system` aggregator to automatically generate the left-sidebar navigation link for the module.

#### 3. Control Plane: The Dumb React Wrapper
If a settings page does not yet exist for the app, you must create a virtually empty React component. It must strictly invoke the global `<SettingsRenderer />` and pass its `schemaKey`. **Never write raw form inputs here.**

`jsx
// frontend/src/apps/crm/pages/settings/CrmSettingsPage.jsx
import React from 'react';
import SettingsRenderer from '@/apps/system/components/settings/SettingsRenderer';

export default function CrmSettingsPage() {
    return (
        <div className="max-w-5xl mx-auto">
            <SettingsRenderer schemaKey="crm" title="CRM Settings" />
        </div>
    );
}
`

#### The Execution Flow Mechanism
By strictly adhering to this law, you guarantee the following MACH workflow:
1. The `<SettingsRenderer />` requests the Python schema via `/api/base/system-parameters/schema/?app={schemaKey}`.
2. It requests the saved database values via `/api/base/system-parameters/?prefix={schemaKey}`.
3. It automatically groups the fields, renders the exact UI elements, and manages the Odoo-style "Unsaved Changes" save/discard state without any manual frontend coding.

## Rule 61: The Universal Dependency Law (Data Gravity Override)
**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
While Rule 39 (Data Gravity) dictates that models belong in their specific business app, there is a strict override for **Universal Dependencies**.

If a domain model is fundamentally required by 3 or more isolated Layer 3 apps (e.g., `Country`, `Currency`, `UnitOfMeasure`, `Translation`), its Data Gravity collapses into Layer 1. 
You must build these models inside `backend/apps/base/` to prevent circular cross-module imports. 

*Example:* `inventory` cannot depend on `sales`, and `sales` cannot depend on `inventory`. By placing `UoM` in `base`, both apps can safely import it downward.

## Rule 62: The Settings UI Purity Law (No Destructive Actions)
**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
Settings pages are strictly meant for manipulating **configuration state** (e.g., toggling booleans, selecting default values, setting string parameters). 

You are strictly forbidden from placing **Destructive Actions** or **Job Triggers** (e.g., "Clear Cache", "Sync Database", "Prune Logs", "Run Backup Now") on any Settings page or inside `SettingsRenderer`.

*   **Configuration** belongs in Settings.
*   **Actions** belong in List Views. 
If an Admin needs to trigger a backup, they must navigate to the Backups List View (`/admin/settings/backups`) and click the action button there. Do not clutter the Control Panel with executable scripts.

## Rule 63: The Global Localization Law (i18n & Formatting)
**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
You are **STRICTLY FORBIDDEN** from using native JavaScript formatting functions (like `new Date().toLocaleDateString()`) or hardcoding currency symbols (like `$` or `€`) directly inside React UI components.

In a multi-national Micro-SaaS ERP, a user in Paris and a user in New York looking at the same invoice must see different formats. All formatting is cascaded dynamically.

**The Standard:**
1.  **For Visual UI Rendering:** You must always import and use the declarative wrappers from the Shell:
    ```jsx
    import { FormattedDate, FormattedCurrency } from '@/apps/shell/components/ui/Formatters';

    // ❌ ILLEGAL: <div>$ {amount}</div>
    // ❌ ILLEGAL: <span>{new Date(timestamp).toLocaleDateString()}</span>

    // ✅ CORRECT:
    <FormattedCurrency value={amount} />
    <FormattedDate value={timestamp} />
    ```
2.  **For Headless Data Processing (e.g., CSV Exports, Chart calculations):** You must import the engine hook from Core:
    ```jsx
    import { useFormatters } from '@/core/hooks/useFormatters';
    // const { formatCurrency, formatDateTime } = useFormatters();
    ```

## Rule 64: The Configuration Cascade Hierarchy
**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
Global state (Language, Timezone, Currency, Theme) must never be fetched directly from a database inside a random component. It must strictly flow downward through `frontend/src/core/context/ConfigContext.jsx`.

The context engine enforces a strict mathematical resolution hierarchy:
1.  **User Preference:** (e.g., The logged-in user explicitly set their language to French).
2.  **Company/Tenant Default:** (e.g., The user has no preference, so fallback to the Tenant's default currency: EUR).
3.  **System Default:** (Fallback to `en-us` or `USD` if neither the User nor Tenant configured it).

If you are building a new global setting, it must be wired into this exact `ConfigContext` hierarchy.

## Rule 65: The Layer Registry Law (Single Source of Truth)
**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
You must NEVER guess which layer a module belongs to, and you must NEVER classify a module from its folder name or from memory of "how ERPs usually work". The classification of every module is recorded in exactly one place: **`.agents/rules/layer_registry.json`**.

**1. The Registry is the authority.**
*   Read `layer_registry.json` BEFORE any task that depends on a module's layer: ESLint zones, import audits, settings routing, Command Center tiles, manifest edits, and any new module.
*   `SYSTEM_ARCHITECTURE_MAP.md`, Rule 0, manifests and linters must agree with the registry. If they conflict, the registry wins and the other file is wrong. Fix the other file, not the registry.
*   Never hardcode a list of modules per layer in a rule, a document or a config file. Point to the registry instead.
*   A new module is not classified until it has an entry in the registry. Add the entry first, then the manifest, then the docs.

**2. Two different flags (do not conflate them).**
*   `application` = "this is an installable app" (the App Store and the Odoo `application` flag).
*   `launcher_tile` = "this module gets a Command Center tile".

| Layer | `application` | `launcher_tile` | Meaning |
| :--- | :--- | :--- | :--- |
| L1 Kernel | False | False | Non-removable, headless root |
| L2 Platform | **True** | **False** | Installable platform service, hidden from the Command Center |
| L3 Business App | True | True | Installable app with its own tile |
| L4 External Integration | False | False | Connector, no tile, settings injected via Rule 55 |

Layer 2 is deliberately `application: True` even though the equivalent Odoo platform modules are `application: False`. This is the one intentional deviation from Odoo and it is part of the 4-layer MACH model.

**3. How Odoo 17 is converted to the 4 layers.** Odoo has 3 module kinds (root, platform, app) plus add-ons. Use this table to classify any new module that has an Odoo equivalent:

| Odoo 17 kind | How to recognise it | BitGuard layer |
| :--- | :--- | :--- |
| Root and UI-less foundations | `base`, `bus`, `uom`, `resource`, `analytic`, `digest`, `utm` | L1 (collapse into `core`, Rule 61) |
| Platform | `application: False`, depends only on root or platform, owns an admin UI (`base_setup`, `portal`, `product`, `payment`, `base_automation`, `web`) | L2 |
| App | `application: True` (`account`, `hr`, `crm`, `stock`, `mrp`, `project`, `website`, Enterprise apps) | L3 |
| External add-on | `application: False`, bridges a third party (`delivery` carriers, `payment_*` providers, `sale_amazon`) | L4 |
| Internal glue | `application: False`, only joins two apps (`account_payment`, `sale_stock`, `purchase_stock`) | Not a module. Use a Rule 12 soft dependency inside the owning L3 app |

Odoo apps may depend on other apps (`hr_expense` depends on `hr` and `account`). BitGuard follows the same rule: a Layer 3 module may depend on another Layer 3 module only when it declares that dependency in its manifest `depends`.

**4. The registry is verified automatically.** `scripts/validate_architecture.py` checks that every backend and frontend module folder has a registry entry, that every registry entry exists on disk, and reports any manifest whose `application` flag or `depends` direction contradicts the registry. Run it before every commit that touches `backend/apps/*/__manifest__.py`.

## Rule 66: The L2 Inversion of Control Law (The Anti-BFF Rule)
**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
You are **STRICTLY FORBIDDEN** from building monolithic ""Backend-for-Frontend"" (BFF) aggregators or central API proxies in Layer 2 (e.g., portal or system) that hard-import from Layer 3 business apps. This violates the MACH Microservices standard by creating a monolithic dependency chokepoint.

**The Portal Plugin Pattern:**
*   Layer 2 apps (like the Customer Portal or E-Commerce storefront) must remain ""dumb shells.""
*   They cannot import L3 models, services, or UI components.
*   Instead, Layer 3 apps (e.g., crm, ccounting) must physically own their own external-facing endpoints and React UI pages (e.g., rontend/src/apps/crm/pages/portal/PortalLeadsPage.jsx).
*   The L3 apps then inject these pages into the L2 shell dynamically via the global registry. If an L3 app is uninstalled, its portal tab simply disappears without breaking the L2 shell.

## Rule 67: The Server-Driven UI & Dynamic Routing Law (L3 Glob Pattern)
**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
While Layer 2 and Layer 4 technical apps use local frontend manifests (Rule 58), you are **STRICTLY FORBIDDEN** from inventing new frontend configuration files (e.g., config/portal.js or config/dashboard.js) for **Layer 3 Business Apps**.

For Layer 3 apps and central aggregators (Portal, Command Center), the frontend must act as a "dumb" reflection of the backend database:

**1. The Menu Injection Standard (Server-Driven UI):**
Aggregator menus (Portal Sidebar, Command Center grid) must read the active tenant's installed modules directly from the backend via the useManifest() context. The UI must loop over manifestData to dynamically generate links. You must never hardcode Layer 3 links in a static React array.

**2. The Route Injection Standard (Vite Globbing):**
To map these dynamic menus to physical React pages without violating the ESLint boundary rules (Rule 9), you must NEVER use hard file imports across domains. Instead, aggregator routers (like PortalRoutes.jsx) must use Vite's dynamic glob pattern:
`const routeModules = import.meta.glob('../../apps/*/routes/*Routes.jsx', { eager: true });`
This guarantees mathematically pure decoupling: L3 apps simply drop their route files in their own folder, and the L2 shell dynamically sweeps and mounts them at runtime.

## Rule 68: The Core Asymmetry Law
To prevent naming collisions and architectural confusion, developers must strictly recognize the difference between the "Outside Core" and the "Inside Core" on the frontend:
*   **The React Engine (rontend/src/core/):** This is the Headless OS. It contains the router, the Axios HTTP client, and generic UI primitives. It possesses absolutely zero business logic and has no knowledge of database models.
*   **The Database UI Proxy (rontend/src/apps/base/ and pps/system):** These are standard business apps. They act as visual proxies for the backend's lowest-level database tables (e.g., Currencies, Languages, Audit Logs). They are *not* the engine.

## Rule 69: The MACH State Decoupling Law (The "Slot" Pattern)
To maintain Tier-1 Micro-SaaS decoupling (mirroring platforms like CommerceTools and Shopify), the Headless Engine must never be tightly coupled to Business Apps.
*   **The Strict Ban:** The React Engine (rontend/src/core/) is mathematically forbidden from importing services, contexts, or logic from rontend/src/apps/ (including foundational apps like pps/auth or pps/tenant).
*   **Inversion of Control (The Slot Pattern):** Cross-cutting state (like Authentication Tokens or active Tenant IDs) must be passed to the Engine via generic slots:
    *   **Browser Memory:** The uth app writes the JWT to localStorage. The core Axios client reads it blindly from localStorage.
    *   **URL Resolution:** The core engine identifies the active tenant blindly by reading the subdomain from window.location.hostname. 
    *   **Generic Contexts:** The core provides dumb, empty Context Providers (e.g. SessionContext). The uth app is responsible for mutating the state inside that generic slot.


## Rule 70: The Master Data vs. Stateless Enum Law (Configuration Data)
**CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
When building configurations or system options (e.g., Paper Formats, Tax Rates, Unit of Measures), you must strictly evaluate whether the data is a stateless string or a mathematical structure. You are forbidden from hardcoding structural configurations directly into Python API Views.

**The Monolithic Fallacy (Hardcoded APIs):**
Lazy development often leads to returning static arrays from an API endpoint (e.g., `return Response({'formats': ['A4', 'Letter']})`). This is an anti-pattern. In a multi-tenant SaaS, tenant configurations are highly variable. A Japanese tenant may need "JIS B5", or an e-commerce tenant may need a custom "Zebra 4x6" label. Hardcoding blocks extensibility.

**The Tier-1 MACH Standard:**
You must split configuration into two distinct buckets:

1. **Stateless Settings (`SystemParameter`):** 
   If the configuration is a pure, flat boolean, string, or integer (e.g., `company.use_dark_mode = True`, or `reports.default_format_id = 5`), it belongs in the `settings_schema.py` registry and is saved as a `SystemParameter` (See Rule 52).
   
2. **Master Data Models (Structural Configuration):** 
   If a configuration possesses mathematical properties, logic, or requires tenant-level customization (e.g., a **Paper Format** needs `height`, `width`, `margin_top`, `dpi`), it **MUST** be built as a full physical database model (inheriting from `TenantAwareModel`).
   * *The Global Fallback:* Master Data models should allow global default seeding (`tenant_id = NULL`) so all tenants inherit the baseline (e.g., standard A4), while allowing specific tenants to create their own rows.

**The Master Data Placement Matrix (Shared Kernel vs. Bounded Context):**
Once you determine a configuration must be a Master Data Model, you must strictly route it using Domain-Driven Design (DDD) principles:

1.  **Domain-Specific Master Data (Bounded Context):** 
    If the structural model is primarily consumed by a single domain, it belongs strictly to that domain's module. The ase kernel must remain pure. 
    *   *Example:* PaperFormat belongs to 
eports.
    *   *Example:* TaxBracket belongs to ccounting. 
    *   *Example:* LeadStage belongs to crm.

2.  **Universal Master Data (The Shared Kernel / Rule 61 Override):**
    If the structural model is a fundamental reality of business physics required by 3 or more isolated Layer 3 apps, you are strictly forbidden from placing it in a business app. Doing so creates a catastrophic dependency chokepoint (e.g., if Currency is in ccounting, then sales and inventory are forced to depend on ccounting).
    *   These universal models must collapse into the Layer 1 Kernel (ase).
    *   *Examples of Universal Master Data:* Currency, Country, UnitOfMeasure, Language.
