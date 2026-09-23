# Deep Tier-1 ERP Architecture Map (Odoo Standard)

This document provides a 100% exhaustive, deeply detailed audit of all modules in the BitGuard ERP system. It classifies every module based on its frontend requirements, installability, and exact Odoo-equivalent properties.

## Architectural Layers Defined

1. **Layer 1: Headless Kernel (OS)**: Invisible core routing, security, and multi-tenancy engines. `application: False`
2. **Layer 2: Hidden UI / Master Data**: Base data models (Users, Products) managed from within other apps. `application: False`
3. **Layer 3: Primary Business Apps**: Heavyweight domains with top-level Command Center tiles. `application: True`
4. **Layer 4: External Integrations**: API bridges to external platforms (Stripe, WhatsApp, etc.).

---

## ⚡ Quick Summary (Bird's-Eye View)
*A rapid lookup of all modules grouped by their Architectural Layer and Category.*

### Layer 1: Headless / Kernel
- **Technical**: `auth`, `automation`, `core`, `tenants`

### Layer 2: Hidden UI / Master Data
- **Technical**: `approvals`, `notifications`, `portal`, `reports`, `users`
- **Inventory**: `shipping`, `product`

### Layer 3: Primary Business Applications
- **Administration**: `apps`, `system`
- **Discuss**: `discuss`, `messaging`, `voip`
- **Finance**: `accounting`, `consolidation`, `board`, `documents`, `esg`, `equity`, `expenses`, `invoicing`, `sign`, `spreadsheet`
- **Human Resources**: `performance`, `timeclock`, `employees`, `fleet`, `lunch`, `payroll`, `recruiting`, `referrals`, `timeoff`
- **Inventory & MRP**: `barcode`, `inventory`, `iot`, `maintenance`, `manufacturing`, `mrp_plm`, `procurement`, `quality`, `repair`
- **Marketing**: `mass_mailing`, `events`, `journeys`, `sms`, `social`, `surveys`
- **Sales**: `crm`, `pos`, `rental`, `sales`, `subscriptions`
- **Services**: `appointments`, `calendar`, `dispatch`, `helpdesk`, `planning`, `projects`, `timesheets`
- **Technical**: `studio`
- **Website**: `blog`, `forum`, `knowledge`, `website`, `ecommerce`, `learning`

### Layer 4: External Integrations
- **Discuss**: `whatsapp`
- **Security**: `soc`
- **Technical**: `ai_agent`, `ai_engine`
- **Accounting**: `payments`

---

## 🔍 Exhaustive Module Details


## Layer 1: Headless / Kernel

### 📦 Authentication (`auth`)
> Module for Auth

- **Odoo App Category:** `Technical`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False ❌`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/auth`

### 📦 Automation (`automation`)
> Rules and automations engine

- **Odoo App Category:** `Technical`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False ❌`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `core, system`
- **Frontend URL Routing:** `/admin/automation`

### 📦 Core (`core`)
> Module for Core

- **Odoo App Category:** `Technical`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False ❌`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/core`

### 📦 Multi-Tenancy (`tenants`)
> Module for Tenants

- **Odoo App Category:** `Technical`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False ❌`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/tenants`


## Layer 2: Hidden UI / Master Data

### 📦 Approvals (`approvals`)
> Configurable approval workflows for any business process.

- **Odoo App Category:** `Technical`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False ❌`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/approvals`

### 📦 Delivery (`shipping`)
> Delivery orders, shipping methods, and carrier integration.

- **Odoo App Category:** `Inventory`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False ❌`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `inventory`
- **Frontend URL Routing:** `/admin/delivery`

### 📦 Notifications (`notifications`)
> Module for Notifications

- **Odoo App Category:** `Technical`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False ❌`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/notifications`

### 📦 Portal (`portal`)
> Customer and vendor portal for self-service access.

- **Odoo App Category:** `Technical`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False ❌`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/portal`

### 📦 Product (`product`)
> Manage product

- **Odoo App Category:** `Inventory`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False ❌`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/product`

### 📦 Reporting (`reports`)
> PDF report templates and print formats.

- **Odoo App Category:** `Technical`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False ❌`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/reporting`

### 📦 Users (`users`)
> User management, roles, permissions, and access control.

- **Odoo App Category:** `Technical`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False ❌`
- **Is Installable (App Store Enabled?):** `False ❌`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/users`


## Layer 3: Primary Business Applications

### 📦 Apps (`apps`)
> App Store and Module Installer

