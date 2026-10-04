# Settings Module — Deep Audit, Odoo 17 Alignment Plan & Builder Prompt

> Nothing was modified during this audit. Everything below was verified by reading the code.

## 0. Corrections to my earlier work (please read first)

Three things I did earlier were wrong, and they are part of why the module is still broken.

| # | What I did | Why it is wrong |
|---|-----------|-----------------|
| C1 | Created `core/management/commands/restore_layer3_settings.py` with a hardcoded app list and `settings_url=/admin/{app}/settings` | Routes are `/admin/settings/{x}`. The list contains non-existent apps (`hr`, `marketing`). The **manifests already declare** `has_settings` and `settings_url`; `sync_modules` simply never reads them. The command must be **deleted**, and `sync_modules` fixed instead. |
| C2 | Collapsed the old sections into "Advanced Administration" and **removed** Financial, Currencies, Sequences, Companies, Server Logs and Translations Import/Export from `baseSettings` | Those pages still have routes but are now **unreachable from navigation** (orphaned UI). |
| C3 | Ran `sed s/Reports/Advanced Administration/` on `reports/config/menu.js` | The *label* of the Reports item became "Advanced Administration". |

---

## 1. Audit report

### 1.1 Why "Layer 3 / App Settings" is empty (root cause, verified)

77 backend manifests exist. Only **13** declare `has_settings: True`, and **46** frontend apps ship a `routes/settingsRoutes.jsx`. The data chain is broken in three places:

1. `core/services/modules.py::sync_modules` copies ~15 manifest keys into `InstalledModule` but **never copies `has_settings` / `settings_url`**. The DB flag is therefore always `False`.
2. Where manifests do declare a URL, it disagrees with the real route:

   | App | Manifest `settings_url` | Actual frontend route |
   |-----|------------------------|-----------------------|
   | inventory | `/admin/settings/stock` | `inventory` |
   | manufacturing | `/admin/settings/mrp` | `manufacturing` |
   | sales | `/admin/settings/sale` | `sales` |
   | pos / website / whatsapp / crm | match | OK |

3. `system/config/menu.js` filters on `application === true`; `payments` has `has_settings: True` but `application: False`, so it is silently dropped. About 33 apps have a settings route but `has_settings: False`, so they will never appear.

### 1.2 Sidebar and navigation defects

| ID | Defect | Location |
|----|--------|----------|
| N1 | Menu item `/admin/settings/logs` has **no route** (routes are `system-events`, `server-logs`) → 404 | `system/config/menu.js` |
| N2 | `inbox` exports **both** `getSettingsMenu` (paths `outgoing-mail-servers`, `incoming-mail-servers`, `mail-aliases` – none routed) and `settingsMenu`. The aggregator takes one and ignores the other: dead duplicate code. Same in `automation`. | `inbox/config/menu.js`, `automation/config/menu.js` |
| N3 | `reports` menu points to `report-tags` and `print-formats`, which have **no routes** → 404 | `reports/config/menu.js` |
| N4 | Sections are matched on three different keys (`section`, `title`, `pluginItem.title`); `getSettingsMenu`-style entries (`title` + `items`) never merge into existing sections, so they create duplicate sections | `system/config/menu.js` L59 |
| N5 | `Sidebar.jsx` initialises open/closed state **once** from the first render. Sections that appear later (App Settings after the manifest loads) have `undefined` state → render collapsed | `shell/components/layout/Sidebar.jsx` L87-98 |
| N6 | No settings search box, no per-item `permissions`/dev-mode filtering (items carry a `permissions` field that nothing reads) | Sidebar / ModuleLayout |
| N7 | `export const settingsMenu = getSettingsMenu()` is evaluated at import time with no manifest, creating a stale, empty-Layer-3 export | `system/config/menu.js` L130 |
| N8 | Icons resolved with `import * as LucideIcons` defeat tree-shaking (large bundle) | `system/config/menu.js` L1 |

### 1.3 Routing defects

