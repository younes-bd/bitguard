# Full Modular Registry-Driven Architecture Migration

## Current State Audit & What Needs to Change

This plan migrates BitGuard ERP from a **Frontend-Filtered SPA** to a **True Plugin Registry Architecture** — a pattern used by enterprise ERPs (Odoo, SAP, Microsoft Dynamics). The goal: **delete a module folder = fully remove it from the product. No core file changes required.**

---

## Current Architecture Audit

### What You Already Have ✅ (Good foundations)

| What | Where | Status |
|---|---|---|
| `__manifest__.py` per backend module | `backend/apps/crm/__manifest__.py` | ✅ Odoo-style |
| `config/menu.js` per frontend module | `frontend/src/apps/crm/config/menu.js` | ✅ Self-contained |
| `*AdminRoutes.jsx` per module | `frontend/src/apps/crm/routes/crmAdminRoutes.jsx` | ✅ Self-contained |
| Vite `import.meta.glob` in `BackendRoutes.jsx` | Dynamic route loading | ✅ Already dynamic |
| `useInstalledModules` hook | `frontend/src/core/hooks/useInstalledModules.jsx` | ✅ Exists |
| `system/modules/` REST endpoint | Backend API | ✅ Exists |

### What Is Hardcoded & Must Be Fixed ❌ (The problem)

| Problem | File | Impact |
|---|---|---|
| Command Center pillars are hardcoded (370+ lines) | `BackendLayout.jsx` L124–264 | Deleting a module folder doesn't remove it from global sidebar |
| All 60+ module menus imported manually | `core/api/menu.js` (133 lines, 60+ imports) | Every new module requires editing a core file |
| Settings Dashboard categories hardcoded | `SettingsDashboard.jsx` (getSettingsCategories fn) | App settings don't reflect actual installed modules |
| Settings sidebar menu hardcoded | `settings/config/menu.js` | New settings pages require manual entry in core file |
| `BackendLayout.jsx` filteredSections built inline | `BackendLayout.jsx` | Navigation manifest lives in layout, not in modules |
| `formatTitle()` hardcodes module display names | `BackendRoutes.jsx` L30–33 | Module display name must be in the manifest |
| Backend `__manifest__.py` not serving menu data | Backend | Frontend can't ask Django "what menus does CRM have?" |

---

## Target Architecture: The Registry Pattern

```
┌─────────────────────────────────────────────────────────────────────┐
│  DJANGO (Backend)                                                   │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │  GET /api/system/manifest/                              │       │
│  │  → Reads all installed app __manifest__.py files        │       │
│  │  → Returns: { modules: [{name, techName, menu,          │       │
│  │    settings_menu, command_center_entry, ...}] }         │       │
│  └─────────────────────────────────────────────────────────┘       │
│  Each Django app folder:                                            │
│  └── apps/crm/                                                      │
│      ├── __manifest__.py   ← menu, settings, command_center data    │
│      ├── apps.py                                                    │
│      └── ...                                                        │
└─────────────────────────────────────────────────────────────────────┘
           ↓  One API call on login
┌─────────────────────────────────────────────────────────────────────┐
│  REACT (Frontend)                                                   │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │  ManifestContext                                        │       │
│  │  → Fetches /api/system/manifest/ once on login          │       │
│  │  → Provides: commandCenterSections, settingsMenu,       │       │
│  │    moduleMenus, installedSet                            │       │
│  └─────────────────────────────────────────────────────────┘       │
│  core/api/menu.js        → DELETED (no longer needed)              │
│  BackendLayout.jsx       → reads commandCenterSections from context │
│  SettingsDashboard.jsx   → reads settingsCategories from context   │
│  BackendRoutes.jsx       → already uses import.meta.glob ✅        │
│                            + reads module display name from manifest│
└─────────────────────────────────────────────────────────────────────┘
```

---

## Open Questions

> [!IMPORTANT]
> **Manifest data format:** Should the module `menu` (sidebar navigation items for each app) stay in the frontend `config/menu.js` file (so React components can reference Lucide icons directly), or should icons be sent as icon-name strings from the backend (e.g., `"icon": "Users"`) and mapped on the frontend? 
> **Recommendation:** Keep `config/menu.js` in frontend for icons, but fetch **which modules are installed + their command center position** from Django. This is the cleanest hybrid.