- **Odoo App Category:** `Administration`
- **Command Center Pillar:** `Administration`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/apps`

### 📦 Settings (`system`)
> System settings, configurations, and administration tools.

- **Odoo App Category:** `Administration`
- **Command Center Pillar:** `Administration`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `None`
- **Frontend URL Routing:** `/admin/settings`

### 📦 Discuss (`discuss`)
> Internal messaging, group channels, and direct messaging.

- **Odoo App Category:** `Discuss`
- **Command Center Pillar:** `Discuss`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/discuss`

### 📦 Live Chat (`messaging`)
> Engage with website visitors in real-time.

- **Odoo App Category:** `Discuss`
- **Command Center Pillar:** `Discuss`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/livechat`

### 📦 VoIP (`voip`)
> VoIP Module

- **Odoo App Category:** `Discuss`
- **Command Center Pillar:** `Discuss`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `core, system`
- **Frontend URL Routing:** `/admin/voip`

### 📦 Accounting (`accounting`)
> Full-featured accounting with invoicing, payments, and financial reporting.

- **Odoo App Category:** `Accounting`
- **Command Center Pillar:** `Finance`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/accounting`

### 📦 Consolidation (`consolidation`)
> Consolidation Module

- **Odoo App Category:** `Accounting`
- **Command Center Pillar:** `Finance`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `core, system`
- **Frontend URL Routing:** `/admin/consolidation`

### 📦 Dashboards (`board`)
> Executive dashboard with KPIs, metrics, and business intelligence.

- **Odoo App Category:** `Productivity`
- **Command Center Pillar:** `Finance`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/board/analytics`

### 📦 Documents (`documents`)
> Document storage, sharing, versioning, and e-signature requests.

- **Odoo App Category:** `Documents`
- **Command Center Pillar:** `Finance`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/documents`

### 📦 ESG Reporting (`esg`)
> Track environmental, social, and governance metrics.

- **Odoo App Category:** `Accounting`
- **Command Center Pillar:** `Finance`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/esg`

### 📦 Equity (`equity`)
> Equity and cap table management for startups.

- **Odoo App Category:** `Accounting`
- **Command Center Pillar:** `Finance`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/equity`

### 📦 Expenses (`expenses`)
> Submit and approve employee expense reports.

- **Odoo App Category:** `Human Resources`
- **Command Center Pillar:** `Finance`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system, employees, accounting`
- **Frontend URL Routing:** `/admin/expenses`

### 📦 Invoicing (`invoicing`)
> Invoicing Module

- **Odoo App Category:** `Accounting`
- **Command Center Pillar:** `Finance`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `core, system`
- **Frontend URL Routing:** `/admin/invoicing`

### 📦 Sign (`sign`)
> Send and sign documents electronically.

- **Odoo App Category:** `Sign`
- **Command Center Pillar:** `Finance`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/sign`

### 📦 Spreadsheet (`spreadsheet`)
> Integrated spreadsheet editor.

- **Odoo App Category:** `Accounting`
- **Command Center Pillar:** `Finance`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/spreadsheet`

### 📦 Appraisals (`performance`)
> Employee performance appraisals and 360-degree feedback.

- **Odoo App Category:** `Human Resources`
- **Command Center Pillar:** `Human Resources`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system, hr`
- **Frontend URL Routing:** `/admin/appraisals`

### 📦 Attendances (`timeclock`)
> Track employee attendance, check-ins, and working hours.

- **Odoo App Category:** `Human Resources`
- **Command Center Pillar:** `Human Resources`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system, hr`
- **Frontend URL Routing:** `/admin/hr-attendance`

### 📦 Employees (`employees`)
> Employee records, contracts, org chart, and HR management.

- **Odoo App Category:** `Human Resources`
- **Command Center Pillar:** `Human Resources`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/hr`

### 📦 Fleet (`fleet`)
> Fleet management, vehicle records, fuel logs, and contracts.

- **Odoo App Category:** `Fleet`
- **Command Center Pillar:** `Human Resources`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/fleet`

### 📦 Lunch (`lunch`)
> Lunch Module

- **Odoo App Category:** `Human Resources`
- **Command Center Pillar:** `Human Resources`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `core, system`
- **Frontend URL Routing:** `/admin/lunch`

### 📦 Payroll (`payroll`)
> Process payroll, compute slips, and manage payroll batches.

- **Odoo App Category:** `Human Resources`
- **Command Center Pillar:** `Human Resources`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system, employees, accounting`
- **Frontend URL Routing:** `/admin/payroll`

### 📦 Recruitment (`recruiting`)
> Post job positions, manage applicants, and run recruitment pipelines.

- **Odoo App Category:** `Human Resources`
- **Command Center Pillar:** `Human Resources`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system, hr`
- **Frontend URL Routing:** `/admin/recruitment`

### 📦 Referrals (`referrals`)
> Manage referrals

- **Odoo App Category:** `Human Resources`
- **Command Center Pillar:** `Human Resources`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/referrals`

