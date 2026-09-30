> **Important:** For a complete, definitive mapping of all modules and their architectural layers (1, 2, 3, or 4), always refer to `SYSTEM_ARCHITECTURE_MAP.md` at the root of the project.

## THE ODOO 17 MANDATE (CRITICAL AI INSTRUCTION)
All architectural classifications, UI layouts, and system behaviors must strictly mirror the modern **Odoo 17** standard. 
* Do NOT reference, assume, or suggest behaviors from legacy ERPs or older versions of Odoo (e.g., Odoo 14/15/16).
* Older versions used cluttered admin dashboards with System/Settings/App tiles. Odoo 17 strictly forbids this. 
* In Odoo 17, Layer 2 Platform Services (Settings, App Store) must NEVER appear as tiles on the Command Center grid. They belong exclusively in the top navigation bar.

## Rule 0 — The Four-Layer Headless ERP Architecture Model (THE PRIME CLASSIFICATION LAW)

BitGuard adopts the **4-Layer Headless ERP Model**, derived from and compatible strictly with the **Odoo 17** module classification standard (`application` flag + `installable` flag). This is the ONLY classification framework you must use. Do NOT reference Salesforce's 5-layer model, SAP's Basis model, or older versions of Odoo (e.g., Odoo 15/16).

Every module in this codebase MUST be classified into exactly one of these four layers. The layer determines: how the module is routed in Settings, whether it gets a Command Center tile, how it injects its menu, and whether it can be installed/uninstalled by a tenant.

---

### Layer 1 — Kernel (Non-Optional Foundation)

**Definition:** The absolute lowest-level infrastructure. Non-removable. Zero standalone UI of its own. Every other module depends on it, directly or transitively. Equivalent to Odoo's `base` module.

**Decision Rules (ALL must be true):**
- Cannot be uninstalled under any circumstance
- Every other module depends on it (directly or transitively)
- Has NO standalone navigation menu
- Has NO Command Center tile (`application: False`)
- Contains foundational models (ORM base classes, tenant isolation, auth primitives)

**Current Layer 1 Modules:** `core`, `auth`, `tenants`

**Settings Sidebar:** Layer 1 modules do NOT inject into the sidebar. Their configuration is hardcoded directly into `system/config/menu.js` baseSettings.

---

### Layer 2 — Platform Services (Shared Infrastructure with Admin UI)

**Definition:** Cross-cutting platform services that every business app uses but that are NOT business apps themselves. They have admin-only configuration UI accessible through Settings only. They have no standalone Command Center tile. Equivalent to Odoo modules with `application: False`.

**Decision Rules (ALL must be true):**
- Has NO Command Center tile (`application: False`)
- Has admin configuration UI (accessible only through Settings — never as a primary nav app)
- Provides a shared service consumed by Layer 3 Business Apps (e.g., user identity, approval gates, mail servers, reports engine)
- CAN be installed or uninstalled by a tenant (unlike Layer 1)

**Current Layer 2 Modules:** `users`, `automation`, `approvals`, `system`, `inbox`, `portal`, `product`, `reports`, `shipping`

**Settings Sidebar:** Layer 2 modules MUST export a static `settingsMenu` array from their `config/menu.js`. This is the static injection pattern (see Rule 5H).

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

**Current Layer 4 Modules:** `whatsapp`, `amazon`, `soc`, `agents`, `ai_engine`, `payments`

---

### The One-Line Decision Test (for AI Agents)

Before classifying ANY module, answer these questions in order:

1. **Is it non-removable and has zero UI?** → Layer 1
2. **Is it `application: False` and has admin-only UI?** → Layer 2
3. **Is it `application: True` with a Command Center tile?** → Layer 3
4. **Does it primarily connect to an external third-party system?** → Layer 4

If none of these apply, the module is not yet properly defined — escalate to the user.

---

### Critical Constraints (NEVER violate these)

- A Layer 1 module MUST NEVER import from a Layer 2, 3, or 4 module.
- A Layer 2 module MUST NEVER import from a Layer 3 or 4 module.
- A Layer 3 module MUST NEVER import from a Layer 4 module.
- Dependency ALWAYS flows upward (higher layers depend on lower, never the reverse).
- The `SYSTEM_ARCHITECTURE_MAP.md` at the root of the project is the authoritative registry of which layer each module belongs to. Always consult it before making architectural decisions.

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
*   **The Standard Fix:** When writing a DRF ModelSerializer that processes FormData with nullable Foreign Keys, you must ALWAYS override the 	o_internal_value method. You must intercept the raw data and explicitly convert "" into Python None before DRF's internal validation begins.

## Rule 36. Global File Validation Standard

To protect the server from storage bloat and malicious file execution, all file uploads must be strictly governed at the database level. 
*   **CRITICAL INSTRUCTION FOR AI AGENTS:** You must never create a naked models.FileField or models.ImageField in this codebase.
*   **The Standard Fix:** Every file field must utilize the global validators located in pps.core.validators. 
    *   For standard documents, attach alidators=[validate_document_file]. 
    *   For images, attach alidators=[validate_image_file]. 
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
*   ✅ **CORRECT:** The frontend Settings page calls a dedicated API endpoint (`/api/v1/core/database/backup/`), which triggers a strictly isolated `DatabaseManagementService` located in `apps/core/services/` (Layer 1).

Always isolate execution logic into dedicated, single-responsibility services, and place infrastructure services in the `core` module.

## Rule 38. The Skyscraper Doctrine (Logical Multi-Tenancy vs. Database-per-Tenant)

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

## Rule 39. The Data Gravity Law (Domain Ownership of Services)

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
All global application middleware must live centrally in `apps/core/middleware/`. Furthermore, they must be separated by network protocol:
*   **WSGI / HTTP:** Standard request middlewares (Tenant routing, ThreadLocals) live in `apps/core/middleware/http.py`.
*   **ASGI / WebSockets:** Django Channels middlewares live in `apps/core/middleware/websockets.py`.
Never merge ASGI and WSGI middleware into the same file.

## Rule 43: ThreadLocal User Resolution (The Deep ORM Rule)
Because Django Models sit at the very bottom of the architecture, they inherently do not have access to the `request` object. **NEVER** pass the `request` object through layers of function arguments just to reach the database. 
Instead, if a Model or deep ORM interceptor needs to know the active user, you must retrieve it from the ThreadLocal memory by calling:
`from apps.core.middleware.http import get_current_request`

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