| ID | Defect |
|----|--------|
| R1 | `settingsAdminRoutes.jsx` **statically imports pages from other apps** (`users`, `inbox`, `discuss`, `portal`, `automation`). The kernel UI must not know business apps (Rules 9 and 12). |
| R2 | The same paths are registered **twice**: `users`, `groups`, `access-rights`, `record-rules`, `active-sessions`, `webhooks` exist both statically and in each app's `settingsRoutes.jsx`. First match wins, so the plugin copy is dead. |
| R3 | `virtual-agents` is registered by **both** `agents` and `ai_engine`. |
| R4 | `profile` redirect and `system-events` / `server-logs` / `logs` naming is inconsistent (Rule 40 Lexical Symmetry). |
| R5 | Plugin route files export a single element in some apps and an array in others. Inconsistent contract. |
| R6 | Route slugs are not derived from the manifest (`stock`/`inventory`, `mrp`/`manufacturing`, `sale`/`sales`). |

### 1.4 Settings pages: duplicates, mock data, naming

| ID | Finding |
|----|---------|
| P1 | `shell/components/ui/ModuleSettings.jsx` is a **mock**: hardcoded state and `await new Promise(r => setTimeout(r, 600))` simulating a save. Must be deleted or replaced. |
| P2 | **Key-naming mismatch (real bug):** `seed_settings.py` seeds `crm.lead_scoring`, `sales.quotation_validity_days`, etc. (dot notation). `CrmSettingsPage` reads `crm_lead_scoring`, `crm_auto_assign` (underscore). The toggles can never reflect the seeded values. Violates Rule 40. |
| P3 | Setting rows are **hardcoded inside each page** (labels, keys, descriptions) and the same ~88-line Card/Switch/SettingRow boilerplate is copy-pasted per app (`CrmSettingsPage`, `SalesSettingsPage`, `AccountingSettingsPage` ...). There is no schema-driven renderer. |
| P4 | `useSettings` downloads **all** parameters (`core/parameters/`) and ignores its `prefix` argument; `console.error` left in. Writes use `batch_update` per single key. |
| P5 | `GeneralSettingsPage.jsx` is a ~640-line monolith: company form, backups, prune logs, cache clear, dev mode, multi-company. It duplicates the Backups page and mixes concerns. |
| P6 | Duplicate settings pages per app (verify which one is routed, delete the rest): `manufacturing` (features + settings), `payroll` ×2, `performance` ×2, `learning` ×3 (incl. `learning/elearning`), `campaigns` ×2, `website` (Cms + Website), `helpdesk` (Support + Helpdesk), `crm` (CrmSettings, CrmSettings_new, PipelineSettings), `ecommerce` (Store + Shipping). |
| P7 | `GeneralSettingsPage` still hardcodes the Multi-Company, Developer Tools and Retention blocks; "Developer Mode" lives in `localStorage` with no context. |
| P8 | Folder naming is inconsistent across apps (`lists/`, `features/`, `settings/`, `admin/`, `config/`). |

### 1.5 Backend defects

| ID | Finding |
|----|---------|
| B1 | `sync_modules` ignores `has_settings`, `settings_url`, `settings_desc` (see 1.1). Two sync implementations exist (`core/services/modules.py` and `system/management/commands/sync_modules.py`). |
| B2 | `core/services/modules.py` swallows errors with `print()` and bare `except Exception: pass`. Violates the "never crash silently" rule. |
| B3 | `SystemParameter` has no registry of **known settings** (key, type, default, group, label, help, app). Frontend therefore hardcodes everything. Odoo uses `res.config.settings` fields; we need an equivalent declarative **settings schema** served by the API. |
| B4 | `seed_settings.py` writes with `tenant=None` (global) while the rule requires tenant filtering. |
| B5 | No Country / State / UoM / UoM-Category UI, although the ViewSets exist (`core/api/urls.py`). Functional gap vs Odoo "Contacts → Localization". |
| B6 | `settingsService.js` points at `system/email-config/` and `system/integration-keys/`; email servers also exist in `inbox`. Two sources of truth for mail servers. |
| B7 | `has_settings` must be re-evaluated on every sync, not only on creation. |

### 1.6 Orphans and clutter (No-Clutter Law / No-Dead-Code)

**Delete candidates (verified to exist; confirm with `git grep` first):**