> [!IMPORTANT]
> **Settings categories:** Should the `App Settings` section in the Settings Dashboard pull its data from the backend manifest, or should each frontend app module declare its own settings entry in its `config/menu.js`? **Recommendation:** Each app module's `config/menu.js` declares its own settings entry. The Settings Dashboard auto-discovers them via `import.meta.glob`.

---

## Proposed Changes

### Phase 1 — Extend Django `__manifest__.py` with Menu & Settings Data

#### [MODIFY] `backend/apps/crm/__manifest__.py` (representative — all ~60 app manifests)
Add `command_center` entry and `settings_entry` fields directly in the manifest:
```python
{
    'name': 'Sales & CRM',
    'technical_name': 'crm',
    'version': '1.0.0',
    'category': 'Sales',
    'summary': '...',
    'icon': 'Users',
    'url': '/admin/crm',
    'depends': ['system'],
    'installable': True,
    'application': True,
    'featured': True,
    # NEW FIELDS:
    'display_name': 'CRM',                    # used by formatTitle()
    'command_center_section': 'Sales',         # which section in global sidebar
    'command_center_order': 2,                 # position within that section
    'has_settings': True,                      # whether to show in App Settings
    'settings_url': '/admin/settings/crm',
    'settings_desc': 'Pipeline & Lead Settings',
}
```

#### [NEW] `backend/apps/core/api/views/manifest_view.py`
Django view that reads all installed app `__manifest__.py` files and returns a unified JSON manifest to the frontend.

#### [MODIFY] `backend/apps/core/api/urls.py`
Register the new `GET /api/system/manifest/` endpoint.

---

### Phase 2 — Frontend: Extend `config/menu.js` in Each Module

#### [MODIFY] `frontend/src/apps/crm/config/menu.js` (representative — all modules)
Add a `manifest` export alongside the existing menu export:
```js
export const crmManifest = {
    techName: 'crm',
    displayName: 'CRM',
    commandCenterSection: 'Sales',
    commandCenterOrder: 2,
    hasSettings: true,
    settingsUrl: '/admin/settings/crm',
    settingsDesc: 'Pipeline & Lead Settings',
};

export const crmMenu = [ /* existing menu stays */ ];
```

---

### Phase 3 — Frontend: Create `ManifestContext`

#### [NEW] `frontend/src/core/hooks/useManifest.jsx`
A new React context that:
1. Fetches `/api/system/manifest/` on mount (single API call)
2. Parses it into `commandCenterSections`, `settingsAppEntries`, `installedSet`
3. Falls back to reading `import.meta.glob('../../apps/*/config/menu.js')` to build the command center and settings panels from the frontend module manifests, so it works even if the backend doesn't return all entries yet.

#### [MODIFY] `frontend/src/core/routes/BackendRoutes.jsx`
- Replace `InstalledModulesProvider` with `ManifestProvider`
- Already uses `import.meta.glob` for routes ✅ — just extend it to read `crmManifest` from each module's `menu.js` to build the command center index.

---

### Phase 4 — Refactor `BackendLayout.jsx` (Remove Hardcoded Navigation)

#### [MODIFY] `frontend/src/core/layouts/BackendLayout.jsx`
- **Remove** the `filteredSections` useMemo block (370 lines → ~50 lines)
- **Replace** with: `const { commandCenterSections } = useManifest();`
- The Command Center sidebar now reads from the manifest context, which is built dynamically from module `config/menu.js` files via glob import.

---

### Phase 5 — Refactor `core/api/menu.js` (Delete It)

#### [DELETE] `frontend/src/core/api/menu.js`
This file manually imports 60+ module menus. After Phase 3, this is replaced entirely by `import.meta.glob` inside `useManifest.jsx`. It gets deleted.

Any code that imports from `core/api/menu.js` (e.g., `CommandPalette.jsx`) gets updated to use `useManifest()` context instead.

---

### Phase 6 — Refactor Settings Dashboard & Sidebar

#### [MODIFY] `frontend/src/apps/settings/pages/dashboards/SettingsDashboard.jsx`
- Remove `getSettingsCategories()` hardcoded function
- Replace `SETTINGS_CATEGORIES` with `const { settingsAppEntries } = useManifest();` which is auto-built from module manifests.

