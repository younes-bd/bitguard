# Tier-1 ERP Architecture Map (BitGuard)

This document defines the strict architectural layers of the BitGuard ERP. It clarifies how modules are categorized, whether they render their own standalone Command Center Dashboards, and their purpose.

## The Prime Rule of APIs in a Headless ERP
**EVERY module that manages data exposes a REST API.**
There is no such thing as a "backend-only" module that hides its data from the frontend. If a module manages sequences, tenants, automation jobs, or users, it MUST expose an API so the React SPA can configure it. 

The distinction between architectural layers is **NOT** whether they expose an API. The distinction is whether they provide a **User-Facing Dashboard Workspace**.

---

## The Four Architectural Layers

### 1. The Kernel (Invisible Infrastructure)
The foundation of the ERP. It handles database multi-tenancy (`tenants`), background task scheduling (`automation`), and core utilities (`core`).
* **API Rule:** **DOES** expose REST APIs (e.g., `/api/v1/tenants/my-company` for changing the logo).
* **Dashboard Rule:** Does **NOT** have Command Center tiles.
* **Why:** These modules operate beneath the surface. The admin configures them via APIs embedded in global settings, but users do not "work" inside them.

### 2. Master Data (Hidden UI)
Foundational utilities shared by many different business apps (e.g., `users`, `notifications`, `product`, `system`).
* **API Rule:** **DOES** expose REST APIs.
* **Dashboard Rule:** Does **NOT** have standalone Command Center tiles.
* **Why:** The admin needs to manage users and settings (hence the API), but these tools are embedded inside Settings pages or dropdowns rather than getting their own primary workspace tile.

### 3. Business Plugins (The Apps)
The heavyweights. These are 100% strictly encapsulated business tools (`crm`, `hr`, `accounting`).
* **API Rule:** **DOES** expose REST APIs.
* **Dashboard Rule:** **DOES** have Command Center tiles.
* **Why:** These are the primary workspaces for end-users. They require both data transmission (API) and a dedicated frontend dashboard.

### 4. Integrations & Adapters
Bridges to external third-party systems (`payments`, `whatsapp`, `ai_agent`, `soc`).
* **API Rule:** **DOES** expose APIs (Webhooks + Utility endpoints).
* **Dashboard Rule:** **HYBRID**. Simple integrations (like `payments`) have no dashboard. Massive integrations (like `ai_agent` and `soc`) act as full workspaces and **DO** have Command Center Dashboards under the Administration pillar.

---

## Global Module Matrix

| Module | Layer / Category | Exposes Frontend API? | Has Command Center Tile? |
|---|---|---|---|
| **`core`** | Layer 1 (Kernel) | ✅ Yes (Sequences/Analytics) | ❌ No |
| **`tenants`** | Layer 1 (Kernel) | ✅ Yes (Company Logo/Name) | ❌ No |
| **`automation`** | Layer 1 (Kernel) | ✅ Yes (Job Config) | ❌ No |
| | | | |
| **`users`** | Layer 2 (Master Data) | ✅ Yes | ❌ No (Inside Settings) |
| **`system`** | Layer 2 (Master Data) | ✅ Yes | ❌ No (Inside Settings/Apps) |
| **`notifications`** | Layer 2 (Master Data) | ✅ Yes | ❌ No (Global Bell Icon) |
| **`product`** | Layer 2 (Master Data) | ✅ Yes | ❌ No (Used by Sales/Inventory) |
| | | | |
| **`crm`** | Layer 3 (Business App) | ✅ Yes | ✅ Yes (Sales Pillar) |
| **`accounting`** | Layer 3 (Business App) | ✅ Yes | ✅ Yes (Finance Pillar) |
| **`hr`** | Layer 3 (Business App) | ✅ Yes | ✅ Yes (HR Pillar) |
| *(All other 35+ Apps)* | Layer 3 (Business App) | ✅ Yes | ✅ Yes |
| | | | |
| **`whatsapp`** | Layer 4 (Integration) | ✅ Yes (Webhooks) | ❌ No |
| **`payments`** | Layer 4 (Integration) | ✅ Yes (Webhooks) | ❌ No |
| **`ai_agent`** | Layer 4 (Integration) | ✅ Yes | ✅ Yes (Administration Pillar) |
| **`soc`** | Layer 4 (Integration) | ✅ Yes | ✅ Yes (Administration Pillar) |