- `backend/apps/core/domain/models.py.new`, `models_bak.py`; `crm`, `ecommerce`, `projects` → `domain/models_bak.py`
- `backend/apps/core/management/commands/`: `test_500.py`, `test_api_command.py`, `test_cron.py`, `test_patch.py`, `test_scheduled_action_client.py`, `test_states.py`, `debug_action_run.py`, `debug_scheduled_action.py`, `show_action_errors.py` (scratch scripts in a production command folder), and my `restore_layer3_settings.py`
- `backend/apps/system/management/commands/patch_edms_db.py`, `patch_store_db.py` (one-off patches)
- `backend/apps/system/locales/` has three French files: `fr.json`, `fr-FR.json`, `fr_FR.json` – keep one canonical (`fr.json`)
- Frontend: `crm/pages/settings/CrmSettings_newPage.jsx`, `accounting/pages/lists/BankReconciliationList_newPage.jsx`, and **15 `.bak` files** (`accounting`, `appointments`, `approvals`, `auth`, `ecommerce`, `planning`, `sales`)
- `frontend/src/apps/shell/components/ui/ModuleSettings.jsx` (mock)

### 1.7 Odoo 17 feature gap

| Odoo 17 | BitGuard today |
|---------|----------------|
| Settings sidebar = *General Settings* + one entry per **installed** app that has settings, with search box | Static list; app entries absent (1.1) |
| Navbar menus: **Users & Companies**, **Translations**, **Technical** (dev-mode only) | Everything crammed into the sidebar |
| General Settings blocks: Users (counts + Invite), Languages, Companies, Business Documents (layout, templates), Contacts, Integrations, Developer Tools (activate dev mode / neutralize), **About** (version, license) | Partial: company form, dev toggle, backups |
| Technical → Database Structure, User Interface, Email, Automation, Parameters, Security, Reporting, Sequences & Identifiers | Pages exist but are unreachable or mis-grouped |
| Contacts → Localization (Countries, States, Currencies) | Currencies page orphaned; Countries/States UI missing |
| Per-app settings = declarative blocks of fields with a Save / Discard bar | Hardcoded toggles, instant-save, no discard |

---

## 2. Target architecture (Odoo 17 aligned, MACH compliant)

### 2.1 Settings shell

```
┌ Top bar (ModuleTopBar) ───────────────────────────────────────────────┐
│ Settings   Users & Companies ▾   Translations ▾   Technical ▾ (dev)   │
└───────────────────────────────────────────────────────────────────────┘
┌ Sidebar ─────────────┐
│ [ Search settings… ] │
│  General Settings    │   ← always
│  ───── Apps ─────    │   ← one entry per INSTALLED app with has_settings
│  CRM                 │
│  Sales               │   (ordered by settings_sequence)
│  Accounting …        │
└──────────────────────┘
```

**Top-bar menus (all registry-driven):**

| Menu | Items |
|------|-------|
| Users & Companies | Users, Groups, Companies |
| Translations | Languages, Import Translations, Export Translations, Translated Terms |
| Technical (dev-mode only) | **Automation** (Automated Actions, Scheduled Actions, Webhooks) · **Database** (Backups, System Events, Server Logs) · **Email** (Outgoing, Incoming, Templates, Aliases, Channels) · **Parameters** (System Parameters) · **Security** (Access Rights, Record Rules, Security Policy, Active Sessions, Integration Keys) · **User Interface** (Menu Sequences, Document Layouts) · **Reporting** (Reports, Print Formats) · **Sequences & Identifiers** (Sequences) · **Localization** (Currencies, Countries, States, Units of Measure) |

Personal Access Tokens move to **My Profile → Account Security** (Odoo "API Keys").

### 2.2 The 3-tier registry contract (Rule 50, tightened)

Each frontend app exposes **one** file, `config/settingsManifest.js`, replacing `settingsMenu`, `getSettingsMenu` and `generalSettingsCards`:

```js
export default {
  // Layer 2 – kernel/platform items injected into a top-bar menu
  topMenu: [
    { menu: 'technical', group: 'Automation', label: 'Webhooks',
      icon: 'Webhook', path: 'webhooks', devOnly: true, permission: 'automation.view_webhook' },
  ],
  // Layer 3 – app settings page (sidebar entry is derived from the DB manifest)
  appSettings: { path: 'crm', schemaKey: 'crm' },
  // General Settings page cards
  generalCards: [ { block: 'Business Documents', label: '…', icon: 'FileText', path: 'email-templates' } ],
};
```