#### [MODIFY] `frontend/src/apps/settings/config/menu.js`
- Keep static settings sections (Users, Email, Technical, etc.)
- Remove `App Settings` section — this is now auto-discovered from module manifests.

---

### Phase 7 — Freelancer Deployment Workflow

#### [NEW] `scripts/build-client.sh`
A shell script that takes a list of modules to include, removes the rest from `frontend/src/apps/` and `backend/apps/`, then runs the build. Example:
```bash
./scripts/build-client.sh --include=crm,accounting,hr
```

---

## Verification Plan

### Automated Tests
- `pytest backend/` — backend manifest endpoint returns correct data
- Vite build completes with zero errors after removing a module folder

### Manual Verification
1. Delete `frontend/src/apps/crm/` and `backend/apps/crm/`
2. Restart Django + Vite dev server
3. Confirm CRM does **not** appear in: Command Center sidebar, Settings App Settings, App Store
4. Confirm all other modules still work perfectly
5. Re-add CRM folder → it reappears everywhere automatically

---

## Migration Priority (What to Build First)

| Priority | Phase | Effort | Impact |
|---|---|---|---|
| 🔴 Critical | Phase 3: ManifestContext | Medium | Replaces all hardcoding |
| 🔴 Critical | Phase 4: BackendLayout refactor | Medium | Removes 300 hardcoded lines |
| 🟡 High | Phase 2: Module manifest exports | Low (per module) | Self-contained modules |
| 🟡 High | Phase 5: Delete core/api/menu.js | Low | Decouples core from modules |
| 🟢 Medium | Phase 1: Django manifest endpoint | Medium | Full backend-driven future |
| 🟢 Medium | Phase 6: Settings Dashboard | Low | Completes settings modularity |
| ⚪ Later | Phase 7: Build script | Low | Freelancer tooling |
# AI Builder Prompts — Registry-Driven Plugin Architecture Migration

> **How to use:** Copy each prompt block exactly as written into your AI code builder, in order. Do NOT skip phases — each phase builds on the previous one. Each prompt is self-contained and gives full context.

---

## PROMPT 1 — Extend Backend `__manifest__.py` Files with Registry Data

```
CONTEXT:
I have a Django + React ERP called BitGuard. Every Django app in `backend/apps/` has a `__manifest__.py` file (Odoo-style).

CURRENT `backend/apps/crm/__manifest__.py`:
{
    'name': 'Sales & CRM',
    'technical_name': 'crm',
    'version': '1.0.0',
    'category': 'Sales',
    'summary': 'Track leads, opportunities, and sales pipeline.',
    'icon': 'Users',
    'url': '/admin/crm',
    'depends': ['system'],
    'installable': True,
    'application': True,
    'featured': True,
    'screenshots': [],
}

TASK:
Update EVERY `__manifest__.py` in `backend/apps/` to include these new fields:

'display_name': '<human readable name>',
'command_center_section': '<one of: Sales, Finance, Inventory & MRP, Human Resources, Marketing, Website, Productivity, Intelligence, Administration>',
'command_center_order': <integer, position within the section>,
'has_settings': True or False,  # True if this module has a settings page at /admin/settings/{techName}
'settings_url': '/admin/settings/{techName}',  # only if has_settings is True
'settings_desc': '<one-line description of what the settings page configures>',  # only if has_settings is True

Use this EXACT mapping for all apps (match the current BackendLayout.jsx filteredSections to know the section and order):

Sales section: sale (order 1), crm (order 2), pos (order 3), subscriptions (order 4), rental (order 5)
Services section: projects (order 1), timesheets (order 2), field_service (order 3), helpdesk (order 4), planning (order 5), appointments (order 6)
Finance section: accounting (order 1), invoicing (order 2), hr_expense (order 3), sign (order 4), esg (order 5), equity (order 6)
Inventory & MRP section: product (order 1), stock (order 2), mrp (order 3), purchase (order 4), delivery (order 5), maintenance (order 6), quality_control (order 7), mrp_plm (order 8)
Human Resources section: hr (order 1), hr_attendance (order 2), HrHolidays (order 3), payroll (order 4), recruitment (order 5), appraisals (order 6), fleet (order 7), referrals (order 8)
Marketing section: marketing (order 1), social (order 2), events (order 3), surveys (order 4)
Intelligence section: ai_agent (order 1)
Website section: website (order 1), ecommerce (order 2), blog (order 3), elearning (order 4), portal (order 5)
Productivity section: documents (order 1), approvals (order 2), discuss (order 3), calendar (order 4), reporting (order 5), knowledge (order 6)
Administration section: security (order 1), soc (order 2)

Modules with settings pages (has_settings: True): crm, sale, accounting, stock, mrp, website, hr, pos
All others: has_settings: False

Do not change any existing fields. Only ADD the new fields at the end of each manifest dict.
Update all manifests in: backend/apps/*/.__manifest__.py
```

