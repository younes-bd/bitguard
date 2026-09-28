# Full Audit: Settings, Core, Auth, Users & Tenants — Tier-1 ERP Realignment

> **Audit Scope:** 5 parallel agents read 40+ files across `system`, `core`, `auth`, `users`, and `tenants` modules — both backend Django and frontend React — covering models, API views, serializers, services, routes, manifests, and frontend service files.

---

## 🔴 FATAL — Runtime Crashes (Fix Immediately)

| # | Location | Issue |
|---|----------|-------|
| F1 | `system/services/system.py` L74,125 | `AuditTrail` used but **never imported** → `NameError` |
| F2 | `system/services/system.py` L178 | `self.model` used but **never set** → `AttributeError` |
| F3 | `system/services/settings.py` + `system.py` | `WebhookEndpoint`, `InstalledModule`, `DatabaseBackup` **imported from wrong module** (`system/domain/models.py` which has none of them) → `ImportError` |
| F4 | `system/api/views.py` L20 | Calls `service.get_setting()` — **method does not exist** on `SettingsService` → `AttributeError` every time email config is loaded |
| F5 | `system/services/settings.py` L51 | `settings_registry` singleton is **never populated** → every `update_setting()` call raises `ValidationError` — **all system setting saves fail** |
| F6 | `users/api/views.py` L150,169 | `get_object_or_404` used but **never imported** → `NameError` crash on invitation endpoints |
| F7 | `auth/services/` | Two competing `AuthService` classes: real implementation in `auth/services.py` (root) is dead; `auth/services/auth.py` is an empty stub. The serializer imports the stub. **`verify_otp` is dead code.** |
| F8 | `users/middleware.py` L19 | **Wrong argument order** in `DeviceService.track_device(request.user, request)` — should be `(request, user)` → silent runtime bug |

---

## 🔴 SECURITY VULNERABILITIES

| # | Location | Issue |
|---|----------|-------|
| S1 | `auth/api/serializers.py` L35-38 | `CustomTokenObtainPairSerializer.validate()` **resets account lock BEFORE checking password** → any attacker knowing a locked account's email can reset the lock counter by attempting login |
| S2 | `core/api/mixins.py` | `TenantScopedMixin` only overrides `get_queryset()`. Missing `perform_create()` override → **tenant-injection attack possible** via POST payload |
| S3 | `users/api/serializers.py` L142,165 | `users` module directly imports `apps.crm.domain.models.Contact` → **CRM Domain Leakage** inside the IAM Layer 2 module |
| S4 | `users/domain/models.py` | `Role`, `SecurityPolicy`, `PersonalAccessToken`, `ActiveSession` do **not inherit `TenantAwareModel`** → roles are globally visible across all tenants |
| S5 | `users/api/views.py` L22-28 | `RoleViewSet.get_queryset()` has **no tenant filtering** → roles from Tenant A are visible to Tenant B |

---

## 🔴 FATAL ARCHITECTURAL INVERSIONS — All 3 Kernel Manifests

> [!CAUTION]
> ALL THREE foundational module manifests declare `depends: ['system']`. This means the Kernel (Layer 1) depends on a Business Plugin (Layer 3). This completely inverts the dependency hierarchy. Correct direction: Plugins depend on the Kernel, never the reverse.

| Module | Current (WRONG) | Correct |
|--------|-----------------|---------|
| `core/__manifest__.py` | `depends: ['system']` | `depends: []` |
| `auth/__manifest__.py` | `depends: ['system']` | `depends: ['core']` |
| `tenants/__manifest__.py` | `depends: ['system']` | `depends: ['core']` |
| `users/__manifest__.py` | `depends: ['system']` | `depends: ['core', 'tenants']` |

---

## 🟠 Critical Blockers

