# BitGuard ERP — Master Module Audit Report
### Modules: Dashboard (CommandCenter) · Settings · Apps
---

## Executive Summary

Three parallel deep-audit agents read every relevant file across the backend and frontend. The findings reveal a system that is architecturally sound but has critical data-layer disconnects, mocked endpoints returning fake data, hardcoded configuration, and several dead UI features. The table below gives the overall health at a glance.

| Module | Backend Quality | Frontend Quality | Odoo Parity | Overall |
|---|---|---|---|---|
| **Dashboard / CommandCenter** | 8/10 | 4/10 | 5/10 | **5.7/10** |
| **Settings** | 7/10 | 8/10 | 6/10 | **7.0/10** |
| **Apps (Module Registry)** | 7/10 | 6/10 | 7/10 | **6.7/10** |

---

## MODULE 1 — Dashboard / CommandCenter

### Critical Issues

#### A. KPI Key Mismatches (Frontend expects ≠ Backend provides)
The `CommandCenterAnalyticsService` in the backend and `CommandCenter.jsx` in the frontend use **different key names**, causing most tiles to render `undefined` or blank.

| Frontend expects | Backend actually sends | Fix needed |
|---|---|---|
| `metrics.support.open_tickets` | `metrics.helpdesk.open_tickets` | Rename backend key |
| `metrics.stock.low_stock_items` | `metrics.inventory.low_stock_items` | Rename backend key |
| `metrics.maintenance.total_assets` | `metrics.itam.total_assets` | Rename backend key |

#### B. Backend Missing KPI Keys Entirely
These keys are referenced in tile definitions in `CommandCenter.jsx` but the backend never returns them:
- `metrics.erp.net_profit_mtd`, `metrics.erp.cash_position`, `metrics.erp.outstanding_ar`, `metrics.erp.pending_expenses`
- `metrics.projects.missing_timesheets`
- `metrics.services.requests`
- `metrics.pos.sessions`
- `metrics.sales.orders`
- `metrics.mrp.open_orders`
- `metrics.website.pages`, `metrics.blog.posts`
- `metrics.discuss.unread`, `metrics.calendar.events`

#### C. Broken PDF Export (`ExportPage.jsx`)
The Export page lets users pick "PDF" format. The backend `ExportReportView` forces **all** exports to `text/csv`. Every PDF download is a corrupted file.

#### D. Hardcoded Data
- **`ExecutiveSummary.jsx`**: Constructs fake arrays via `Array.from({length: data.projects?.active_projects})` just to satisfy downstream `.length` calls.
- **`ExecutiveSummary.jsx`**: Target badge `"FY26 Target: 105%"` is hardcoded text.
- **`CommandCenter.jsx` — "Restaurant" tile**: Points to `/admin/pos`, identical to "Point of Sale" — duplicate dead link.

#### E. Redundant/Unused Backend Service
`DashboardViewSet` in `backend/apps/system/api/views.py` partially computes dashboard metrics but the frontend never calls it. The actual frontend hits `CommandCenterView` in `backend/apps/board/`.

### Missing Features vs Odoo Standard
- No configurable dashboard (users cannot add/remove/reorder widgets)
- No drag-and-drop widget layout
- No global date range filter that affects all KPIs simultaneously
- No drill-down from KPI tile to live record list
- No real-time auto-refresh (no WebSocket or polling interval on CommandCenter)
- No activity feed widget showing recent chatter/logs across all models

---

## MODULE 2 — Settings

### Critical Issues

#### A. Fully Mocked Backend Endpoints
These endpoints **always return hardcoded Python arrays**, regardless of what's in the database:
- `GET /api/core/config-options/` — Timezones, Currencies, Languages list
- `GET /api/core/integrations-status/` — Returns fake Stripe/AWS/Slack connection statuses

This means the "Integration Status" panel in GeneralSettings always shows the same static "Connected/Disconnected" states regardless of what the user has actually configured in IntegrationSettings.

#### B. AutomationsSettings — Hardcoded Automation List
The 14 automation items in `AutomationsSettings.jsx` are hardcoded in a `AUTOMATIONS_CONFIG` constant. They reference Django models like `accounting.Invoice` directly. If Accounting is not installed, clicking "Run Now" crashes the backend.

#### C. Upgrade Action is a Stub
`ErpModuleViewSet.upgrade()` in the backend has a comment: `# Placeholder for real upgrade logic` and just returns `{"status": "success"}` without actually doing anything.

#### D. Developer Mode is Shallow
The Developer Mode toggle just sets a localStorage flag and appends `?debug=1`. It doesn't expose field technical names, view architectures, or model definitions — none of the deep introspection that makes Odoo's developer mode valuable.