---

## PROMPT 2 — Create Django Manifest API Endpoint

```
CONTEXT:
I have a Django ERP. Every installed Django app in `backend/apps/` has a `__manifest__.py` file containing metadata about the module (name, technical_name, category, command_center_section, etc.).

The frontend already calls `GET /api/system/modules/` to get installed modules. I now need an additional endpoint.

TASK:
Create a new Django REST endpoint: `GET /api/system/manifest/`

This endpoint should:
1. Loop over all apps in `django.apps.apps.get_app_configs()` that are under the `apps.` namespace (i.e., app.name.startswith('apps.'))
2. For each app, attempt to import its `__manifest__` module (e.g., `from apps.crm import __manifest__`). Use importlib for safety.
3. For apps that have a manifest, include them in the response only if their `installable` field is True AND they are currently installed in the Django INSTALLED_APPS.
4. Return a JSON response in this exact structure:

{
  "modules": [
    {
      "technical_name": "crm",
      "display_name": "CRM",
      "name": "Sales & CRM",
      "category": "Sales",
      "icon": "Users",
      "url": "/admin/crm",
      "version": "1.0.0",
      "command_center_section": "Sales",
      "command_center_order": 2,
      "has_settings": true,
      "settings_url": "/admin/settings/crm",
      "settings_desc": "Pipeline & Lead Settings",
      "is_installed": true
    },
    ...
  ]
}

Files to create/modify:
- CREATE: `backend/apps/core/api/views/manifest_view.py` — the view class (ManifestView, APIView, GET method)
- MODIFY: `backend/apps/core/api/urls.py` — add `path('manifest/', ManifestView.as_view(), name='manifest')` to urlpatterns
- The endpoint must be authenticated (IsAuthenticated) and accessible to admin users only (IsAdminUser or custom permission).
- Add proper error handling: if a manifest can't be imported, skip that app silently with a console warning.
- Cache the result in Django's cache framework for 60 seconds (cache key: 'system_manifest').

Do NOT modify any model, migration, or settings file.
```

---

## PROMPT 3 — Create Frontend `useManifest` Context (Core of the Architecture)