Rules: icon is a **string** resolved through one shared `iconRegistry` (explicit named imports, tree-shakeable); path is **relative to `/admin/settings/`**; one `routes/settingsRoutes.jsx` per app always exports an **array** of keyed `<Route>`s; `system` never imports another app's page.

### 2.3 Backend contract

- **Manifest = single source of truth.** Add and enforce keys: `has_settings`, `settings_slug` (route slug, = frontend route), `settings_url` (computed: `/admin/settings/{settings_slug}`), `settings_sequence`.
- `sync_modules` copies those keys on **every** run; exactly one implementation in `core/services/modules.py`; the management command only calls it.
- **Declarative settings schema:** each app ships `backend/apps/<app>/settings_schema.py` registered via `apps.core.registry.register_settings(...)` with `{key, type, default, label, help, group, scope('tenant'|'company'|'user'), depends_on, choices}`.
- New endpoints under `core`: `GET core/settings-schema/?app=crm`, `GET core/parameters/?prefix=crm.`, `POST core/parameters/batch_update/` (validates against schema, tenant-scoped, writes `SystemEventLog`).
- Canonical key format: `<app>.<snake_case_name>` everywhere.
- Add Country/State/UoM permissions + tests.

### 2.4 Frontend contract

- `SettingsRenderer` (shared, in `system/components/settings/`) renders blocks from schema (toggle / select / number / text / currency / many2one) with **dirty tracking, Save + Discard bar** and toast feedback.
- Every `*SettingsPage.jsx` becomes a ~10-line wrapper: `<SettingsRenderer schemaKey="crm" />`.
- `DeveloperModeContext` replaces the raw `localStorage` toggle.
- `useSettings(prefix)` fetches only `?prefix=` and uses `Promise.allSettled` per the testing rules.

---

## 3. Implementation plan (phased, each phase independently shippable)

Work on branch `feature/settings-odoo17-alignment`. Commit per phase using Conventional Commits.

### Phase 0 — Clean-up (no behaviour change)
1. Delete every file in section 1.6 (after `git grep` confirms no import).
2. Revert regressions C1–C3.
3. Verify which duplicate settings page per app is routed; delete the rest.
4. Commit: `chore(settings): remove orphaned, backup and scratch files`.

### Phase 1 — Backend manifest pipeline
1. Fix `sync_modules` to copy `has_settings`, `settings_slug`, `settings_url`, `settings_sequence`, `settings_desc`; remove silent `except/print`, use `logger`.
2. Collapse the two sync implementations into one.
3. Update the 77 manifests: `has_settings: True` for every app with a frontend settings page (46 candidates), `settings_slug` = real route slug (fix `stock→inventory`, `mrp→manufacturing`, `sale→sales`).
4. Management command `audit_settings_manifests` (read-only) that fails if a manifest slug has no matching frontend route (CI guard).
5. Serializer exposes `has_settings`, `settings_url`, `settings_sequence`.
6. Tests: `test_modules_sync.py` (flags copied, idempotent) and a tenant-isolation negative test (Tenant A cannot read Tenant B modules).

### Phase 2 — Settings schema service
1. `core/services/settings_registry.py` + `register_settings()` in `core/registry.py`.
2. `settings_schema.py` for crm, sales, accounting, inventory, manufacturing, pos, website, whatsapp, payments, then the remaining apps.
3. Endpoints `settings-schema`, prefix filter, validated `batch_update` (tenant-scoped, `RecordRule` aware).
4. Management command `migrate_setting_keys` converting `crm_lead_scoring` → `crm.lead_scoring` etc. (fixes P2).
5. Tests for service-level validation, type coercion, tenant isolation.

### Phase 3 — Frontend registry & navigation
1. Create `iconRegistry.js`; replace `import * as LucideIcons`.
2. Add `config/settingsManifest.js` to every contributing app; delete `settingsMenu` / `getSettingsMenu` / `generalSettingsCards` exports.
3. Rewrite `system/config/menu.js` as a thin aggregator producing `{ topMenus, sidebarSections }`; remove the eager `settingsMenu` export (N7).
4. Rewrite `settingsAdminRoutes.jsx` to contain only kernel routes; remove all cross-app imports and duplicate paths (R1–R3); resolve the `virtual-agents` clash.
5. Fix `Sidebar.jsx` section state to react to new sections (N5); add search and permission/dev-mode filtering.
6. Add the Settings top bar with Users & Companies / Translations / Technical menus.
7. Restore every orphaned page into the new menus (C2): Financial, Currencies, Sequences, Companies, Server Logs, Translations Import/Export.
8. Fix all 404 targets (N1, N3); build `report-tags` / `print-formats` pages or remove the links.
9. Frontend tests (Vitest + RTL, `apiClient` mocked): sidebar shows only installed apps with `has_settings`; dev-only items hidden unless dev mode; a static test asserts every menu path has a route.