### 📦 Time Off (`timeoff`)
> Manage time-off requests, leave types, and allocation.

- **Odoo App Category:** `Human Resources`
- **Command Center Pillar:** `Human Resources`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system, hr`
- **Frontend URL Routing:** `/admin/time-off`

### 📦 Barcode (`barcode`)
> Barcode Module

- **Odoo App Category:** `Inventory`
- **Command Center Pillar:** `Inventory & MRP`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `core, system`
- **Frontend URL Routing:** `/admin/barcode`

### 📦 Inventory (`inventory`)
> Inventory management with warehouses, transfers, and inventory valuation.

- **Odoo App Category:** `Inventory`
- **Command Center Pillar:** `Inventory & MRP`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system, purchase`
- **Frontend URL Routing:** `/admin/stock`

### 📦 IoT (`iot`)
> IoT Module

- **Odoo App Category:** `IoT`
- **Command Center Pillar:** `Inventory & MRP`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `core, system`
- **Frontend URL Routing:** `/admin/iot`

### 📦 Maintenance (`maintenance`)
> Preventive and corrective maintenance requests and scheduling.

- **Odoo App Category:** `Maintenance`
- **Command Center Pillar:** `Inventory & MRP`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/maintenance`

### 📦 Manufacturing (`manufacturing`)
> Manufacturing orders, bills of materials, and work center scheduling.

- **Odoo App Category:** `Manufacturing`
- **Command Center Pillar:** `Inventory & MRP`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system, stock`
- **Frontend URL Routing:** `/admin/mrp`

### 📦 PLM (`mrp_plm`)
> Product lifecycle management from concept to retirement.

- **Odoo App Category:** `Manufacturing`
- **Command Center Pillar:** `Inventory & MRP`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/mrp-plm`

### 📦 Purchase (`procurement`)
> Manage procurement orders, RFQs, and vendor bills.

- **Odoo App Category:** `Purchase`
- **Command Center Pillar:** `Inventory & MRP`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system, accounting`
- **Frontend URL Routing:** `/admin/purchase`

### 📦 Quality (`quality`)
> Quality checks, control points, and failure analysis.

- **Odoo App Category:** `Quality`
- **Command Center Pillar:** `Inventory & MRP`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/quality-control`

### 📦 Repairs (`repair`)
> Repairs Module

- **Odoo App Category:** `Repairs`
- **Command Center Pillar:** `Inventory & MRP`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `core, system`
- **Frontend URL Routing:** `/admin/repair`

### 📦 Email Marketing (`mass_mailing`)
> Design and send mass email campaigns.

- **Odoo App Category:** `Email Marketing`
- **Command Center Pillar:** `Marketing`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/mass_mailing`

### 📦 Events (`events`)
> Manage events

- **Odoo App Category:** `Events`
- **Command Center Pillar:** `Marketing`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/events`

### 📦 Marketing (`journeys`)
> Email campaigns, automation, analytics, and contact management.

- **Odoo App Category:** `Marketing`
- **Command Center Pillar:** `Marketing`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system, crm`
- **Frontend URL Routing:** `/admin/marketing`

### 📦 SMS Marketing (`sms`)
> Send SMS journeys campaigns.

- **Odoo App Category:** `SMS`
- **Command Center Pillar:** `Marketing`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `journeys`
- **Frontend URL Routing:** `/admin/sms`

### 📦 Social (`social`)
> Manage and schedule social media posts.

- **Odoo App Category:** `Marketing`
- **Command Center Pillar:** `Marketing`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/social`

### 📦 Surveys (`surveys`)
> Manage surveys

- **Odoo App Category:** `Surveys`
- **Command Center Pillar:** `Marketing`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/surveys`

### 📦 CRM (`crm`)
> Track leads, opportunities, and sales pipeline with a powerful CRM.

- **Odoo App Category:** `CRM`
- **Command Center Pillar:** `Sales`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/crm`

### 📦 Point of Sale (`pos`)
> Point-of-sale system for retail stores and restaurants.

- **Odoo App Category:** `Point of Sale`
- **Command Center Pillar:** `Sales`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/pos`

### 📦 Rental (`rental`)
> Manage rental orders, availability, and return logistics.

- **Odoo App Category:** `Rental`
- **Command Center Pillar:** `Sales`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/rental`

### 📦 Sales (`sales`)
> Manage sales orders, quotations, and customer transactions.

- **Odoo App Category:** `Sales`
- **Command Center Pillar:** `Sales`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/sales`