```
CONTEXT:
I have a React + Django ERP. The frontend has a `frontend/src/core/hooks/` directory.

There is already a hook `useInstalledModules` in `frontend/src/core/hooks/useInstalledModules.jsx` that fetches from `system/modules/` and provides an `installedSet`.

There is also Vite glob import already used in `frontend/src/core/routes/BackendRoutes.jsx`:
const menuConfigs = import.meta.glob('../../apps/*/config/menu.js', { eager: true });

Each app's `config/menu.js` exports a menu array like `crmMenu`, `salesMenu`, etc.

TASK:
Create a new file: `frontend/src/core/hooks/useManifest.jsx`

This hook/context should:

1. Fetch `GET /api/system/manifest/` to get the list of installed modules and their metadata.

2. ALSO use Vite glob import to read all frontend module manifests:
   const menuConfigs = import.meta.glob('../../apps/*/config/menu.js', { eager: true });
   
   For each module in menuConfigs, look for an export ending in 'Menu' (e.g., crmMenu) — this is the sidebar menu for that module.

3. Build and expose these values via React context:

   a. `installedSet` — Set of technical_names of installed modules (from API response)
   
   b. `commandCenterSections` — An array of section objects for the global sidebar, built by:
      - Grouping installed modules by their `command_center_section` field
      - Sorting each section's items by `command_center_order`
      - Mapping icon string names (e.g., "Users") to actual Lucide icon components using a lookup map
      - Format: [{ title: 'Sales', items: [{ label, icon, path, techName }] }]
      - Always include these hardcoded-core items that have no module:
        * Overview section: [{ label: 'Command Center', icon: LayoutDashboard, path: '/admin/board' }, { label: 'Notifications', icon: Bell, path: '/admin/notifications' }]
        * Administration section: [{ label: 'Settings', icon: Server, techName: null, path: '/admin/settings' }, { label: 'Apps', icon: Layers, techName: null, path: '/admin/apps' }]
   
   c. `settingsAppEntries` — An array of app settings entries for the Settings Dashboard App Settings section:
      [{ title: 'CRM', desc: 'Pipeline & Lead Settings', link: '/admin/settings/crm' }]
      Built from modules where has_settings === true.
   
   d. `moduleMenus` — A map of techName → menu array:
      { crm: [...crmMenu items], sales: [...salesMenu items] }
      Built from the Vite glob import of config/menu.js files.
   
   e. `loading` — boolean
   
   f. `refreshManifest` — function to re-fetch

4. Export:
   - `ManifestProvider` component (wraps children in context)
   - `useManifest` hook

5. Icon string to Lucide component map (include at minimum):
   Users, ShoppingBag, Monitor, Layers, Calendar, FolderKanban, Clock, MapPin, LifeBuoy, Tag, CalendarDays,
   PieChart, FileText, CreditCard, PenLine, Leaf, Landmark, Box, Warehouse, Wrench, Truck, PackageCheck,
   Settings2, ShieldCheck, QrCode, Building2, UserCheck, DollarSign, UserPlus, Award, Car, Share2,
   Megaphone, CalendarDays, FileQuestion, Bot, Globe, ShoppingBag, BookOpen, Book, LayoutDashboard,
   FolderOpen, CheckSquare, MessageSquare, BarChart3, ShieldAlert, Server, Bell, Plus, Cpu, Grid

Use `import * as LucideIcons from 'lucide-react'` and do the lookup as `LucideIcons[iconName]` for simplicity.

The API call should use the existing `apiClient` from `@/core/api/client`.
Handle API failure gracefully — fall back to frontend-only manifest (from glob imports), treating all modules as installed.
```

---

## PROMPT 4 — Add `manifest` Export to Each Module's `config/menu.js`

```
CONTEXT:
I have a React ERP with ~60 app modules in `frontend/src/apps/`. Each app has a `frontend/src/apps/{appName}/config/menu.js` file that exports a menu array.

Example current `frontend/src/apps/crm/config/menu.js`:
export const crmMenu = [
  { title: 'Sales', items: [...] },
  ...
];

TASK:
Add a second named export called `{appName}Manifest` to EVERY module's `config/menu.js` file.

The manifest export should contain:
- techName: '{appName}' (the folder name, lowercase)
- displayName: '<human readable name, e.g. CRM, Sales, Accounting>'
- commandCenterSection: '<section string>'
- commandCenterOrder: <integer>
- hasSettings: true or false
- settingsUrl: '/admin/settings/{appName}' (only if hasSettings is true)
- settingsDesc: '<one line description>' (only if hasSettings is true)

Use EXACTLY the same values you added to the Django __manifest__.py files in Prompt 1.

Example result for CRM:
export const crmManifest = {
  techName: 'crm',
  displayName: 'CRM',
  commandCenterSection: 'Sales',
  commandCenterOrder: 2,
  hasSettings: true,
  settingsUrl: '/admin/settings/crm',
  settingsDesc: 'Pipeline & Lead Settings',
};

export const crmMenu = [
  /* existing content unchanged */
];

Rules:
- Do NOT modify the existing menu export in any way.
- The manifest variable must be named `{appName}Manifest` (camelCase, e.g., crmManifest, salesManifest, hrManifest, HrHolidaysManifest).
- Place the manifest export BEFORE the menu export in the file.
- Apply this to ALL modules: crm, sales, accounting, stock, mrp, website, hr, hr_attendance, HrHolidays, payroll, recruitment, appraisals, fleet, referrals, pos, projects, timesheets, field_service, helpdesk, planning, appointments, accounting, invoicing, expenses, sign, esg, equity, product, purchase, maintenance, quality_control, mrp_plm, marketing, social, events, surveys, ai_agent, ecommerce, blog, elearning, portal, documents, approvals, discuss, calendar, reporting, knowledge, security, sms, whatsapp, livechat, subscriptions, rental, board, apps, users, settings, support, spreadsheet, social.
```