### Phase 4 — Schema-driven app settings pages
1. Build `SettingsRenderer`, field components, dirty-state bar (Save/Discard), `useSettings(prefix)`.
2. Convert all `*SettingsPage.jsx` to the 10-line wrapper; delete the copy-pasted boilerplate.
3. Delete the `ModuleSettings.jsx` mock.

### Phase 5 — General Settings page (Odoo 17 blocks)
Split the monolith into blocks fed by `generalCards`: **Users** (active count, Manage Users, Invite), **Languages**, **Companies** (company form, multi-company), **Business Documents**, **Contacts/Localization**, **Integrations**, **Developer Tools** (dev mode via context, neutralize DB), **About** (version, license, tenant). Move backup/prune/cache actions to the Backups and System Events pages. Add a settings search that scrolls to and highlights a block.

### Phase 6 — Feature gaps
Countries, States, Units of Measure (+ categories), Translated Terms editor, Content Types, Command Center Sections admin, Mail Aliases. Each needs a service in `core/api/` (Rule 45), a page in `system/pages/`, a route, a manifest entry and a backend permission test.

### Phase 7 — Hardening & docs
CI checks: "every menu path has a route", "no `.bak`/`_new` files", "no cross-app imports from `system`". Update `architecture.md` Rule 50 with the manifest contract.

---

## 4. Rule Validation Matrix

| Check | Verdict | Note |
|-------|---------|------|
| MACH (headless, registry, no UI coupling) | PASS | Navigation derived from backend manifests + per-app frontend manifests. |
| Rule 9 / 39 (kernel boundaries, data gravity) | PASS | Kernel models (`Currency`, `Country`, `Language`, `SystemParameter`) keep their UI in `system`; `system` stops importing business pages. |
| Rule 40 (lexical symmetry) | PASS after P2 fix | `<app>.<snake_name>` keys; route slug = manifest `settings_slug`. |
| Rule 12 / 20 (soft deps, registries) | PASS | `import.meta.glob` + `register_settings`; no hard imports. |
| Rule 45 (service domain) | PASS | Core resources keep their service under the domain matching the backend app. |
| No-Clutter Law | PASS | No temp scripts in project roots; `audit_settings_manifests` is a permanent Django command. |
| Multi-tenancy | PASS | Parameters scoped by tenant; negative tests required. |

---

## 5. Prompt for your AI website builder

