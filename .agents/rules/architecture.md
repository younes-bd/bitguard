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
        if request and hasattr(request.user, 'tenant'):
            secure_filter = Q(tenant=request.user.tenant) | Q(tenant__isnull=True)
            self.fields['country'].queryset = Country.all_objects.filter(secure_filter)
```