### Missing Features vs Odoo Standard
- **No dynamic settings injection**: In Odoo, modules add their own settings fields via `res.config.settings` inheritance. Here, every settings panel is hardcoded per module.
- **No Menu Editor**: Odoo has `ir.ui.menu` — a live tree editor for the navigation menus. Completely absent.
- **No View Editor**: Odoo has `ir.ui.view` — a live XML view architecture editor. Completely absent.
- **No System Parameters page**: Odoo's `ir.config_parameter` gives admins a raw key-value store for system config. Not present.
- **Languages are partially mocked**: The Languages list page exists and hits the backend, but the backend doesn't actually switch the active language in the UI.
- **Timezones dropdown in GeneralSettings** is a hardcoded Python list, not derived from `pytz`.

### What Works Well
- Sequences, Scheduled Actions, Email Templates, Record Rules, Roles & Permissions are robust
- Security Policy (MFA, password rules, session timeout) is fully connected
- Company settings (logo, name, address) are fully functional via multipart form upload
- SMTP/IMAP server configuration is fully wired to the database

---

## MODULE 3 — Apps Module Registry

### Critical Issues

#### A. `sync_modules.py` Fails to Read All Fields
The sync function reads manifest files but **does not extract** these fields into the database, so they are always blank:
- `website`, `license`, `featured`, `screenshots`

#### B. All `__manifest__.py` Files Are Missing Key Fields
Every checked manifest (crm, accounting, sale, purchase, stock, hr, marketing, projects, helpdesk, website, pos, elearning, mrp, fleet, system) is missing:
- `website`, `license`, `rating`, `featured`, `screenshots`

Several are also missing `url` (the live frontend path).

#### C. Sidebar Categories Are Hardcoded
`frontend/src/apps/apps/config/menu.js` hardcodes the category list. New categories from new modules never appear in the sidebar automatically.

#### D. Frontend Features Built but Disabled
The following fields exist in the model and are exposed by the API but are completely ignored in the UI:
- `featured` — no "Featured" banner/section on AppStore homepage
- `screenshots` — no carousel in AppDetail
- `has_update` — the `/updates` route just filters `is_installed=true`, not modules where `has_update=true`
- `url` — no "Launch App →" button on AppDetail
- `rating` — displayed but read-only; no user rating mechanism

#### E. `upgrade` Action is a Stub
Both on the backend ViewSet and on the frontend — the Upgrade feature is surfaced by the serializer's `has_update` field but there is no UI button for it and no backend logic.

---

## Summary of All Hardcoded / Mocked Data Points

| Location | What's hardcoded | Impact |
|---|---|---|
| `ExecutiveSummary.jsx:47` | `Array.from({length: projects})` | Fake array construction |
| `ExecutiveSummary.jsx:145` | `"FY26 Target: 105%"` | Always shows wrong target |
| `ExportPage.jsx` + backend | PDF generates as CSV | All PDF exports broken |
| `core/api/views.py:ConfigOptionsView` | Timezones, currencies as Python list | Never pulls from pytz/DB |
| `core/api/views.py:IntegrationsStatusView` | Fake Stripe/AWS/Slack status | Always shows wrong status |
| `AutomationsSettings.jsx:AUTOMATIONS_CONFIG` | 14 hardcoded automation templates | Crashes if dependent model missing |
| `apps/config/menu.js` (categories) | Hardcoded category list | New categories never appear |
| `CommandCenter.jsx` (Restaurant tile) | Duplicate POS path `/admin/pos` | Dead link |
| `sync_modules.py` | Skips `website`, `license`, `featured`, `screenshots` | Fields always blank |

---

# IMPLEMENTATION PROMPT FOR AI WEBSITE BUILDER

---

## Context

You are working on **BitGuard ERP**, a full-stack ERP application built with:
- **Backend**: Django REST Framework (DRF), PostgreSQL, multi-tenant architecture
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React icons, React Router v6
- **Architecture**: Modular ERP inspired by Odoo — each feature is a "module" (app) with a `__manifest__.py`, a Django app, and a React app

The codebase structure for each module follows this pattern:
```
backend/apps/<module_name>/
  __manifest__.py          ← module metadata
  domain/models.py         ← Django models
  api/views.py             ← DRF ViewSets
  api/serializers.py       ← DRF Serializers
  api/urls.py              ← URL routing

frontend/src/apps/<module_name>/
  pages/                   ← React page components
  api/                     ← API service functions
  config/menu.js           ← Sidebar menu config
  routes/<name>AdminRoutes.jsx  ← React Router route definitions
```