```text
ROLE
You are a senior full-stack engineer working on BitGuard, a MACH-compliant (Microservices, API-first, Cloud-native, Headless) multi-tenant ERP. Stack: Django + DRF + SimpleJWT + PostgreSQL backend; React 18 + Vite + Tailwind + React Router v6 + lucide-react + react-hot-toast frontend. HTTP only through frontend/src/core/api/client.js. Dark mode only (bg-slate-950 app, bg-slate-900 cards, border-slate-800, primary bg-blue-600). Follow every rule in .agents/rules/*.md (architecture, database_schema, design_system, stack, testing, workflow). Every business model inherits TenantAwareModel and every query filters by tenant.

GOAL
Refactor the Settings module (frontend/src/apps/system + per-app settings, and backend core/system) so it behaves exactly like Odoo 17's Settings app, is fully functional, has no mock/hardcoded data, no orphaned or duplicate files, and respects the 3-tier settings architecture (Rule 50). Work on branch feature/settings-odoo17-alignment, one Conventional Commit per phase. Do NOT write throw-away scripts in backend/, frontend/ or the repo root; use .scratch/ or Django management commands. No console.log/print/debugger, no commented-out code, no unused imports.

BEFORE CODING
Output a "Rule Validation Matrix" (MACH, Rule 9 vs 39, Rule 40, Rules 12/20, Rule 4, Rule 45) for each phase.

PHASE 0 - CLEAN-UP
Delete after confirming with git grep that nothing imports them:
- backend/apps/core/domain/models.py.new, models_bak.py; backend/apps/{crm,ecommerce,projects}/domain/models_bak.py
- backend/apps/core/management/commands/{test_500,test_api_command,test_cron,test_patch,test_scheduled_action_client,test_states,debug_action_run,debug_scheduled_action,show_action_errors,restore_layer3_settings}.py
- backend/apps/system/management/commands/{patch_edms_db,patch_store_db}.py
- backend/apps/system/locales: keep fr.json only
- frontend: every *.bak file; crm/pages/settings/CrmSettings_newPage.jsx; accounting/pages/lists/BankReconciliationList_newPage.jsx; shell/components/ui/ModuleSettings.jsx
- For apps with several settings pages (manufacturing, payroll, performance, learning, campaigns, website, helpdesk, crm, ecommerce) keep only the one referenced by routes/settingsRoutes.jsx.
- Restore the label of the Reports item in reports/config/menu.js ("Reports").

PHASE 1 - BACKEND MANIFEST PIPELINE
1. In backend/apps/core/services/modules.py::sync_modules, copy from every __manifest__.py: has_settings, settings_slug, settings_url (compute as /admin/settings/<settings_slug>), settings_sequence, settings_desc onto InstalledModule on EVERY sync (not only on create). Add settings_slug and settings_sequence fields + migration. Replace print()/bare except with logger.exception. Keep ONE implementation; the system sync_modules command must only call it.
2. Update all 77 manifests: has_settings=True for each app that has frontend/src/apps/<app>/routes/settingsRoutes.jsx; settings_slug = the real route slug (fix inventory: stock->inventory, manufacturing: mrp->manufacturing, sales: sale->sales). payments must be listed even though application=False (the sidebar must not filter on `application`).
3. Add management command audit_settings_manifests that exits non-zero when a manifest settings_slug has no matching frontend route.
4. Expose the new fields in InstalledModuleSerializer.
5. Tests: sync copies flags and is idempotent; Tenant A cannot list/modify Tenant B modules.

PHASE 2 - SETTINGS SCHEMA SERVICE
1. Create core/services/settings_registry.py and register_settings() in core/registry.py. Each app declares backend/apps/<app>/settings_schema.py with entries {key, type(boolean|string|integer|decimal|select|many2one), default, label, help, group, scope(tenant|company|user), choices, depends_on}.
2. Canonical key format is <app>.<snake_case_name>. Write migrate_setting_keys (management command) converting legacy keys such as crm_lead_scoring -> crm.lead_scoring and fix seed_settings.py to write tenant-scoped rows (never tenant=None for business settings).
3. Endpoints under core: GET settings-schema/?app=, GET parameters/?prefix=, POST parameters/batch_update/ (validates against schema, tenant-scoped, RecordRule-aware, writes SystemEventLog). Standard JSON errors (400/401/403/404).
4. Provide schemas for crm, sales, accounting, inventory, manufacturing, pos, website, whatsapp, payments first, then all remaining apps with settings pages.
5. Service-level unit tests + multi-tenancy negative tests (factory_boy).

PHASE 3 - FRONTEND REGISTRY AND NAVIGATION
1. Create frontend/src/core/ui/iconRegistry.js with explicit named lucide-react imports; resolve string icon names through it. Remove `import * as LucideIcons`.
2. Each contributing app gets config/settingsManifest.js (default export: { topMenu:[{menu,group,label,icon,path,devOnly,permission}], appSettings:{path,schemaKey}, generalCards:[{block,label,icon,path}] }). Delete the old settingsMenu / getSettingsMenu / generalSettingsCards exports. Paths are relative to /admin/settings/.
3. Rewrite system/config/menu.js as a thin aggregator (import.meta.glob of */config/settingsManifest.js) that returns { topMenus, sidebarSections }. Sidebar = [Search box, General Settings, one entry per INSTALLED app with has_settings, sorted by settings_sequence, icon from manifest]. Do not export a precomputed menu at import time.
4. Add a Settings top bar with three menus exactly like Odoo 17: "Users & Companies" (Users, Groups, Companies); "Translations" (Languages, Import Translations, Export Translations, Translated Terms); "Technical" visible only in developer mode, grouped as Automation (Automated Actions, Scheduled Actions, Webhooks), Database (Backups, System Events, Server Logs), Email (Outgoing Mail Servers, Incoming Mail Servers, Email Templates, Mail Aliases, Channels), Parameters (System Parameters), Security (Access Rights, Record Rules, Security Policy, Active Sessions, Integration Keys), User Interface (Menu Sequences, Document Layouts), Reporting (Reports, Print Formats), Sequences & Identifiers (Sequences), Localization (Currencies, Countries, States, Units of Measure). Move Personal Access Tokens to My Profile > Account Security.
5. Re-expose every currently orphaned page: Financial, Currencies, Sequences, Companies, Server Logs, Translations Import/Export.
6. settingsAdminRoutes.jsx must contain ONLY kernel routes and must not import pages from other apps. Delete the duplicated static routes (users, groups, active-sessions, access-rights, record-rules, webhooks, outgoing-mail, incoming-mail, email-templates, channels, portal). Every app's routes/settingsRoutes.jsx must default-export an ARRAY of keyed <Route>. Resolve the virtual-agents clash between agents and ai_engine. Rename routes consistently (system-events, server-logs; remove /logs).
7. Fix Sidebar.jsx: open/closed state must update when sections change (new sections default open); add the search box; filter items by permission and devOnly using DeveloperModeContext (create it; replace direct localStorage use of bitguard_dev_mode).
8. Remove every link that has no route (reports: report-tags, print-formats) or build the page.
9. Vitest + React Testing Library with apiClient mocked: sidebar shows only installed apps with has_settings; dev-only items hidden unless dev mode; a static test asserts every manifest path resolves to a route and no two apps register the same path.

PHASE 4 - SCHEMA-DRIVEN APP SETTINGS PAGES
1. Build system/components/settings/SettingsRenderer.jsx (+ field components) that renders blocks from core/settings-schema, tracks dirty state, shows an Odoo-style "Unsaved changes - Save / Discard" bar, uses toast for success and error, and degrades gracefully (Promise.allSettled, unwrap response.data.results safely).
2. Rewrite useSettings(prefix) to fetch only ?prefix= and remove console.error.
3. Replace every *SettingsPage.jsx with a thin wrapper: <SettingsRenderer schemaKey="<app>" />. Remove the copy-pasted Card/Switch/SettingRow code and the hardcoded settingRows arrays.

PHASE 5 - GENERAL SETTINGS (ODOO 17 BLOCKS)
Split GeneralSettingsPage.jsx into block components, auto-assembled from each app's generalCards: Users (active count, Manage Users, Invite), Languages, Companies (company form, multi-company toggle), Business Documents (layouts, templates), Contacts/Localization, Integrations, Developer Tools (dev mode via context, neutralize database), About (version, license, tenant). Move backup / prune-logs / clear-cache actions to the Backups and System Events pages. Add search that scrolls to and highlights matching blocks.

PHASE 6 - FEATURE GAPS
Build pages (service in frontend/src/core/api per Rule 45, page in system/pages, route, settingsManifest entry, backend permission tests) for: Countries, States, Units of Measure and UoM Categories, Translated Terms editor, Content Types, Command Center Sections, Mail Aliases.

PHASE 7 - HARDENING
Add CI checks: every settings path has a route; no *.bak, *.new, *_bak.py, *_new*.jsx files; system/ never imports from other apps. Update .agents/rules/architecture.md Rule 50 with the settingsManifest + settings_schema contract.

DEFINITION OF DONE
- Settings sidebar lists General Settings plus every installed app with settings; every link resolves; Technical menu appears only in developer mode.
- No hardcoded setting rows, mock saves, duplicate pages, duplicate routes or orphan files remain.
- Backend and frontend tests pass, including tenant-isolation negative tests.
- Report back with: files deleted, files created, files changed, test results, and any manifest whose slug had no route.
```

---

## 6. Decisions I need from you

1. **Technical menu in a top bar (true Odoo 17) vs. keeping everything in the sidebar?** I recommend the top bar, as it removes the clutter you complained about.
2. **Setting keys:** OK to standardise on `app.snake_name` and migrate existing `crm_*` values?
3. **Duplicate settings pages:** may the builder delete the non-routed copy automatically, or should it list them for your approval first?