### 📦 Subscriptions (`subscriptions`)
> Recurring billing, subscription products, and renewal management.

- **Odoo App Category:** `Sales`
- **Command Center Pillar:** `Sales`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system, accounting`
- **Frontend URL Routing:** `/admin/subscriptions`

### 📦 Appointments (`appointments`)
> Online booking, scheduling, and appointment management.

- **Odoo App Category:** `Appointments`
- **Command Center Pillar:** `Services`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/appointments`

### 📦 Calendar (`calendar`)
> Schedule meetings and events.

- **Odoo App Category:** `Productivity`
- **Command Center Pillar:** `Services`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/calendar`

### 📦 Field Service (`dispatch`)
> Schedule field workers, manage on-site tasks and dispatching.

- **Odoo App Category:** `Field Service`
- **Command Center Pillar:** `Services`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/field-service`

### 📦 Helpdesk (`helpdesk`)
> Customer support tickets with SLAs, teams, and escalation rules.

- **Odoo App Category:** `Helpdesk`
- **Command Center Pillar:** `Services`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/helpdesk`

### 📦 Planning (`planning`)
> Workforce planning, shift scheduling, and resource allocation.

- **Odoo App Category:** `Planning`
- **Command Center Pillar:** `Services`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system, projects, hr`
- **Frontend URL Routing:** `/admin/planning`

### 📦 Project (`projects`)
> Project management with tasks, milestones, Gantt, and Kanban.

- **Odoo App Category:** `Project`
- **Command Center Pillar:** `Services`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system, crm`
- **Frontend URL Routing:** `/admin/projects`

### 📦 Timesheets (`timesheets`)
> Track time spent on tasks and projects.

- **Odoo App Category:** `Timesheets`
- **Command Center Pillar:** `Services`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/timesheets`

### 📦 Studio (`studio`)
> Studio Module

- **Odoo App Category:** `Technical`
- **Command Center Pillar:** `Technical`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `core, system`
- **Frontend URL Routing:** `/admin/studio`

### 📦 Blog (`blog`)
> Publish and manage blog posts with tags and SEO optimization.

- **Odoo App Category:** `Website`
- **Command Center Pillar:** `Website`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/blog`

### 📦 Forum (`forum`)
> Forum Module

- **Odoo App Category:** `Website`
- **Command Center Pillar:** `Website`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `core, system`
- **Frontend URL Routing:** `/admin/forum`

### 📦 Knowledge (`knowledge`)
> Centralized knowledge base and documentation.

- **Odoo App Category:** `Website`
- **Command Center Pillar:** `Website`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/knowledge`

### 📦 Website (`website`)
> Website builder with pages, SEO, forms, and live preview.

- **Odoo App Category:** `Website`
- **Command Center Pillar:** `Website`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/website`

### 📦 eCommerce (`ecommerce`)
> Full e-commerce store with products, cart, checkout, and payments.

- **Odoo App Category:** `Website`
- **Command Center Pillar:** `Website`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/ecommerce`

### 📦 eLearning (`learning`)
> Online courses, slides, quizzes, and learning management.

- **Odoo App Category:** `eLearning`
- **Command Center Pillar:** `Website`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system, hr`
- **Frontend URL Routing:** `/admin/elearning`


## Layer 4: External Integrations

### 📦 WhatsApp (`whatsapp`)
> Communicate with clients via WhatsApp.

- **Odoo App Category:** `Discuss`
- **Command Center Pillar:** `Discuss`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `core`
- **Frontend URL Routing:** `/admin/whatsapp`

### 📦 SOC (`soc`)
> Security operations center with alerts, incidents, and SIEM.

- **Odoo App Category:** `Security`
- **Command Center Pillar:** `Security`
- **Is Application (Has Dashboard Tile?):** `True ✅`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `/admin/soc`

### 📦 AI Agent (`ai_agent`)
> AI-powered assistant for automation and intelligent workflows.

- **Odoo App Category:** `Technical`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False ❌`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `core, system, automation`
- **Frontend URL Routing:** `/admin/settings/virtual-agents`

### 📦 AI Engine (`ai_engine`)
> Core integration module for Ai Engine.

- **Odoo App Category:** `Technical`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False ❌`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `Headless / No direct URL`

### 📦 Payments (`payments`)
> Core integration module for Payments.

- **Odoo App Category:** `Accounting`
- **Command Center Pillar:** `N/A`
- **Is Application (Has Dashboard Tile?):** `False ❌`
- **Is Installable (App Store Enabled?):** `True ✅`
- **Dependencies (Depends Array):** `system`
- **Frontend URL Routing:** `Headless / No direct URL`