---

## TASK 1: Fix the Dashboard / CommandCenter Module

### 1.1 — Fix Backend KPI Key Names (`backend/apps/board/services/analytics.py`)

The `CommandCenterAnalyticsService` must return these exact top-level keys to match what `CommandCenter.jsx` expects. Rename/add the following in the service's output dictionary:

```python
# Rename these keys in the returned dict:
"helpdesk" → "support"   (key: open_tickets)
"inventory" → "stock"    (key: low_stock_items)
"itam"      → "maintenance" (key: total_assets)

# Add these missing keys (query the DB; return 0 if module not installed):
metrics["erp"]["net_profit_mtd"]     = # Sum of AccountingJournal line items for current month
metrics["erp"]["cash_position"]      = # Sum of bank/cash journal balances
metrics["erp"]["outstanding_ar"]     = # Total unpaid customer invoices
metrics["erp"]["pending_expenses"]   = # Expenses in 'submitted' or 'approved' state
metrics["projects"]["missing_timesheets"] = # Projects with no timesheet entry this week
metrics["services"]["requests"]      = # Open service/appointment requests
metrics["pos"]["sessions"]           = # Open POS session count
metrics["sales"]["orders"]           = # Sale orders created this month
metrics["mrp"]["open_orders"]        = # Manufacturing orders in 'confirmed' state
metrics["website"]["pages"]          = # Total published CMS pages
metrics["blog"]["posts"]             = # Published blog posts
metrics["discuss"]["unread"]         = # Unread messages for the current user
metrics["calendar"]["events"]        = # Events this week
```

Wrap each query in a `try/except ImportError` or `try/except Exception: pass` so uninstalled modules gracefully return 0.

### 1.2 — Fix PDF Export (`backend/apps/board/api/views.py` — `ExportReportView`)

Replace the hardcoded `text/csv` content type with format-aware logic:
```python
format_type = request.query_params.get('format', 'csv')
if format_type == 'pdf':
    # Use reportlab or weasyprint to generate PDF
    content_type = 'application/pdf'
    filename = 'report.pdf'
elif format_type == 'xlsx':
    # Use openpyxl to generate Excel
    content_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    filename = 'report.xlsx'
else:
    content_type = 'text/csv'
    filename = 'report.csv'
```

### 1.3 — Fix `ExecutiveSummary.jsx` Hardcoded Data

- Remove the `Array.from({length: N})` pattern — pass the raw count to the UI
- Replace `"FY26 Target: 105%"` with a value fetched from `system/settings/` with key `fiscal_year_target`; allow saving this value in GeneralSettings

### 1.4 — Fix Duplicate "Restaurant" Tile in `CommandCenter.jsx`

Change Restaurant tile path to `/admin/pos/restaurant` (or a dedicated restaurant sub-route). Add `techName: 'pos'` so it respects the POS module install state.

### 1.5 — Add Real-Time Refresh to CommandCenter

In `CommandCenter.jsx`, add a `useEffect` polling interval (60 seconds) that re-fetches metrics. Add a manual "Refresh" button with a spinning indicator.

---

## TASK 2: Fix the Settings Module

### 2.1 — Replace Mocked `ConfigOptionsView` (`backend/apps/core/api/views.py`)

Replace the hardcoded arrays with real data:

```python
# Timezones: use pytz
import pytz
timezones = [{"value": tz, "label": tz} for tz in pytz.common_timezones]

# Currencies: query the accounting module's Currency model, or use pycountry
# Languages: query the system.Language model for installed languages
```

### 2.2 — Replace Mocked `IntegrationsStatusView`

Instead of always returning `{"stripe": "connected"}`, check whether the relevant settings keys have non-empty values in the `SystemSetting` model:

```python
def get_integration_status(tenant):
    def is_configured(key):
        val = SystemSetting.objects.filter(tenant=tenant, key=key).first()
        return bool(val and val.value and val.value.strip())
    
    return {
        "stripe": "connected" if is_configured("stripe_secret_key") else "disconnected",
        "twilio": "connected" if is_configured("twilio_sid") else "disconnected",
        "aws_s3": "connected" if is_configured("aws_access_key") else "disconnected",
        "slack": "connected" if is_configured("slack_webhook_url") else "disconnected",
        "sendgrid": "connected" if is_configured("sendgrid_api_key") else "disconnected",
    }
```

### 2.3 — Fix `AutomationsSettings.jsx` — Dynamic Model Checking

Before rendering each automation option in the AUTOMATIONS_CONFIG list, add a check:

```python
# Backend: add a new endpoint GET /api/system/check-model/?model=accounting.Invoice
# Returns {"exists": true/false}
```

In the frontend, grey out / disable automation items where the required model is not installed. Use the `installedSet` from `useInstalledModules` context to infer which models are available.

### 2.4 — Implement Real `upgrade` Action (`backend/apps/system/api/views.py`)

```python
@action(detail=True, methods=['post'], permission_classes=[IsPlatformAdmin])
def upgrade(self, request, pk=None):
    module = self.get_object()
    # Re-read the manifest and update the DB record
    manifest_path = find_manifest(module.technical_name)
    if manifest_path:
        data = read_manifest(manifest_path)
        module.version = data.get('version', module.version)
        module.summary = data.get('summary', module.summary)
        module.description = data.get('description', module.description)
        module.save()
        return Response({"status": "upgraded", "new_version": module.version})
    return Response({"error": "Manifest not found"}, status=404)
```

### 2.5 — Add System Parameters Page (Odoo: `ir.config_parameter`)

Add a new page `SystemParameters.jsx` in `frontend/src/apps/settings/pages/lists/` that provides a simple key-value table editor for `SystemSetting` records. This replaces the need to hardcode config in the backend.

- Backend endpoint: already exists at `system/settings/` (CRUD)
- Frontend: Table with columns: Key | Value | Category | Last Updated | Actions (Edit, Delete)

### 2.6 — Timezones Dropdown in `GeneralSettings.jsx`

Replace the hardcoded timezone list in the frontend with a call to `GET /api/core/config-options/?type=timezones` using the fixed endpoint from Task 2.1.

---

## TASK 3: Fix the Apps Module

### 3.1 — Fix `sync_modules.py` to Read All Fields

In `backend/apps/system/services/modules.py`, update the `sync_modules` function to map ALL manifest fields to the model:

```python
obj, created = InstalledModule.objects.update_or_create(
    tenant=tenant,
    technical_name=manifest.get('technical_name') or app_label,
    defaults={
        'name': manifest.get('name', ''),
        'author': manifest.get('author', 'BitGuard'),
        'version': manifest.get('version', '1.0'),
        'category': manifest.get('category', 'Uncategorized'),
        'summary': manifest.get('summary', ''),
        'description': manifest.get('description', ''),
        'icon': manifest.get('icon', 'Box'),
        'depends': manifest.get('depends', []),
        'installable': manifest.get('installable', True),
        'application': manifest.get('application', False),
        'url': manifest.get('url', ''),
        'website': manifest.get('website', ''),       # ← ADD THIS
        'license': manifest.get('license', 'LGPL-3'), # ← ADD THIS
        'featured': manifest.get('featured', False),  # ← ADD THIS
        'screenshots': manifest.get('screenshots', []), # ← ADD THIS
    }
)
```

### 3.2 — Update ALL `__manifest__.py` Files

Add the missing fields to every backend app's manifest. Example for `crm`:

```python
# backend/apps/crm/__manifest__.py
{
    'name': 'CRM',
    'technical_name': 'crm',
    'version': '1.0',
    'author': 'BitGuard',
    'website': 'https://bitguard.io',
    'license': 'LGPL-3',
    'category': 'Sales',
    'summary': 'Manage leads, opportunities, and your sales pipeline.',
    'description': 'Full CRM module with pipeline Kanban, activity tracking, revenue forecasting, and client profiles.',
    'icon': 'Users',
    'url': '/admin/crm',
    'depends': ['system'],
    'installable': True,
    'application': True,
    'featured': True,
    'screenshots': [],
}
```

Apply this same pattern to: `accounting`, `sale`, `purchase`, `stock`, `hr`, `marketing`, `projects`, `helpdesk`, `website`, `pos`, `elearning`, `mrp`, `fleet`, `soc`, `maintenance`, `recruitment`, `appraisals`, `sign`, `delivery`, `rental`, `subscriptions`, `planning`, `appointments`, `timesheets`, `field_service`.

### 3.3 — Make Sidebar Categories Dynamic in `AppStore.jsx`

Replace the hardcoded category list in `menu.js` with a dynamic list derived from the API response. In `AppStore.jsx`, compute the unique categories from the loaded modules and render the sidebar dynamically via a context/hook.

In `menu.js`, remove the hardcoded category links and replace with a placeholder:

```javascript
// frontend/src/apps/apps/config/menu.js
export const appsMenu = [
    {
        title: 'Apps',
        items: [
            { label: 'All Apps', icon: Grid, path: '/admin/apps' },
            { label: 'Theme Modules', icon: Palette, path: '/admin/apps/themes' },
            { label: 'Updates', icon: RefreshCw, path: '/admin/apps/updates' },
        ]
    }
    // Categories section is now rendered DYNAMICALLY by AppStore reading module categories
];
```

Then in `AppStore.jsx`, render a dynamic sidebar section below the static items using `uniqueCategories` computed from the module list.

### 3.4 — Add "Launch App" Button in `AppDetail.jsx`

When a module `is_installed` AND has a non-empty `url` field, display a "Launch App →" button:

```jsx
{mod.is_installed && mod.url && (
    <Link to={mod.url} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-md mt-3">
        <ExternalLink size={20} />
        Launch App
    </Link>
)}
```

### 3.5 — Add Screenshots Carousel in `AppDetail.jsx`

If `mod.screenshots.length > 0`, render a scrollable image carousel above the description:

```jsx
{mod.screenshots && mod.screenshots.length > 0 && (
    <div className="flex gap-4 overflow-x-auto pb-2">
        {mod.screenshots.map((url, i) => (
            <img key={i} src={url} alt={`Screenshot ${i+1}`} 
                 className="rounded-xl border border-slate-700 h-48 object-cover shrink-0" />
        ))}
    </div>
)}
```

### 3.6 — Fix "Updates" Tab in AppStore

The `/updates` route should filter using the `has_update` field from the API (not just `is_installed`):

```javascript
// In filteredModules useMemo:
} else if (location.pathname.endsWith('/updates')) {
    result = result.filter(m => m.has_update === true);
}
```

### 3.7 — Add "Featured" Section to AppStore Homepage

When on the main `/admin/apps` page (no category filter), display a "Featured Apps" grid at the top before the category-grouped listing:

```jsx
{!urlCategory && !pathname.includes('/themes') && !pathname.includes('/updates') && (
    <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Star className="text-amber-400 fill-amber-400" size={18} /> Featured Apps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.filter(m => m.featured && !m.is_installed).map(mod => (
                <AppCard key={mod.id} mod={mod} ... />
            ))}
        </div>
    </div>
)}
```

---

## Files to Create (New)

| File | Purpose |
|---|---|
| `frontend/src/apps/settings/pages/lists/SystemParameters.jsx` | Raw key-value system config editor |
| `backend/apps/board/utils/pdf_export.py` | PDF generation using weasyprint or reportlab |
| `backend/apps/board/utils/xlsx_export.py` | Excel generation using openpyxl |

## Files to Modify (Key Changes Summary)

| File | Change |
|---|---|
| `backend/apps/board/services/analytics.py` | Fix key names, add 13 missing KPI keys |
| `backend/apps/board/api/views.py` | Fix ExportReportView for multi-format |
| `backend/apps/core/api/views.py` | Replace hardcoded config/integrations views |
| `backend/apps/system/api/views.py` | Implement real upgrade() action |
| `backend/apps/system/services/modules.py` | Add website/license/featured/screenshots to sync |
| `frontend/src/apps/board/pages/CommandCenter.jsx` | Fix Restaurant tile, add auto-refresh |
| `frontend/src/apps/board/pages/dashboards/ExecutiveSummary.jsx` | Remove fake arrays, dynamic FY target |
| `frontend/src/apps/settings/pages/settings/GeneralSettings.jsx` | Dynamic timezone dropdown |
| `frontend/src/apps/settings/pages/settings/AutomationsSettings.jsx` | Disable unavailable automations |
| `frontend/src/apps/apps/pages/AppStore.jsx` | Dynamic categories, featured section, fix updates tab |
| `frontend/src/apps/apps/pages/AppDetail.jsx` | Launch App button, screenshots carousel |
| `frontend/src/apps/apps/config/menu.js` | Remove hardcoded categories |
| All `backend/apps/*/\_\_manifest\_\_.py` | Add website, license, featured, screenshots, url fields |

---

## Priority Order for Implementation

1. **P0 (Broken/Critical)**: Fix KPI key mismatches (Dashboard blank tiles) · Fix PDF export (corrupt downloads) · Fix IntegrationsStatus mock (shows wrong connection state)
2. **P1 (High Impact)**: `sync_modules.py` field mapping · All manifest metadata · Dynamic sidebar categories · Launch App button  
3. **P2 (Feature Complete)**: Featured apps section · Screenshots carousel · Updates tab fix · Real upgrade action · System Parameters page
4. **P3 (Enhancement)**: Real-time dashboard refresh · FY target dynamic setting · Developer mode deep integration
