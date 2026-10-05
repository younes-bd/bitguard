# BitGuard ERP — System Architecture Map

This document is a **human-readable view** of the BitGuard ERP module catalogue. The **single source of truth** for which layer each module belongs to is `.agents/rules/layer_registry.json` (Rule 65 in `architecture.md`). If this file and the registry disagree, the registry wins. The Quick Summary below is generated from the registry. The per-module detail sections are informational: manifest values such as `Is Application` may lag behind the registry until the manifests are migrated.

## Architectural Layers Defined (4-Layer Headless ERP Model)

This strict 4-Layer model governs how the Backend Data Plane interacts with the Frontend Control Plane, ensuring total MACH Tier-1 compliance.

### 1. Layer 1: Kernel & Infrastructure (Non-Optional Foundation)
*   **The Rule:** These are invisible, headless background engines (e.g., core, auth, tenants). They establish the database primitives, multi-tenancy bounds, and security rules. They are non-removable, and every other module depends on them.
*   **Manifest Setting:** 'application': False (Equivalent to Odoo's base module).
*   **Frontend Action:** Naturally ignored by the frontend useManifest parser. They have zero standalone UI and no dashboard tiles. 
*   **Sidebar Routing:** These modules do NOT inject into the Settings sidebar. Any core infrastructure configurations are hardcoded into the system app's base settings.

### 2. Layer 2: Platform Services (The Control Plane)
*   **The Rule:** Cross-cutting shared IT services (e.g., system, users, automation, shell). **Under the MACH standard, these are classified as full applications because they possess complex administrative UIs, but they are *infrastructure*, not primary business domains.** Therefore, they must NOT clutter the main dashboard grid.
*   **Manifest Setting:** 'application': True (Because they are factual UI applications).
*   **Frontend Action:** Forcefully hidden from the Command Center grid using the strict layout filter defined in **frontend/src/apps/shell/config/dashboard.js** (HIDDEN_DASHBOARD_TILES). They are accessed exclusively via top-bar navigation or the Waffle menu.
*   **Sidebar Routing (Static Explicit):** Because Platform Services often have deep, multi-link configuration menus, these modules MUST explicitly export a static settingsMenu array from their frontend **config/menu.js** file. The system module statically aggregates these.

### 3. Layer 3: Business Applications (The Data Plane)
*   **The Rule:** These are the primary, decoupled business domains (e.g., crm, sales, accounting, soc, agents). They are the lifeblood of the ERP and are the only modules that deserve massive, interactive tiles on the Command Center grid.
*   **Manifest Setting:** 'application': True
*   **Frontend Action:** Rendered normally on the Command Center grid.
*   **Sidebar Routing (Dynamic Payload):** To enforce strict MACH uniformity ('1 App = 1 Settings Page'), Layer 3 modules MUST NEVER export a static settingsMenu. Instead, their settings link is dynamically generated on the frontend by reading the has_settings: True flag directly from the InstalledModule backend database payload.

### 4. Layer 4: External Integrations (Third-Party Bridges)
*   **The Rule:** These are headless connectors bridging the ERP to outside SaaS platforms (e.g., amazon, ai_engine, shipping carriers, payment provider connectors). They act as background capability injectors for Layer 3 apps or run silently in the background via webhooks/crons.
*   **Manifest Setting:** 'application': False
*   **Frontend Action:** Naturally filtered out by the frontend dashboard parser, keeping the UI completely clean of external connector clutter.
*   **Sidebar Routing:** Any API key configuration required for these connectors is injected into the Layer 2 system app's generic Settings views, rather than spawning standalone UI pages.

---

## Quick Summary (Bird's-Eye View)

### Layer 1: Kernel
- `auth`, `core`, `tenants`

### Layer 2: Platform Services
- `apps`, `automation`, `inbox`, `payments`, `portal`, `product`, `reports`, `shell`, `system`, `users`

### Layer 3: Business Applications
- **Accounting**: `accounting`, `consolidation`, `documents`, `equity`, `esg`, `expenses`, `invoicing`, `sign`, `spreadsheet`
- **Administration**: `agents`, `soc`, `studio`
- **Discuss**: `discuss`, `messaging`, `voip`, `whatsapp`
- **Human Resources**: `employees`, `fleet`, `frontdesk`, `lunch`, `payroll`, `performance`, `recruiting`, `referrals`, `timeclock`, `timeoff`
- **Inventory**: `barcode`, `inventory`, `procurement`
- **Manufacturing**: `iot`, `maintenance`, `manufacturing`, `production`, `quality`, `repair`
- **Marketing**: `campaigns`, `events`, `journeys`, `sms`, `social`, `surveys`
- **Productivity**: `analytics`, `approvals`, `calendar`, `knowledge`, `tasks`
- **Sales**: `crm`, `pos`, `rental`, `sales`, `subscriptions`
- **Services**: `appointments`, `dispatch`, `helpdesk`, `planning`, `projects`, `timesheets`
- **Website**: `blog`, `ecommerce`, `forum`, `learning`, `website`

### Layer 4: External Integrations
- `ai_engine`, `amazon`, `shipping`

---

## Layer 1: Kernel (Non-Optional Foundation)

### Authentication (`auth`)
> Authentication primitives, JWT, login/logout engine.

- **Odoo App Category:** `Technical`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False`
- **Is Installable (App Store Enabled?):** `False (non-removable)`
- **Dependencies (Depends Array):** `tenants`
- **Frontend URL Routing:** Headless / No direct URL

### Core (`core`)
> The ERP kernel. Provides TenantAwareModel, BaseModel, InstalledModule, CommandCenterSection, SystemParameter, DatabaseBackup, ChatterMixin.

- **Odoo App Category:** `Technical`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False`
- **Is Installable (App Store Enabled?):** `False (non-removable)`
- **Dependencies (Depends Array):** `tenants, auth`
- **Frontend URL Routing:** Headless / No direct URL

### Multi-Tenancy (`tenants`)
> Absolute root. Multi-tenancy isolation engine, tenant model, and row-level security primitives.

- **Odoo App Category:** `Technical`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False`
- **Is Installable (App Store Enabled?):** `False (absolute root, non-removable)`
- **Dependencies (Depends Array):** `None (Absolute root)`
- **Frontend URL Routing:** Headless / No direct URL


## Layer 2: Platform Services (Shared Infrastructure with Admin UI)

### Automation (`automation`)
> Scheduled Actions, Automated Actions, and Webhooks engine. Background task execution and event-driven automation for all business apps.

- **Odoo App Category:** `Technical`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/settings/scheduled-actions` (Settings only)

### Inbox (`inbox`)
> Mail platform service. Manages Outgoing/Incoming Mail Servers, Email Templates, Mail Aliases. Odoo equivalent: `mail` + `fetchmail`.

- **Odoo App Category:** `Technical`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/settings/outgoing-mail` (Settings only)

### Portal (`portal`)
> Customer and vendor portal service. Self-service access layer for clients.

- **Odoo App Category:** `Technical`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/settings/portal` (Settings only)

### Product (`product`)
> Product master data service. Shared product catalog consumed by Sales, Inventory, Manufacturing, and Accounting.

- **Odoo App Category:** `Inventory`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** Used internally by Inventory and Sales apps.

### Reporting (`reports`)
> PDF report templates and print format engine. Shared reporting infrastructure consumed by all business apps.

- **Odoo App Category:** `Technical`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/settings/reports` (Settings only)

### Shell (`shell`)
> **The Visual Control Plane.** The global UI framework of the ERP. Houses the App Launcher (Command Center), Master Layouts (Sidebar, TopBar), and shared UI primitives (DataTables, Forms, Typography). Equivalent to Odoo `web`.

- **Odoo App Category:** `Technical`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False`
- **Is Installable (App Store Enabled?):** `False (non-removable, always present)`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** Global UI Wrappers

### Settings (`system`)
> **The IT Control Plane.** Global ERP settings, system parameters, audit logs, integration keys, backup management, and Module Registry UI. Equivalent to Odoo `base_setup`.

- **Odoo App Category:** `Administration`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False`
- **Is Installable (App Store Enabled?):** `False (non-removable, always present)`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/settings`


### Users (`users`)
> User management, roles, permissions, access rights, record rules, active sessions, and security policies. Platform-level IAM service.

- **Odoo App Category:** `Technical`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False`
- **Is Installable (App Store Enabled?):** `False (non-removable)`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/settings/users` (Settings only)


### Apps (`apps`)
> App Store and Module Installer. Manage installed modules per tenant.

- **Odoo App Category:** `Administration`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core, system`
- **Frontend URL Routing:** `/admin/apps`

### Payments (`payments`)
> Core payment gateway integration module. Connects to external payment providers (Stripe, PayPal, etc.).

- **Odoo App Category:** `Accounting`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `accounting`
- **Frontend URL Routing:** Headless / No direct URL

## Layer 3: Business Applications (Standalone Apps)

### Discuss (`discuss`)
> Internal messaging, group channels, and direct messaging.

- **Odoo App Category:** `Discuss`
- **Command Center Pillar:** `Productivity`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core, inbox`
- **Frontend URL Routing:** `/admin/discuss`

### VoIP (`voip`)
> VoIP calling integration.

- **Odoo App Category:** `Discuss`
- **Command Center Pillar:** `Productivity`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core, system`
- **Frontend URL Routing:** `/admin/voip`

### Accounting (`accounting`)
> Full-featured accounting with invoicing, payments, and financial reporting.

- **Odoo App Category:** `Accounting`
- **Command Center Pillar:** `Finance`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/accounting`

### Analytics (`analytics`)
> Executive dashboard with KPIs, metrics, and business intelligence. Odoo equivalent: `board`.

- **Odoo App Category:** `Productivity`
- **Command Center Pillar:** `Finance`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/analytics`

### Consolidation (`consolidation`)
> Multi-company financial consolidation.

- **Odoo App Category:** `Accounting`
- **Command Center Pillar:** `Finance`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core, system`
- **Frontend URL Routing:** `/admin/consolidation`

### Documents (`documents`)
> Document storage, sharing, versioning, and e-signature requests.

- **Odoo App Category:** `Documents`
- **Command Center Pillar:** `Finance`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/documents`

### ESG Reporting (`esg`)
> Track environmental, social, and governance metrics.

- **Odoo App Category:** `Accounting`
- **Command Center Pillar:** `Finance`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/esg`

### Equity (`equity`)
> Equity and cap table management.

- **Odoo App Category:** `Accounting`
- **Command Center Pillar:** `Finance`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/equity`

### Expenses (`expenses`)
> Submit and approve employee expense reports.

- **Odoo App Category:** `Human Resources`
- **Command Center Pillar:** `Finance`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system, employees, accounting`
- **Frontend URL Routing:** `/admin/expenses`

### Invoicing (`invoicing`)
> Standalone invoicing without full accounting suite.

- **Odoo App Category:** `Accounting`
- **Command Center Pillar:** `Finance`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core, system`
- **Frontend URL Routing:** `/admin/invoicing`

### Sign (`sign`)
> Send and sign documents electronically.

- **Odoo App Category:** `Sign`
- **Command Center Pillar:** `Finance`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/sign`

### Spreadsheet (`spreadsheet`)
> Integrated spreadsheet editor.

- **Odoo App Category:** `Accounting`
- **Command Center Pillar:** `Finance`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/spreadsheet`

### Employees (`employees`)
> Employee records, contracts, org chart, and HR management.

- **Odoo App Category:** `Human Resources`
- **Command Center Pillar:** `Human Resources`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/hr`

### Fleet (`fleet`)
> Fleet management, vehicle records, fuel logs, and contracts.

- **Odoo App Category:** `Fleet`
- **Command Center Pillar:** `Human Resources`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/fleet`

### Front Desk (`frontdesk`)
> Visitor and guest reception management. Check-in kiosk and visitor logging.

- **Odoo App Category:** `Human Resources`
- **Command Center Pillar:** `Human Resources`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system, employees`
- **Frontend URL Routing:** `/admin/frontdesk`

### Lunch (`lunch`)
> Employee lunch ordering and subsidy management.

- **Odoo App Category:** `Human Resources`
- **Command Center Pillar:** `Human Resources`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core, system`
- **Frontend URL Routing:** `/admin/lunch`

### Payroll (`payroll`)
> Process payroll, compute slips, and manage payroll batches.

- **Odoo App Category:** `Human Resources`
- **Command Center Pillar:** `Human Resources`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system, employees, accounting`
- **Frontend URL Routing:** `/admin/payroll`

### Appraisals (`performance`)
> Employee performance appraisals and 360-degree feedback.

- **Odoo App Category:** `Human Resources`
- **Command Center Pillar:** `Human Resources`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system, employees`
- **Frontend URL Routing:** `/admin/appraisals`

### Recruitment (`recruiting`)
> Post job positions, manage applicants, and run recruitment pipelines.

- **Odoo App Category:** `Human Resources`
- **Command Center Pillar:** `Human Resources`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system, employees`
- **Frontend URL Routing:** `/admin/recruitment`

### Referrals (`referrals`)
> Employee referral program management.

- **Odoo App Category:** `Human Resources`
- **Command Center Pillar:** `Human Resources`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core, recruiting`
- **Frontend URL Routing:** `/admin/referrals`

### Time Off (`timeoff`)
> Manage time-off requests, leave types, and allocation.

- **Odoo App Category:** `Human Resources`
- **Command Center Pillar:** `Human Resources`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system, employees`
- **Frontend URL Routing:** `/admin/time-off`

### Attendances (`timeclock`)
> Track employee attendance, check-ins, and working hours.

- **Odoo App Category:** `Human Resources`
- **Command Center Pillar:** `Human Resources`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system, employees`
- **Frontend URL Routing:** `/admin/hr-attendance`

### Barcode (`barcode`)
> Barcode scanning integration for inventory and manufacturing operations.

- **Odoo App Category:** `Inventory`
- **Command Center Pillar:** `Inventory & MRP`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core, system`
- **Frontend URL Routing:** `/admin/barcode`

### Inventory (`inventory`)
> Inventory management with warehouses, transfers, and inventory valuation.

- **Odoo App Category:** `Inventory`
- **Command Center Pillar:** `Inventory & MRP`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system, procurement`
- **Frontend URL Routing:** `/admin/stock`

### IoT (`iot`)
> Internet of Things device management and sensor integration.

- **Odoo App Category:** `IoT`
- **Command Center Pillar:** `Inventory & MRP`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core, system`
- **Frontend URL Routing:** `/admin/iot`

### Maintenance (`maintenance`)
> Preventive and corrective maintenance requests and scheduling.

- **Odoo App Category:** `Maintenance`
- **Command Center Pillar:** `Inventory & MRP`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/maintenance`

### Manufacturing (`manufacturing`)
> Manufacturing orders, bills of materials, and work center scheduling.

- **Odoo App Category:** `Manufacturing`
- **Command Center Pillar:** `Inventory & MRP`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system, inventory`
- **Frontend URL Routing:** `/admin/mrp`

### Purchase (`procurement`)
> Manage procurement orders, RFQs, and vendor bills.

- **Odoo App Category:** `Purchase`
- **Command Center Pillar:** `Inventory & MRP`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system, accounting`
- **Frontend URL Routing:** `/admin/purchase`

### Shop Floor (`production`)
> Manufacturing shop floor management and work order execution. Odoo equivalent: MRP Shop Floor.

- **Odoo App Category:** `Manufacturing`
- **Command Center Pillar:** `Inventory & MRP`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `manufacturing`
- **Frontend URL Routing:** `/admin/production`
- **Status:** Currently a stub — partial implementation.

### Quality (`quality`)
> Quality checks, control points, and failure analysis.

- **Odoo App Category:** `Quality`
- **Command Center Pillar:** `Inventory & MRP`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/quality-control`

### Repairs (`repair`)
> Repair orders, spare parts, and warranty tracking.

- **Odoo App Category:** `Repairs`
- **Command Center Pillar:** `Inventory & MRP`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core, system`
- **Frontend URL Routing:** `/admin/repair`

### Email Marketing (`campaigns`)
> Design and send mass email campaigns. Odoo equivalent: `mass_mailing`.

- **Odoo App Category:** `Email Marketing`
- **Command Center Pillar:** `Marketing`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core, inbox`
- **Frontend URL Routing:** `/admin/campaigns`

### Events (`events`)
> Event management, registrations, and ticketing.

- **Odoo App Category:** `Events`
- **Command Center Pillar:** `Marketing`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/events`

### Marketing (`journeys`)
> Email campaigns, automation journeys, analytics, and contact management.

- **Odoo App Category:** `Marketing`
- **Command Center Pillar:** `Marketing`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system, crm`
- **Frontend URL Routing:** `/admin/marketing`

### SMS Marketing (`sms`)
> Send targeted SMS campaigns.

- **Odoo App Category:** `SMS`
- **Command Center Pillar:** `Marketing`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `journeys`
- **Frontend URL Routing:** `/admin/sms`

### Social (`social`)
> Manage and schedule social media posts across platforms.

- **Odoo App Category:** `Marketing`
- **Command Center Pillar:** `Marketing`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/social`

### Surveys (`surveys`)
> Create and distribute surveys, collect responses, and analyze results.

- **Odoo App Category:** `Surveys`
- **Command Center Pillar:** `Marketing`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/surveys`

### To-Do / Tasks (`tasks`)
> Personal task management and to-do lists. Odoo equivalent: `note`.

- **Odoo App Category:** `Productivity`
- **Command Center Pillar:** `Services`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/tasks`
- **Status:** Currently a stub — partial implementation.

### CRM (`crm`)
> Track leads, opportunities, and sales pipeline.

- **Odoo App Category:** `CRM`
- **Command Center Pillar:** `Sales`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/crm`

### Point of Sale (`pos`)
> Point-of-sale system for retail stores and restaurants.

- **Odoo App Category:** `Point of Sale`
- **Command Center Pillar:** `Sales`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/pos`

### Rental (`rental`)
> Manage rental orders, availability, and return logistics.

- **Odoo App Category:** `Rental`
- **Command Center Pillar:** `Sales`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/rental`

### Sales (`sales`)
> Manage sales orders, quotations, and customer transactions.

- **Odoo App Category:** `Sales`
- **Command Center Pillar:** `Sales`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/sales`

### Subscriptions (`subscriptions`)
> Recurring billing, subscription products, and renewal management.

- **Odoo App Category:** `Sales`
- **Command Center Pillar:** `Sales`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system, accounting`
- **Frontend URL Routing:** `/admin/subscriptions`

### Appointments (`appointments`)
> Online booking, scheduling, and appointment management.

- **Odoo App Category:** `Appointments`
- **Command Center Pillar:** `Services`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/appointments`

### Calendar (`calendar`)
> Schedule meetings and events.

- **Odoo App Category:** `Productivity`
- **Command Center Pillar:** `Services`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/calendar`

### Field Service (`dispatch`)
> Schedule field workers, manage on-site tasks and dispatching.

- **Odoo App Category:** `Field Service`
- **Command Center Pillar:** `Services`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/field-service`

### Helpdesk (`helpdesk`)
> Customer support tickets with SLAs, teams, and escalation rules.

- **Odoo App Category:** `Helpdesk`
- **Command Center Pillar:** `Services`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/helpdesk`

### Planning (`planning`)
> Workforce planning, shift scheduling, and resource allocation.

- **Odoo App Category:** `Planning`
- **Command Center Pillar:** `Services`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system, projects, employees`
- **Frontend URL Routing:** `/admin/planning`

### Project (`projects`)
> Project management with tasks, milestones, Gantt, and Kanban.

- **Odoo App Category:** `Project`
- **Command Center Pillar:** `Services`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system, crm`
- **Frontend URL Routing:** `/admin/projects`

### Timesheets (`timesheets`)
> Track time spent on tasks and projects.

- **Odoo App Category:** `Timesheets`
- **Command Center Pillar:** `Services`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/timesheets`

### Studio (`studio`)
> Low-code customization studio for views, models, and workflows.

- **Odoo App Category:** `Customization`
- **Command Center Pillar:** `Customization`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core, system`
- **Frontend URL Routing:** `/admin/studio`

### Blog (`blog`)
> Publish and manage blog posts with tags and SEO optimization.

- **Odoo App Category:** `Website`
- **Command Center Pillar:** `Website`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system, website`
- **Frontend URL Routing:** `/admin/blog`

### eCommerce (`ecommerce`)
> Full e-commerce store with products, cart, checkout, and payments.

- **Odoo App Category:** `Website`
- **Command Center Pillar:** `Website`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system, website`
- **Frontend URL Routing:** `/admin/ecommerce`

### Forum (`forum`)
> Community forum with threads, votes, and moderation.

- **Odoo App Category:** `Website`
- **Command Center Pillar:** `Website`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core, system`
- **Frontend URL Routing:** `/admin/forum`

### Knowledge (`knowledge`)
> Centralized knowledge base and documentation.

- **Odoo App Category:** `Website`
- **Command Center Pillar:** `Website`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/knowledge`

### eLearning (`learning`)
> Online courses, slides, quizzes, and learning management.

- **Odoo App Category:** `eLearning`
- **Command Center Pillar:** `Website`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system, employees`
- **Frontend URL Routing:** `/admin/elearning`

### Website (`website`)
> Website builder with pages, SEO, forms, and live preview.

- **Odoo App Category:** `Website`
- **Command Center Pillar:** `Website`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/website`


### SOC (`soc`)
> Security operations center with alerts, incidents, and SIEM integration.

- **Odoo App Category:** `Productivity`
- **Command Center Pillar:** `Productivity`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/soc`

### AI Agents (`agents`)
> AI-powered virtual agents for automation and intelligent workflows. Odoo equivalent: `ai_agent`.

- **Odoo App Category:** `Productivity`
- **Command Center Pillar:** `Productivity`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core, system, automation`
- **Frontend URL Routing:** `/admin/agents`

### Approvals (`approvals`)
> Configurable approval workflow engine. Injects approval gates into HR, Finance, Procurement.

- **Odoo App Category:** `Technical`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/settings/approvals` (Settings only)

### Live Chat (`messaging`)
> Real-time website visitor chat. External live chat channel integration.

- **Odoo App Category:** `Discuss`
- **Command Center Pillar:** `Productivity`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core, inbox`
- **Frontend URL Routing:** `/admin/livechat`

### WhatsApp (`whatsapp`)
> Communicate with clients via WhatsApp Business API.

- **Odoo App Category:** `Discuss`
- **Command Center Pillar:** `Productivity`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `core, inbox`
- **Frontend URL Routing:** `/admin/whatsapp`

## Layer 4: External Integrations (Third-Party Connectors)

### Amazon (`amazon`)
> Amazon marketplace connector. Sync products, orders, and inventory with Amazon Seller Central.

- **Odoo App Category:** `Sales`
- **Command Center Pillar:** `Sales`
- **Is Application (Has Dashboard Tile?):** `True`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `sales, inventory`
- **Frontend URL Routing:** `/admin/amazon`

### AI Engine (`ai_engine`)
> Core AI model integration and inference engine.

- **Odoo App Category:** `Technical`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** Headless / No direct URL
- **Status:** Frontend-only stub — backend implementation is missing.

### Delivery (`shipping`)
> Delivery orders, shipping methods, and carrier integration. Backend-only service.

- **Odoo App Category:** `Inventory`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False`
- **Is Installable (App Store Enabled?):** `True`
- **Dependencies (Depends Array):** `inventory`
- **Frontend URL Routing:** Backend-only. No standalone frontend app. UI surfaced within `/admin/stock`.