| # | Location | Issue |
|---|----------|-------|
| B1 | `system/api/sed5Lq7JO` | **29KB mystery dead file** (no extension) in `system/api/` — No-Clutter Law violation |
| B2 | `system/services/` | **Two `SettingsService` classes** in `settings.py` and `system.py` — abandoned incomplete refactor |
| B3 | `system/apps.py` | `ready()` never connects `signals.py` — signal receivers **never fire** |
| B4 | `tenants/domain/models.py` | **Missing critical `Tenant` fields**: `from_email` (used in auth but doesn't exist → AttributeError), `timezone`, `currency`, `language`, `slug`, `trial_ends_at`, `max_users`, `is_trial` |
| B5 | `tenants/services/tenants.py` | `TenantsService` is a **completely empty stub** — all business logic sits directly in the ViewSet (Fat View violation) |
| B6 | `core/domain/models.py` | `Company` model missing fields used by frontend: `language`, `multi_company`, `inter_company_transactions` → silent data loss on every form save |
| B7 | `auth/api/urls.py` | `/auth/register/` endpoint **does not exist** — `authService.js` calls it → 404 on every registration |
| B8 | `core/api/serializers.py` L55 | `AutomatedAction` imported from `apps.automation` in the **Kernel** → Domain Leakage |
| B9 | `core/domain/models.py` | `models.py.new` and `models_bak.py` backup files exist (45KB + 23KB) → No-Clutter violation |
| B10 | `auth/model/authStore.js` | Uses `zustand` — **stack violation** (architecture mandates React Context API). Also a completely empty stub. |

---

## 🟡 High-Priority Issues

| # | Location | Issue |
|---|----------|-------|
| H1 | `settingsService.js` | `getSystemStatus()` returns **hardcoded mock** `Promise.resolve({overallStatus: 'Operational'})` — always lies |
| H2 | `coreService.js` | `getScheduledRegistry()` calls `/core/scheduled-registry/` — **endpoint does not exist** → always 404 |
| H3 | `users/authentication.py` | **6 `print()` statements** — leaks every authentication event to stdout in production |
| H4 | `users/services/users.py` L86 | `print()` in email service — leaks email errors to stdout |
| H5 | `Currency.code = unique=True` globally | Multi-tenant violation: should be `unique_together = ('tenant', 'code')` |
| H6 | `usersService.js` L166 | `revokeSession` calls wrong URL `users/${id}/session_revoke/` — backend expects `users/sessions/{jti}/` DELETE |
| H7 | `users/config/menu.js` | Only 3 of 13+ pages are in the sidebar — Audit, MFA, Sessions, Access Rights, Record Rules, Security Policy are all unreachable from navigation |
| H8 | `company.py` service | Race condition: `filter().first()` + `create()` is not atomic → use `get_or_create()` |
| H9 | `users/__manifest__.py` | Duplicate `category` key, `installable: False` (should be `True`), wrong `odoo_equivalent` |
| H10 | `GeneralSettingsPage.jsx` | Multiple `console.error()` calls, Loader uses off-palette `text-purple-500` |

---

## What Works Well ✅

- Auth gateway is clean and secure (login, logout, OTP, password reset flows)
- `users/domain/models.py` is very rich — Role, RolePermission, RecordRule, SecurityPolicy, OTP, Device, LoginActivity, ActiveSession, TenantMembership, PersonalAccessToken all present
- AuditService integration is thorough throughout
- Anti-email-enumeration on password reset is correctly implemented
- Registry pattern for API routing is correctly applied across all modules
- Frontend `usersService.js` is comprehensive — covers 30+ endpoints
- `settingsRoutes.jsx` naming is correct for the Host/Plugin injection pattern
- Chatter system (RecordMessage, RecordActivity, RecordFollower, FieldChangeLog) is architecturally excellent
- Dual Registry pattern (Backend KPI + Frontend Vite glob) is correctly applied

---

## Implementation Plan — 20 Tasks

---

### 🏗️ PHASE 1: Kernel Fixes (No features, just keeping the lights on)

#### TASK 1: Fix All Manifest Dependency Inversions
- `core/__manifest__.py`: `depends: []`
- `auth/__manifest__.py`: `depends: ['core']`
- `tenants/__manifest__.py`: `depends: ['core']`
- `users/__manifest__.py`: `depends: ['core', 'tenants']`; fix duplicate `category` key; set `installable: True`

#### TASK 2: Fix `TenantScopedMixin` Missing `perform_create()`
**File:** `backend/apps/core/api/mixins.py`
Add after `get_queryset()`:
```python
def perform_create(self, serializer):
    tenant = getattr(self.request, 'tenant', None)
    if tenant:
        serializer.save(tenant=tenant)
    else:
        serializer.save()
```

#### TASK 3: Fix Company + SystemParameter + Currency Models
**File:** `backend/apps/core/domain/models.py`
- Add to `Company`: `language`, `multi_company`, `inter_company_transactions`
- Add to `SystemParameter`: `is_public`
- Delete `models.py.new` and `models_bak.py`

**File:** `backend/apps/core/domain/currency_models.py`
- Add to `Currency`: `is_active`, `decimal_places`
- Change `unique=True` → `unique_together = ('tenant', 'code')`

Run: `makemigrations core && migrate`

#### TASK 4: Fix Missing Tenant Model Fields
**File:** `backend/apps/tenants/domain/models.py`
Add to `Tenant`: `from_email`, `timezone`, `language`, `slug` (unique), `trial_ends_at`, `max_users`, `is_trial`

Run: `makemigrations tenants && migrate`

#### TASK 5: Remove Domain Leakage from Core Serializers
**File:** `backend/apps/core/api/serializers.py`
- Remove `AutomatedActionSerializer` and its `from apps.automation...` import
- Replace `fields = '__all__'` with explicit field lists on `BankAccountSerializer` and `CurrencySerializer`

---

### 🏗️ PHASE 2: Auth & Users Fixes

#### TASK 6: Fix AuthService Dual-Definition
1. Delete `backend/apps/auth/services.py` (root-level — dead code)
2. Move `verify_otp()` logic into `backend/apps/auth/services/auth.py`
3. Update `backend/apps/auth/services/__init__.py` to export `AuthService` properly

#### TASK 7: Fix Login Security Vulnerability
**File:** `backend/apps/auth/api/serializers.py`
- Remove account lock reset code (lines 35–38) from the **beginning** of `validate()`
- Move the `is_locked = False, failed_login_attempts = 0` reset to AFTER successful `super().validate()` call

#### TASK 8: Fix Users Module IAM
**File:** `backend/apps/users/api/views.py`
- Add `from django.shortcuts import get_object_or_404` at the top
- Fix `UserViewSet.get_queryset()` — use `TenantMembership.objects.filter(tenant=tenant)` to get user IDs, then return `User.objects.filter(pk__in=user_ids)`
- Add `standard_response` import and use it in `invite` action
- Fix `RoleViewSet.get_queryset()` to filter by tenant via `TenantMembership`

**File:** `backend/apps/users/api/serializers.py`
- Remove `from apps.crm.domain.models import Contact` import (Domain Leakage)
- Remove Contact creation/linking from `create()` and `update()` — replace with a post_save signal dispatched to CRM
- Add `category` and `implied_ids` to `RoleSerializer` fields

**File:** `backend/apps/users/middleware.py`
- Fix argument order: `DeviceService.track_device(request, request.user)`

#### TASK 9: Fix Auth Backend Debug Prints
**Files:** `backend/apps/users/authentication.py`, `backend/apps/users/services/users.py`
- Replace all `print()` calls with `import logging; logger = logging.getLogger(__name__); logger.warning(...)` or `logger.error(...)`

#### TASK 10: Add `/auth/register/` Endpoint OR Remove Frontend Call
**Option A (Recommended):** Create a `RegisterView` in `backend/apps/auth/api/views.py` that delegates to `IdentityService.create_user()`. Register at `backend/apps/auth/api/urls.py` as `register/`.
**Option B:** Remove the `authService.register()` call from the frontend and remove the Register page if it's not needed.

---

### 🏗️ PHASE 3: System Module Fixes

#### TASK 11: Consolidate SettingsService + Fix Fatal Crashes
1. **DELETE** `backend/apps/system/services/system.py` (5 runtime crashes)
2. **DELETE** `backend/apps/system/api/sed5Lq7JO` (dead file)
3. **Fix** `backend/apps/system/services/settings.py`:
   - Add `get_setting(key, default='', tenant=None)` method
   - Fix all broken imports (`WebhookEndpoint`, `DatabaseBackup`)
   - Add `register_defaults()` to populate the settings registry
   - Fix `get_system_metrics()` to import `AuditTrail` at function level
4. **Fix** `backend/apps/system/services/__init__.py` to export correctly

#### TASK 12: Fix system/apps.py
Add to `ready()`:
```python
import apps.system.signals  # noqa
from apps.system.services.settings import SettingsService
SettingsService().register_defaults()
```

#### TASK 13: Add WebhookEndpoint Model + API
**New model** in `backend/apps/system/domain/models.py`: `WebhookEndpoint` (name, url, events, is_active, secret_token, last_triggered_at, last_status_code)
**New ViewSet** in `backend/apps/system/api/views.py`: `WebhookEndpointViewSet` with `test` action
**New serializer** in `backend/apps/system/api/serializers.py`: `WebhookEndpointSerializer`
**Register** in `backend/apps/system/api/urls.py`
Run: `makemigrations system && migrate`

#### TASK 14: Implement TenantsService
**File:** `backend/apps/tenants/services/tenants.py`
Extract `switch()`, `create()` business logic from `TenantViewSet` into `TenantsService`. Views call service methods.

---

### 🏗️ PHASE 4: Master Data (Production-Ready)

#### TASK 15: Production Master Data Seeder
**File:** `backend/apps/core/management/commands/seed_master_data.py`
Replace stub with full ISO dataset:
- 30+ currencies (ISO 4217: USD, EUR, GBP, JPY, CNY, TWD, KRW, HKD, SGD, AUD, CAD, CHF, INR, and 20+ more)
- 37+ countries (ISO 3166-1 with phone codes)
- States: ALL US states (50+DC), ALL Canadian provinces (13), ALL Taiwan municipalities (22), German Bundesländer (16), Australian territories (8), UK nations (4), French regions (13), top Japanese prefectures (10)
- All seeded with `tenant=None`, using `get_or_create` for idempotency

---

### 🏗️ PHASE 5: Frontend Pages & Fixes

#### TASK 16: New Full-Featured Pages
- **`CurrenciesPage.jsx`** (replace stub): Full CRUD — list, toggle active, set base, add/edit/delete modal
- **`WebhooksPage.jsx`** (new): Full CRUD — list, create/edit modal, delete, test button
- **`webhookService.js`** (new): API service file

#### TASK 17: IAM Pages (Users Module)
- **`AccessRightsPage.jsx`** (new): Two-panel roles + permissions management
- **`RecordRulesPage.jsx`** (new): Record rules CRUD
- **`UserGroupsPage.jsx`** (new): Visual role membership manager
- **`roleService.js`**: Add role, permission, record-rule methods
- **`settingsRoutes.jsx`** (create if not exists): Host/Plugin route registration

#### TASK 18: Register All Routes
**`settingsAdminRoutes.jsx`**: Add `currencies`, `webhooks` routes
**`users/routes/settingsRoutes.jsx`**: Must export `access-rights`, `record-rules`, `groups` routes
**Note:** Move `AuditLogList` from `core/components/` to `system/components/` if the Kernel UI violation is confirmed

#### TASK 19: Fix Frontend Bugs
- `coreService.js`: Fix `getScheduledRegistry()` → `getScheduledActions()`, fix `getStates()` params
- `settingsService.js`: Fix `getSystemStatus()` mock → real API call
- `GeneralSettingsPage.jsx`: Add `language`, `multi_company` fields; fix `console.error()` calls; fix loader color
- `SecurityPolicyPage.jsx`: Fix `'default'` PK fallback; fix loader color
- `usersService.js`: Fix `revokeSession` URL to match backend

#### TASK 20: Complete users/config/menu.js
Add navigation entries for all implemented pages: Audit Logs, MFA Management, Personal Access Tokens, Active Sessions, Access Rights, Record Rules, Security Policy, etc.

---

## Verification Plan

```bash
# Django system check — must return 0 errors
python manage.py check

# Run all migrations
python manage.py migrate

# Run production seeder
python manage.py seed_master_data

# Verify master data counts
python manage.py shell -c "
from apps.core.domain.models import Country, State
from apps.core.domain.currency_models import Currency
print('Countries:', Country.all_objects.count())
print('States:', State.all_objects.count())
print('Currencies:', Currency.all_objects.count())
"
```

**Manual checks:**
1. `/admin/settings/general` — all dropdowns populated, save works
2. `/admin/settings/currencies` — full CRUD, not stub
3. `/admin/settings/webhooks` — full CRUD with test button
4. `/admin/settings/access-rights` — roles + permissions UI works
5. `/admin/settings/record-rules` — CRUD works
6. `/admin/settings/groups` — group membership works
7. Email config page loads without `AttributeError`
8. Any setting save works without `ValidationError`
9. Login flow — account lock is NOT reset before password check
10. Sidebar navigation — all 13+ pages reachable

---

---

# 🤖 Complete AI Implementation Prompt

> **Copy the entire block below as a new task to your AI coding agent.** It is a fully self-contained, ordered set of instructions that can be executed independently without reading this document.

---

```
You are a Tier-1 ERP Senior Engineer working on BitGuard — a Headless React SPA + Modular Django Monolith.
Execute the following 20 tasks in strict order. Read architecture rules below BEFORE writing any code.

=== ARCHITECTURE RULES (NON-NEGOTIABLE) ===
1. Every Django model MUST inherit from TenantAwareModel (from apps.core.domain.models), except User (which uses TenantMembership for multi-tenancy).
2. Every DRF ViewSet MUST inherit from TenantScopedMixin (from apps.core.api.mixins), EXCEPT master data ViewSets (Country, State, Currency) which define their own get_queryset() using Model.all_objects.filter(Q(tenant=request.user.tenant) | Q(tenant__isnull=True)).
3. Business logic lives in services/ files ONLY. Views call services. Views must be skinny.
4. Frontend API calls use the apiClient wrapper: import client from '@/core/api/client'
5. Icons: ONLY lucide-react. Styling: ONLY Tailwind CSS dark mode.
   - Page bg: bg-slate-950
   - Cards: bg-slate-900 border border-slate-800 rounded-xl p-6
   - Primary button: bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-blue-500/20 transition-all
   - Secondary button: text-slate-300 hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors
   - Success badge: text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-xs font-medium
   - Danger: text-red-400 border-red-500/30 hover:bg-red-500/20
   - Loader: <Loader2 className="animate-spin text-blue-500 w-6 h-6" />
   - Modal backdrop: fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50
   - Modal container: bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg
6. No window.location.reload(). Refresh data by calling fetch functions again.
7. All route-level page components MUST have the Page suffix (e.g., CurrenciesPage, AccessRightsPage).
8. No hardcoded mock data. No console.log/console.error/print() in committed code.

=== ROOT PATHS ===
Backend: c:/Users/youne/Desktop/2-InfoTech/website/website13/backend/
Frontend src: c:/Users/youne/Desktop/2-InfoTech/website/website13/frontend/src/

=====================================================================
TASK 1: FIX ALL MANIFEST DEPENDENCY INVERSIONS
=====================================================================
These are FATAL architectural violations. Fix all 4 files:

File: backend/apps/core/__manifest__.py
  Change: 'depends': ['system']   →   'depends': []

File: backend/apps/auth/__manifest__.py
  Change: 'depends': ['system']   →   'depends': ['core']
  Also change: 'url': '/admin/auth'  →  'url': ''  (Kernel has no admin URL)

File: backend/apps/tenants/__manifest__.py
  Change: 'depends': ['system']   →   'depends': ['core']
  Also change: 'url': '/admin/tenants'  →  'url': ''

File: backend/apps/users/__manifest__.py
  Change: 'depends': ['system']   →   'depends': ['core', 'tenants']
  Also fix the duplicate 'category' key (remove the second occurrence on line ~10)
  Also change: 'installable': False  →  'installable': True

File: backend/apps/system/__manifest__.py
  Change: 'depends': []   →   'depends': ['core', 'users', 'tenants']

=====================================================================
TASK 2: FIX TenantScopedMixin perform_create
=====================================================================
File: backend/apps/core/api/mixins.py
Add this method to TenantScopedMixin (after get_queryset):

    def perform_create(self, serializer):
        tenant = getattr(self.request, 'tenant', None)
        if tenant:
            serializer.save(tenant=tenant)
        else:
            serializer.save()

=====================================================================
TASK 3: FIX COMPANY + SYSTEMPARAMETER MODELS
=====================================================================
File: backend/apps/core/domain/models.py

In the Company class (after the `parent` field), add:
    language = models.CharField(max_length=10, default='en',
        help_text="Default language code, e.g. en, fr, zh-TW")
    multi_company = models.BooleanField(default=False,
        help_text="Enable multi-company features for this workspace")
    inter_company_transactions = models.BooleanField(default=False,
        help_text="Allow inter-company invoicing and transfers")

In SystemParameter class (after `is_system`), add:
    is_public = models.BooleanField(default=False,
        help_text="If True, can be read by unauthenticated endpoints")

Delete these two files if they exist (backup artifacts, No-Clutter violation):
    backend/apps/core/domain/models.py.new
    backend/apps/core/domain/models_bak.py

Then run: python manage.py makemigrations core && python manage.py migrate

=====================================================================
TASK 4: FIX CURRENCY MODEL
=====================================================================
File: backend/apps/core/domain/currency_models.py

In the Currency class:
1. Change: code = models.CharField(max_length=3, unique=True)
   To:     code = models.CharField(max_length=3)
2. Add after `is_base`:
    is_active = models.BooleanField(default=True)
    decimal_places = models.IntegerField(default=2)
3. Add to class Meta:
    unique_together = ('tenant', 'code')

Then run: python manage.py makemigrations core && python manage.py migrate

=====================================================================
TASK 5: FIX TENANT MODEL MISSING FIELDS
=====================================================================
File: backend/apps/tenants/domain/models.py

In the Tenant class, add these fields:
    from_email = models.EmailField(blank=True,
        help_text="Default sender email for this tenant's outgoing mail")
    slug = models.SlugField(max_length=100, unique=True, blank=True,
        help_text="URL-safe identifier for this tenant")
    timezone = models.CharField(max_length=100, default='UTC',
        help_text="Default timezone for this tenant's users")
    language = models.CharField(max_length=10, default='en',
        help_text="Default language code for this tenant")
    is_trial = models.BooleanField(default=False)
    trial_ends_at = models.DateTimeField(null=True, blank=True)
    max_users = models.IntegerField(default=10,
        help_text="Maximum number of active users for this plan")

Also override save() to auto-generate slug from name if not set:
    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.name)[:100]
        super().save(*args, **kwargs)

Then run: python manage.py makemigrations tenants && python manage.py migrate

=====================================================================
TASK 6: FIX AUTH SERVICE DUAL-DEFINITION
=====================================================================
1. DELETE the file: backend/apps/auth/services.py  (root-level — this is dead code)

2. Open: backend/apps/auth/services/auth.py
   Replace the empty stub with the actual AuthService implementation.
   The class must contain at minimum:
   
   class AuthService(BaseService):
       @classmethod
       def verify_otp(cls, user, otp_code):
           """Verify an OTP code for a user. Returns True if valid, raises ValidationError if not."""
           from apps.users.domain.models import OTP
           from django.utils import timezone
           from rest_framework.exceptions import ValidationError
           
           otp = OTP.objects.filter(user=user, code=otp_code, is_used=False).order_by('-created_at').first()
           if not otp:
               raise ValidationError("Invalid or expired OTP code.")
           if otp.expires_at and otp.expires_at < timezone.now():
               raise ValidationError("OTP has expired.")
           otp.is_used = True
           otp.save(update_fields=['is_used'])
           return True

3. Open: backend/apps/auth/services/__init__.py
   Ensure it exports: from .auth import AuthService

=====================================================================
TASK 7: FIX LOGIN SECURITY VULNERABILITY
=====================================================================
File: backend/apps/auth/api/serializers.py

In CustomTokenObtainPairSerializer.validate(), the code currently:
  1. Resets is_locked and failed_login_attempts
  2. Then calls super().validate()

This allows any attacker to reset a locked account's counter by attempting login.

Fix: Move the lock reset AFTER the super().validate() call succeeds:
  1. Call super().validate(attrs) FIRST (will raise AuthenticationFailed if wrong password)
  2. THEN reset is_locked=False, failed_login_attempts=0 on success

Also remove the dead import at the top of the file:
  Remove: from apps.users.domain.models import SecurityPolicy
  (SecurityPolicy is imported but never used in this file)

=====================================================================
TASK 8: FIX USERS API RUNTIME CRASHES
=====================================================================
File: backend/apps/users/api/views.py

1. Add at the top of the file:
   from django.shortcuts import get_object_or_404

2. Fix UserViewSet.get_queryset() — User has no direct `tenant` FK, use TenantMembership:
   def get_queryset(self):
       user = self.request.user
       if user.is_superuser:
           return User.objects.all().select_related('partner').prefetch_related('roles')
       tenant = getattr(self.request, 'tenant', None)
       if not tenant:
           return User.objects.none()
       user_ids = TenantMembership.objects.filter(
           tenant=tenant, is_active=True
       ).values_list('user_id', flat=True)
       return User.objects.filter(pk__in=user_ids).select_related('partner').prefetch_related('roles')

3. Fix RoleViewSet.get_queryset() — add tenant filtering via TenantMembership:
   def get_queryset(self):
       tenant = getattr(self.request, 'tenant', None)
       if self.request.user.is_superuser:
           return Role.objects.all()
       if tenant:
           return Role.objects.filter(tenant=tenant)
       return Role.objects.none()

4. Remove CRM Domain Leakage from users/api/serializers.py:
   - Remove: from apps.crm.domain.models import Contact
   - Remove all Contact.objects.create/update logic from UserSerializer.create() and update()
   - Replace with: a comment noting that CRM integration is handled via signals in the crm module

5. Fix: users/middleware.py line 19
   Change: DeviceService.track_device(request.user, request)
   To:     DeviceService.track_device(request, request.user)

=====================================================================
TASK 9: REMOVE ALL DEBUG PRINT STATEMENTS
=====================================================================
Files to fix:
  - backend/apps/users/authentication.py: Replace all 6 print() calls with logger calls
  - backend/apps/users/services/users.py: Replace print() on line ~86 with logger call

At the top of each fixed file, add:
    import logging
    logger = logging.getLogger(__name__)

Replace each print() pattern:
  print(f"Error: {e}")  →  logger.error("Error message: %s", e)
  print(f"Info: {x}")  →  logger.info("Info message: %s", x)

=====================================================================
TASK 10: CONSOLIDATE SETTINGSSERVICE
=====================================================================
1. DELETE: backend/apps/system/services/system.py  (abandoned duplicate with 5 runtime crashes)
2. DELETE: backend/apps/system/api/sed5Lq7JO  (mystery dead file)

3. Open: backend/apps/system/services/settings.py
   Add these methods to SettingsService class:

   def get_setting(self, key, default='', tenant=None):
       """Retrieve a single setting value by key."""
       try:
           return self.model.objects.get(key=key, tenant=tenant).value
       except self.model.DoesNotExist:
           return default

   def register_defaults(self):
       """Populate the settings registry with all valid system setting keys."""
       from apps.system.registry import settings_registry
       default_keys = [
           ('smtp_host', 'SMTP server hostname'),
           ('smtp_port', 'SMTP server port (default: 587)'),
           ('smtp_user', 'SMTP authentication username'),
           ('smtp_password', 'SMTP authentication password'),
           ('use_tls', 'Use TLS/STARTTLS for SMTP (true/false)'),
           ('default_sender', 'Default From email address'),
           ('maintenance_mode', 'Platform maintenance mode toggle (true/false)'),
           ('twilio_account_sid', 'Twilio Account SID for SMS'),
           ('twilio_auth_token', 'Twilio Auth Token'),
           ('twilio_phone_number', 'Twilio sender phone number'),
           ('stripe_secret_key', 'Stripe secret API key'),
           ('stripe_publishable_key', 'Stripe publishable API key'),
           ('web_base_url', 'Base public URL of the platform'),
           ('audit_log_retention_days', 'Days to retain audit logs (default: 90)'),
       ]
       for key, description in default_keys:
           if not settings_registry.get(key):
               settings_registry.register(key, description=description)

   Fix the broken model imports in get_system_metrics (line ~84):
   Change: from apps.system.domain.models import InstalledModule, WebhookEndpoint, DatabaseBackup
   To:     from apps.core.domain.models import InstalledModule, DatabaseBackup
           from apps.system.domain.models import WebhookEndpoint

   Ensure AuditTrail is imported at the top of the file (add if missing):
   from apps.core.domain.models import AuditTrail

4. Open: backend/apps/system/services/__init__.py
   Replace its content with:
       from .settings import SettingsService
       __all__ = ['SettingsService']

=====================================================================
TASK 11: FIX system/apps.py SIGNALS + REGISTRY
=====================================================================
File: backend/apps/system/apps.py

In the ready() method, add after _register_api_routes():
    # Connect signals
    try:
        import apps.system.signals  # noqa: F401
    except ImportError:
        pass
    # Populate settings key registry
    from apps.system.services.settings import SettingsService
    SettingsService().register_defaults()

=====================================================================
TASK 12: ADD WebhookEndpoint MODEL + API
=====================================================================
File: backend/apps/system/domain/models.py
Add after IntegrationKey class (the TenantAwareModel import already exists):

class WebhookEndpoint(TenantAwareModel):
    COMMON_EVENTS = [
        ('order.created', 'Order Created'),
        ('invoice.paid', 'Invoice Paid'),
        ('user.created', 'User Created'),
        ('module.installed', 'Module Installed'),
        ('tenant.created', 'Company Created'),
        ('lead.converted', 'Lead Converted'),
    ]
    name = models.CharField(max_length=255)
    url = models.URLField(help_text="HTTPS endpoint to receive webhook payloads")
    events = models.JSONField(default=list, help_text="List of subscribed event type strings")
    is_active = models.BooleanField(default=True)
    secret_token = models.CharField(max_length=128, blank=True,
        help_text="HMAC-SHA256 secret for payload signing (leave blank to disable signing)")
    last_triggered_at = models.DateTimeField(null=True, blank=True)
    last_status_code = models.IntegerField(null=True, blank=True)

    class Meta:
        verbose_name = "Webhook Endpoint"
        verbose_name_plural = "Webhook Endpoints"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} → {self.url}"

Run: python manage.py makemigrations system && python manage.py migrate

File: backend/apps/system/api/serializers.py
Add:
    from apps.system.domain.models import IntegrationKey, WebhookEndpoint

    class WebhookEndpointSerializer(serializers.ModelSerializer):
        class Meta:
            model = WebhookEndpoint
            fields = ['id', 'name', 'url', 'events', 'is_active', 'secret_token',
                      'last_triggered_at', 'last_status_code', 'created_at', 'updated_at']
            read_only_fields = ['id', 'created_at', 'updated_at', 'last_triggered_at', 'last_status_code']

File: backend/apps/system/api/views.py
1. Remove local IsPlatformAdmin class definition
2. Add at top: from apps.core.api.permissions import IsPlatformAdmin
3. Add after IntegrationKeyViewSet:
    class WebhookEndpointViewSet(TenantScopedMixin, viewsets.ModelViewSet):
        permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]
        serializer_class = WebhookEndpointSerializer

        def get_queryset(self):
            return super().get_queryset()

        @action(detail=True, methods=['post'])
        def test(self, request, pk=None):
            webhook = self.get_object()
            service = SettingsService()
            try:
                status_code = service.test_webhook(webhook)
                return Response({'status': 'success', 'status_code': status_code})
            except Exception as e:
                return Response({'status': 'error', 'message': str(e)}, status=500)

Add WebhookEndpointSerializer to imports at top of views.py.

File: backend/apps/system/api/urls.py
Add: router.register(r'webhooks', WebhookEndpointViewSet, basename='webhook')

=====================================================================
TASK 13: VERIFY IAM API IN USERS MODULE
=====================================================================
Check backend/apps/users/api/views.py for RoleViewSet, RolePermissionViewSet, RecordRuleViewSet.
If they already exist, verify they are correctly registered in urls.py.
If any is missing, add them (they should be present per prior audit).

Check backend/apps/users/api/urls.py — verify these are registered:
    router.register(r'roles', RoleViewSet, basename='role')
    router.register(r'role-permissions', RolePermissionViewSet, basename='role-permission')
    router.register(r'record-rules', RecordRuleViewSet, basename='record-rule')

=====================================================================
TASK 14: ADD /auth/register/ ENDPOINT
=====================================================================
File: backend/apps/auth/api/views.py
Add a RegisterView that creates a new user:

    class RegisterView(generics.CreateAPIView):
        permission_classes = [AllowAny]
        
        def post(self, request):
            from apps.users.services.users import IdentityService
            from rest_framework.exceptions import ValidationError
            data = request.data
            required = ['email', 'password', 'first_name', 'last_name']
            for field in required:
                if not data.get(field):
                    raise ValidationError({field: f'{field} is required.'})
            try:
                user = IdentityService.create_user(
                    email=data['email'],
                    password=data['password'],
                    first_name=data['first_name'],
                    last_name=data['last_name'],
                    tenant=getattr(request, 'tenant', None),
                )
                return Response({'success': True, 'message': 'Account created. Please verify your email.'}, 
                              status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'success': False, 'message': str(e)}, status=400)

File: backend/apps/auth/api/urls.py
Add: path('register/', RegisterView.as_view(), name='register'),

=====================================================================
TASK 15: PRODUCTION MASTER DATA SEEDER
=====================================================================
Replace the entire content of backend/apps/core/management/commands/seed_master_data.py

The new seeder must:
1. Use get_or_create for ALL records (idempotent — safe to run multiple times)
2. Use tenant=None for ALL master data records (global, available to all tenants)
3. Import Country, State from apps.core.domain.models and Currency from apps.core.domain.currency_models

CURRENCIES (create with code, name, symbol, is_active=True, decimal_places, is_base=False):
[('USD','US Dollar','$',2), ('EUR','Euro','€',2), ('GBP','British Pound','£',2),
('JPY','Japanese Yen','¥',0), ('CNY','Chinese Yuan Renminbi','¥',2),
('HKD','Hong Kong Dollar','HK$',2), ('TWD','New Taiwan Dollar','NT$',0),
('KRW','South Korean Won','₩',0), ('SGD','Singapore Dollar','S$',2),
('AUD','Australian Dollar','A$',2), ('CAD','Canadian Dollar','C$',2),
('CHF','Swiss Franc','Fr',2), ('INR','Indian Rupee','₹',2),
('MXN','Mexican Peso','MX$',2), ('BRL','Brazilian Real','R$',2),
('ZAR','South African Rand','R',2), ('AED','UAE Dirham','د.إ',2),
('SAR','Saudi Riyal','﷼',2), ('NOK','Norwegian Krone','kr',2),
('SEK','Swedish Krona','kr',2), ('DKK','Danish Krone','kr',2),
('PLN','Polish Złoty','zł',2), ('CZK','Czech Koruna','Kč',2),
('HUF','Hungarian Forint','Ft',0), ('RUB','Russian Ruble','₽',2),
('TRY','Turkish Lira','₺',2), ('MYR','Malaysian Ringgit','RM',2),
('THB','Thai Baht','฿',2), ('PHP','Philippine Peso','₱',2),
('IDR','Indonesian Rupiah','Rp',0), ('VND','Vietnamese Dong','₫',0),
('NZD','New Zealand Dollar','NZ$',2), ('ILS','Israeli New Shekel','₪',2),
('EGP','Egyptian Pound','E£',2), ('NGN','Nigerian Naira','₦',2)]

COUNTRIES (create with name, code, phone_code):
[('Taiwan','TW','+886'), ('United States','US','+1'), ('United Kingdom','GB','+44'),
('France','FR','+33'), ('Germany','DE','+49'), ('Japan','JP','+81'),
('China','CN','+86'), ('Hong Kong','HK','+852'), ('Singapore','SG','+65'),
('Australia','AU','+61'), ('Canada','CA','+1'), ('South Korea','KR','+82'),
('India','IN','+91'), ('Brazil','BR','+55'), ('Mexico','MX','+52'),
('Netherlands','NL','+31'), ('Sweden','SE','+46'), ('Norway','NO','+47'),
('Denmark','DK','+45'), ('Switzerland','CH','+41'), ('Italy','IT','+39'),
('Spain','ES','+34'), ('Poland','PL','+48'), ('South Africa','ZA','+27'),
('UAE','AE','+971'), ('Saudi Arabia','SA','+966'), ('Malaysia','MY','+60'),
('Thailand','TH','+66'), ('Indonesia','ID','+62'), ('Philippines','PH','+63'),
('Vietnam','VN','+84'), ('New Zealand','NZ','+64'), ('Portugal','PT','+351'),
('Belgium','BE','+32'), ('Austria','AT','+43'), ('Russia','RU','+7'),
('Turkey','TR','+90'), ('Egypt','EG','+20'), ('Nigeria','NG','+234'),
('Israel','IL','+972')]

TAIWAN (TW) states — ALL 22 municipalities (code, name):
[('TPE','Taipei City'), ('NWT','New Taipei City'), ('TXG','Taichung City'),
('TNN','Tainan City'), ('KHH','Kaohsiung City'), ('TAO','Taoyuan City'),
('KEE','Keelung City'), ('HSZ','Hsinchu City'), ('CYI','Chiayi City'),
('HSQ','Hsinchu County'), ('MIH','Miaoli County'), ('CHA','Changhua County'),
('NAN','Nantou County'), ('YUN','Yunlin County'), ('CHQ','Chiayi County'),
('PIF','Pingtung County'), ('ILA','Yilan County'), ('HUA','Hualien County'),
('TTT','Taitung County'), ('PEH','Penghu County'), ('KIN','Kinmen County'),
('LJH','Lienchiang County')]

US states — all 50 + DC (standard 2-letter codes)

CANADA provinces — all 13:
[('ON','Ontario'), ('QC','Quebec'), ('BC','British Columbia'), ('AB','Alberta'),
('MB','Manitoba'), ('SK','Saskatchewan'), ('NS','Nova Scotia'),
('NB','New Brunswick'), ('NL','Newfoundland and Labrador'),
('PE','Prince Edward Island'), ('NT','Northwest Territories'),
('NU','Nunavut'), ('YT','Yukon')]

AUSTRALIA territories — all 8:
[('NSW','New South Wales'), ('VIC','Victoria'), ('QLD','Queensland'),
('WA','Western Australia'), ('SA','South Australia'), ('TAS','Tasmania'),
('ACT','Australian Capital Territory'), ('NT','Northern Territory')]

UK — 4 nations:
[('ENG','England'), ('SCT','Scotland'), ('WLS','Wales'), ('NIR','Northern Ireland')]

Germany — all 16 Bundesländer:
[('BW','Baden-Württemberg'), ('BY','Bavaria'), ('BE','Berlin'), ('BB','Brandenburg'),
('HB','Bremen'), ('HH','Hamburg'), ('HE','Hesse'), ('MV','Mecklenburg-Vorpommern'),
('NI','Lower Saxony'), ('NW','North Rhine-Westphalia'), ('RP','Rhineland-Palatinate'),
('SL','Saarland'), ('SN','Saxony'), ('ST','Saxony-Anhalt'),
('SH','Schleswig-Holstein'), ('TH','Thuringia')]

At the end, print summary:
print(f"✅ Seeded {currency_count} currencies, {country_count} countries, {state_count} states/provinces")

=====================================================================
TASK 16: CurrenciesPage — Full CRUD
=====================================================================
File: frontend/src/apps/system/pages/lists/CurrenciesPage.jsx
Replace the 6-line stub with a full implementation.

Fetch: GET /api/v1/core/currencies/ via currencyService (in frontend/src/apps/core/api/currencyService.js)
The currencyService should have:
  getAll: () => client.get('core/currencies/')
  create: (data) => client.post('core/currencies/', data)
  update: (id, data) => client.patch(`core/currencies/${id}/`, data)
  delete: (id) => client.delete(`core/currencies/${id}/`)

Table columns: Code | Name | Symbol | Decimal Places | Status | Base | Actions
- Status: Active badge (emerald) / Inactive badge (slate)
- Base: ⭐ star icon if is_base is true
- Actions: Toggle Active button | Set as Base button (hidden if already base) | Delete button

Top toolbar: search/filter input on left, "Add Currency" button on right

"Add Currency" modal fields:
  - Code: text input (auto-uppercase on change, max 3 chars)
  - Name: text input
  - Symbol: text input
  - Decimal Places: number input (default: 2, min: 0, max: 4)
  - Is Active: toggle switch (default: true)

After any create/update/delete: re-fetch the list (no page reload)
Show toast on success/failure

=====================================================================
TASK 17: WebhooksPage — Full CRUD
=====================================================================
First, create the service file:
File: frontend/src/apps/system/api/webhookService.js
Content:
    import client from '@/core/api/client';
    export const webhookService = {
        getAll: () => client.get('system/webhooks/'),
        create: (data) => client.post('system/webhooks/', data),
        update: (id, data) => client.patch(`system/webhooks/${id}/`, data),
        delete: (id) => client.delete(`system/webhooks/${id}/`),
        test: (id) => client.post(`system/webhooks/${id}/test/`),
    };

Then create: frontend/src/apps/system/pages/lists/WebhooksPage.jsx

Table columns: Name | URL (truncated to 40 chars) | Events (colored tag badges) | Status | Last Triggered | Actions
- Actions per row: Edit (pencil icon), Test (zap icon), Delete (trash icon)
- Test button: calls webhookService.test(id), shows toast with result:
    success: "✅ Webhook responded with status 200"
    error: "❌ Webhook test failed: [error message]"

Create/Edit modal fields:
  - Name: text input
  - URL: url input (must start with https://)
  - Events: checkboxes (order.created, invoice.paid, user.created, module.installed, tenant.created, lead.converted)
  - Secret Token: text input (placeholder "Leave blank to disable payload signing")
  - Is Active: toggle switch

Delete: confirmation before deleting ("Are you sure you want to delete this webhook?")

=====================================================================
TASK 18: AccessRightsPage — Roles & Permissions
=====================================================================
File: frontend/src/apps/users/api/roleService.js
Create with these methods:
    import client from '@/core/api/client';
    export const roleService = {
        getRoles: () => client.get('users/roles/'),
        createRole: (data) => client.post('users/roles/', data),
        updateRole: (id, data) => client.patch(`users/roles/${id}/`, data),
        deleteRole: (id) => client.delete(`users/roles/${id}/`),
        getPermissions: (roleId) => client.get('users/role-permissions/', { params: { role: roleId } }),
        createPermission: (data) => client.post('users/role-permissions/', data),
        updatePermission: (id, data) => client.patch(`users/role-permissions/${id}/`, data),
        deletePermission: (id) => client.delete(`users/role-permissions/${id}/`),
        getRecordRules: () => client.get('users/record-rules/'),
        createRecordRule: (data) => client.post('users/record-rules/', data),
        updateRecordRule: (id, data) => client.patch(`users/record-rules/${id}/`, data),
        deleteRecordRule: (id) => client.delete(`users/record-rules/${id}/`),
    };

File: frontend/src/apps/users/pages/AccessRightsPage.jsx
Two-panel layout (lg:grid-cols-3 — left is 1 col, right is 2 cols):

LEFT PANEL — "Roles":
  - Fetch from getRoles()
  - Each role displayed as a clickable card: name (bold), description (text-slate-400), "N members" badge
  - Selected role highlighted with border-blue-500 border
  - "New Role" button at top → opens modal with: name (required), description (textarea)
  - Delete button on each card (with confirmation)

RIGHT PANEL — "Permissions for [Role Name]" (shown when a role is selected):
  - Fetch from getPermissions(selectedRole.id)
  - Group by model_name (ContentType)
  - Each model shown as a row: model name | Read toggle | Write toggle | Create toggle | Delete toggle
  - Toggle switch onChange calls updatePermission(perm.id, { can_read: !perm.can_read })  etc.
  - "Add Model" button → small modal with: model_name text input, then the 4 toggles
  - "Remove" button per row (delete the permission record)

If no role selected: show empty state "Select a role on the left to manage its permissions"

=====================================================================
TASK 19: RecordRulesPage + UserGroupsPage
=====================================================================
File: frontend/src/apps/users/pages/RecordRulesPage.jsx
Standard list page with:
  - Fetch getRecordRules()
  - Table: Name | Model | Domain (JSON preview in monospace) | Role | Active
  - "Add Rule" button → modal with: name, model_name (text), role_id (dropdown from roles list), domain_filter (textarea for JSON, validated), is_active toggle
  - Edit and Delete per row

File: frontend/src/apps/users/pages/UserGroupsPage.jsx
  - Grid of role cards (grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4)
  - Each card: role name (bold), description, member count badge
  - Clicking a card expands (or shows a side drawer) with list of users in that role:
      - Fetch: GET /api/v1/users/?role={roleId}
      - Show user avatar/name/email list
      - "Remove" button per user (DELETE /api/v1/users/{user_id}/roles/{roleId}/ or equivalent)
  - "Assign User" button on card → search modal (type to search users by name/email, then click to assign)

=====================================================================
TASK 20: REGISTER ALL ROUTES + FIX FRONTEND BUGS
=====================================================================
1. Create: frontend/src/apps/users/routes/settingsRoutes.jsx
   (This file MUST be named exactly settingsRoutes.jsx for the Host/Plugin glob to discover it)
   Content:
       import React from 'react';
       import { Route } from 'react-router-dom';
       import AccessRightsPage from '../pages/AccessRightsPage';
       import RecordRulesPage from '../pages/RecordRulesPage';
       import UserGroupsPage from '../pages/UserGroupsPage';

       export default (
           <>
               <Route path="access-rights" element={<AccessRightsPage />} />
               <Route path="record-rules" element={<RecordRulesPage />} />
               <Route path="groups" element={<UserGroupsPage />} />
           </>
       );

2. Open: frontend/src/apps/system/routes/settingsAdminRoutes.jsx
   Add these imports at the top (after existing imports):
       import CurrenciesPage from '../pages/lists/CurrenciesPage';
       import WebhooksPage from '../pages/lists/WebhooksPage';
   Add these routes (inside the JSX, after the `financial` route):
       <Route path="currencies" element={<CurrenciesPage />} />
       <Route path="webhooks" element={<WebhooksPage />} />

3. Open: frontend/src/apps/core/api/coreService.js
   Fix: getScheduledRegistry: () => client.get('core/scheduled-registry/')
   To:  getScheduledActions: () => client.get('core/scheduled-actions/')
   Fix: getStates: (countryId) => client.get(`core/states/?country=${countryId}`)
   To:  getStates: (countryId) => client.get('core/states/', { params: { country: countryId } })

4. Open: frontend/src/apps/system/api/settingsService.js
   Fix getSystemStatus():
     Change from: return Promise.resolve({ systems: [], incidents: [], overallStatus: 'Operational' })
     To:          return client.get('core/command-center/system_health/')
   
   Fix exportAuditLogs(): Use params object instead of URL string concatenation

5. Open: frontend/src/apps/system/pages/settings/GeneralSettingsPage.jsx
   - In companyForm initial state, add:
       language: c.language || 'en',
       multi_company: c.multi_company || false,
   - Add Language dropdown in UI (inside the Localization section, after Timezone):
       <div>
         <label className="block text-sm font-medium text-slate-400 mb-1">Language</label>
         <select value={companyForm.language} onChange={e => setCompanyForm({...companyForm, language: e.target.value})}
                 className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500">
           <option value="en">English</option>
           <option value="fr">Français</option>
           <option value="de">Deutsch</option>
           <option value="zh-TW">繁體中文</option>
           <option value="ja">日本語</option>
           <option value="ar">العربية</option>
           <option value="es">Español</option>
         </select>
       </div>
   - Add Multi-Company toggle (similar to Developer Mode toggle already in the file)
   - Remove all console.error() calls (just leave try/catch with no console call)
   - Fix: <Loader2 className="animate-spin text-purple-500 ..."> → text-blue-500

6. Open: frontend/src/apps/system/pages/settings/SecurityPolicyPage.jsx
   Fix the 'default' PK fallback issue:
   - If the policy has no id, call POST (create) not PATCH (update)
   - Change fallback pattern to use a flag: const isNew = !policy?.id
   - If isNew: await usersService.createSecurityPolicy(policy)  (POST)
   - If not isNew: await usersService.updateSecurityPolicy(policy.id, policy)  (PATCH)
   - Fix: Loader2 className text-purple-500 → text-blue-500

7. Open: frontend/src/apps/users/services/usersService.js (or usersService.js)
   Fix revokeSession method:
   Change: client.delete(`users/${id}/session_revoke/`)
   To:     client.delete(`users/sessions/${id}/`)

8. Open: frontend/src/apps/users/config/menu.js
   Add missing navigation entries so all pages are reachable from the sidebar.
   At minimum, add entries for: Audit Logs (/admin/users/audit), MFA Management (/admin/users/mfa),
   Personal Access Tokens (/admin/users/tokens), Active Sessions (/admin/users/sessions),
   Security Policy (/admin/settings/security-policy)

=====================================================================
EXECUTION ORDER (CRITICAL — DO NOT SKIP STEPS)
=====================================================================
Tasks 1-5: Backend model changes → run makemigrations + migrate after EACH task
Task 6: AuthService fix (no DB changes)
Task 7: Login security fix (no DB changes)
Task 8: Users API fixes (no DB changes)
Task 9: Remove print() statements (no DB changes)
Task 10: SettingsService consolidation (delete files, fix methods)
Task 11: apps.py signals fix
Task 12: WebhookEndpoint model + API → run makemigrations system && migrate
Task 13: Verify IAM API registration
Task 14: Add register endpoint
Task 15: Replace seeder → then run: python manage.py seed_master_data
Tasks 16-19: All frontend pages
Task 20: Route registration + frontend bug fixes

FINAL VERIFICATION:
  python manage.py check  ← must show "System check identified no issues (0 silenced)."
  python manage.py seed_master_data  ← must print success summary
  Manually test each of the 10 verification points listed in the audit.
```