---

## PROMPT 5 — Refactor `BackendLayout.jsx` to Use `useManifest`

```
CONTEXT:
I have a React ERP. The file `frontend/src/core/layouts/BackendLayout.jsx` currently contains a ~140-line `filteredSections` useMemo block (lines 124–264) that HARDCODES the entire global Command Center navigation with ~70 module entries.

I have just created a new `useManifest` hook in `frontend/src/core/hooks/useManifest.jsx` that provides:
- `commandCenterSections` — the dynamically built navigation sections array
- `installedSet` — Set of installed module technical names

TASK:
Refactor `frontend/src/core/layouts/BackendLayout.jsx`:

1. Add this import at the top:
   import { useManifest } from '../hooks/useManifest';

2. Remove the ENTIRE `filteredSections` useMemo block (the one that starts with `const filteredSections = useMemo(() => {` and contains 60+ hardcoded module entries).

3. Replace it with this single line:
   const { commandCenterSections } = useManifest();

4. Replace the variable name in the JSX: wherever `filteredSections` is passed to the `<Sidebar>` component, replace it with `commandCenterSections`.

5. Remove the line: `const { installedSet, loading: modulesLoading } = useInstalledModules();`
   And replace with: `const { installedSet } = useManifest();`
   (useManifest already exposes installedSet internally)

6. Remove the import of `useInstalledModules` if it is no longer used anywhere else in the file.

7. Do NOT change anything else in the file — keep the search, header, logout, and all other functionality exactly as-is.

Result: BackendLayout.jsx should shrink from ~381 lines to roughly ~250 lines with zero hardcoded module entries.
```

---

## PROMPT 6 — Refactor `BackendRoutes.jsx` to Use Module `displayName` from Manifest

```
CONTEXT:
I have a React ERP. `frontend/src/core/routes/BackendRoutes.jsx` has a `formatTitle()` function that hardcodes display names for some modules:

const formatTitle = (str) => {
    if (str === 'mrp_plm') return 'PLM';
    if (str === 'hr') return 'Human Resources';
    if (str === 'crm') return 'CRM';
    return str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

It also uses `import.meta.glob` to load module menus:
const menuConfigs = import.meta.glob('../../apps/*/config/menu.js', { eager: true });

Each module's `config/menu.js` now exports a `{appName}Manifest` object with a `displayName` field.

TASK:
Refactor `frontend/src/core/routes/BackendRoutes.jsx`:

1. Update the dynamic route building block. When iterating `routeModules`, for each app:
   - Look up that app's manifest from menuConfigs: find the export key ending in 'Manifest' (e.g., `crmManifest`)
   - If found, use `manifest.displayName` as the module title
   - If not found, fall back to the existing `formatTitle(appName)` logic

2. Replace `InstalledModulesProvider` with `ManifestProvider`:
   - Change import from: `import { InstalledModulesProvider } from '../hooks/useInstalledModules';`
   - To: `import { ManifestProvider } from '../hooks/useManifest';`
   - Update JSX: `<InstalledModulesProvider>` → `<ManifestProvider>`

3. You MAY keep the `formatTitle` function as a fallback, but remove the hardcoded special cases (mrp_plm, hr, crm) since those are now in the manifest.

4. Do NOT change the route structure, excluded apps list, or any other logic.
```

---

## PROMPT 7 — Refactor Settings Dashboard to Use `useManifest`

```
CONTEXT:
I have a React ERP. `frontend/src/apps/settings/pages/dashboards/SettingsDashboard.jsx` has a `getSettingsCategories()` function that hardcodes an `app_settings` category with 6 hardcoded module entries (CRM, Sales, Accounting, Inventory, Manufacturing, Website).

I also recently added filtering logic to this component using `useInstalledModules`.

I have now created a `useManifest` hook that exposes:
- `settingsAppEntries` — an array of { title, desc, link } objects for EVERY installed module that has settings
- `installedSet` — Set of installed technical names

TASK:
Refactor `frontend/src/apps/settings/pages/dashboards/SettingsDashboard.jsx`:

1. Replace the import:
   `import { useInstalledModules } from '@/core/hooks/useInstalledModules';`
   With:
   `import { useManifest } from '@/core/hooks/useManifest';`

2. Replace the hook call:
   `const { installedSet } = useInstalledModules();`
   With:
   `const { settingsAppEntries, installedSet } = useManifest();`

3. In the `SETTINGS_CATEGORIES` useMemo, replace the hardcoded `app_settings` category with a dynamic one:
   Instead of hardcoding CRM, Sales, etc., build the `app_settings` sections from `settingsAppEntries`:
   
   {
     id: 'app_settings',
     label: 'App Settings',
     icon: Server,
     sections: settingsAppEntries.length > 0 ? [{
       title: 'Installed Modules',
       items: settingsAppEntries
     }] : []
   }
   
   And only include this category if `settingsAppEntries.length > 0`.

4. Remove the `appSettingsTechNames` lookup map and the manual filtering logic that was added previously — it is now handled by `useManifest`.

5. Remove the `installedSet` usage inside the `SETTINGS_CATEGORIES` useMemo if it is no longer needed there.

6. Update useMemo dependency: `[isDevMode, settingsAppEntries]`

7. Do NOT change any other part of the component — keep the search, sidebar, header, developer mode toggle, etc. exactly as-is.
```

---

## PROMPT 8 — Delete `core/api/menu.js` and Update Its Consumers

```
CONTEXT:
I have a React ERP. The file `frontend/src/core/api/menu.js` manually imports menu arrays from all ~60 module `config/menu.js` files and exports them as `moduleMenu`. This file is now obsolete because:
1. `BackendRoutes.jsx` reads menus via `import.meta.glob` directly
2. `BackendLayout.jsx` now uses `useManifest()` for the Command Center sidebar
3. `ManifestContext` builds the command center from module manifests via glob import

TASK:
1. Find ALL files that import from `core/api/menu.js`:
   - `frontend/src/core/components/shared/core/CommandPalette.jsx` — likely imports `moduleMenu`
   - Any other files that reference `from '../api/menu'` or `from '../../api/menu'`

2. For each consumer file:
   a. `CommandPalette.jsx`: Replace `import { moduleMenu } from '../../../api/menu';`
      with `import { useManifest } from '../../../hooks/useManifest';`
      Then inside the component: `const { moduleMenus } = useManifest();`
      And update the code that iterates `moduleMenu` to iterate `Object.values(moduleMenus)` instead.

3. After all consumers are updated, DELETE `frontend/src/core/api/menu.js`.

4. Verify there are no remaining imports from this file by searching for `from.*api/menu` in the codebase.

Do NOT modify any other files.
```

---

## PROMPT 9 — Add Settings Sidebar Auto-Discovery

```
CONTEXT:
I have a React ERP. The file `frontend/src/apps/settings/config/menu.js` is the sidebar navigation for the Settings module. It currently has an `App Settings` section that hardcodes CRM, Sales, Accounting, Inventory, Manufacturing, Website.

I have a `useManifest` hook that provides `settingsAppEntries` — a dynamically built list of installed modules with settings pages.

TASK:
Modify `frontend/src/apps/settings/config/menu.js`:

1. Remove the hardcoded `App Settings` section (the `title: 'App Settings'` block with CRM, Sales, etc.).

2. The App Settings sidebar items will now be injected dynamically. To support this, the settingsMenu needs to become a function that accepts `settingsAppEntries` as a parameter, OR the `Sidebar` component inside the Settings layout needs to receive the dynamic items.

   RECOMMENDED APPROACH: Convert `settingsMenu` from a static array to a function:
   
   export const getSettingsMenu = (settingsAppEntries = []) => [
     {
       title: 'General Settings',
       items: [ /* existing items */ ]
     },
     {
       title: 'Users & Companies',
       items: [ /* existing items */ ]
     },
     // ... all existing sections ...
     // App Settings section — dynamically built
     ...(settingsAppEntries.length > 0 ? [{
       title: 'App Settings',
       items: settingsAppEntries.map(entry => ({
         label: entry.title,
         icon: Server,
         path: entry.link
       }))
     }] : []),
     // Keep remaining sections (Technical, Reporting, etc.)
   ];
   
   // Keep backward compatibility:
   export const settingsMenu = getSettingsMenu([]);

3. In `frontend/src/core/layouts/ModuleLayout.jsx` OR wherever the Settings module sidebar is rendered, if `sections` prop comes from `settingsMenu`, update it to call `getSettingsMenu(settingsAppEntries)` using the `useManifest()` hook.

   Actually, since the Settings module routes are handled in `BackendRoutes.jsx` via dynamic glob loading, and ModuleLayout receives `sections={moduleMenu}`, you need to update the `ModuleLayout` component to:
   - Check if the current module is 'settings'
   - If yes, get `settingsAppEntries` from `useManifest()` and call `getSettingsMenu(settingsAppEntries)` instead of using the static export

   OR alternatively: update `BackendRoutes.jsx` so that when building settings module routes, it calls `getSettingsMenu(settingsAppEntries)` instead of using the raw menu export.

Keep all other sections in `settingsMenu` unchanged.
```

---

## PROMPT 10 — Final Verification & Freelancer Build Script

```
CONTEXT:
I have a Django + React ERP with a fully modular Registry-Driven architecture. Each module is self-contained in:
- `backend/apps/{module}/` — Django app with `__manifest__.py`
- `frontend/src/apps/{module}/` — React app with `config/menu.js`, `routes/*AdminRoutes.jsx`

The frontend uses `import.meta.glob` to auto-discover all modules. The backend has a `/api/system/manifest/` endpoint.

TASK:
Create the freelancer build/deployment script at `scripts/strip-modules.sh`:

#!/bin/bash
# BitGuard — Client Build Script
# Usage: ./scripts/strip-modules.sh --keep=crm,accounting,hr,stock
# Strips out all modules NOT in the --keep list, then builds.

Parse the --keep flag.
For each module NOT in the keep list:
  - Delete `frontend/src/apps/{module}/` if it exists
  - Delete `backend/apps/{module}/` if it exists  
  - Remove the module from INSTALLED_APPS in Django settings (search for `'apps.{module}'` and comment it out)

After stripping:
  - Run `cd frontend && npm run build`
  - Run `cd backend && python manage.py migrate`
  - Print a summary of what was removed

Also create `scripts/restore-modules.sh` that uses git to restore deleted module folders:
  - Run `git checkout -- frontend/src/apps/ backend/apps/`
  - Print "Modules restored from git"

Add a safety check: before deleting, verify the module is not in the `depends` list of any module being kept. If it is, warn and skip.

Make both scripts executable (chmod +x).

ALSO:
Run a final audit on the codebase to verify:
1. `frontend/src/core/api/menu.js` does NOT exist (was deleted)
2. `BackendLayout.jsx` does NOT contain any hardcoded module entries (no 'crm', 'sale', 'accounting' etc. in the filteredSections)
3. `SettingsDashboard.jsx` does NOT contain a hardcoded app settings list
4. `import.meta.glob` is used in `BackendRoutes.jsx` ✅
5. `ManifestProvider` wraps `BackendRoutes` ✅

Report any remaining hardcoded module references that need cleanup.
```

---

## Summary: Order of Execution

```
Phase 1  → PROMPT 1  (Backend __manifest__.py — extend all)
Phase 2  → PROMPT 2  (Django /api/system/manifest/ endpoint)
Phase 3  → PROMPT 3  (React useManifest context — the core)
Phase 4  → PROMPT 4  (Add manifest export to all frontend config/menu.js)
Phase 5  → PROMPT 5  (Refactor BackendLayout.jsx — remove 140 hardcoded lines)
Phase 6  → PROMPT 6  (Refactor BackendRoutes.jsx — use displayName from manifest)
Phase 7  → PROMPT 7  (Refactor SettingsDashboard.jsx — use settingsAppEntries)
Phase 8  → PROMPT 8  (Delete core/api/menu.js — final decoupling)
Phase 9  → PROMPT 9  (Settings sidebar auto-discovery)
Phase 10 → PROMPT 10 (Build script + final audit)
```

> [!IMPORTANT]
> **After PROMPT 3** (creating useManifest), test the app before proceeding. If the Command Center sidebar renders correctly with data from useManifest, you are safe to continue with the refactors.

> [!TIP]
> **Prompts 1 and 4** can be run in parallel (they touch different parts of the codebase). Similarly, **Prompts 5, 6, and 7** can be run in parallel after Prompt 3 is done.
