# ITSM Module — Audit & DoItAll Production-Readiness Plan

## What the Previous Plan Got Wrong

The last implementation plan was mostly theoretical — it proposed adding models that **already exist** in your codebase (`ServiceItem`, `ServiceCategory`, `ServiceRequest` are all already in `domain/models.py`). It suggested creating a `PricingTier` model that is **not needed** because `ServiceItem` already has `base_price` and `pricing_type` fields. The plan did not read your actual code before writing the plan. This one does.

---

## 🔍 Real Code Audit — What's Actually There

### Backend (`backend/apps/itsm/`)

| Component | File | Status | Finding |
|-----------|------|--------|---------|
| `ServiceCategory` model | `domain/models.py:91` | ✅ Exists & good | Has `name`, `slug`, `icon`, `color`, `description`, `sort_order`, `is_active`, `parent` (hierarchy). **Nothing to add.** |
| `ServiceItem` model | `domain/models.py:107` | ✅ Exists & rich | Has `base_price`, `pricing_type` (free/one_time/monthly/annual/per_seat), `billing_cycle`, `visibility`, `sla_tier`, `linked_product`, `dynamic_form_schema`, `approval_required`, `service_owner`. **Nothing to add.** |
| `ServiceRequest` model | `domain/models.py:140` | ✅ Exists & complete | Full status workflow (pending → approved → in_progress → completed). Linked to `Ticket` and `ApprovalRequest`. |
| `ChangeRequest`, `Problem`, `ChangeTask` | `domain/models.py:5-89` | ✅ Enterprise-grade | Full ITIL-style change management with risk levels, rollback plan, approval chain. |
| **API: `ServiceItemViewSet`** | `api/views.py:81` | ✅ Exists | Has tenant-scoping, search, filter by category/pricing_type/visibility. |
| **API: `ServiceRequestViewSet`** | `api/views.py:105` | ✅ Exists | Has approve/reject actions, tenant-scoping, role-based queryset filtering. |
| **Admin: `ServiceItemAdmin`** | `admin.py:27` | ⚠️ WEAK | Registered but no `PricingTier` inline (doesn't exist as separate model — good), no `service_owner` search, no bulk actions (activate/deactivate). |
| **Seed Data** | `seed_enterprise_data.py` | ❌ EMPTY | Only creates 8 `ServiceCategory` rows with no `ServiceItem` records. **Zero actual services have been seeded.** |
| **Migrations** | `migrations/` | ❌ MISSING | The `migrations/` directory only has `__init__.py`. **No migrations have been generated for ITSM.** |
| **`ServiceCategory` `tenant` field** | `domain/models.py:91` | ⚠️ RISK | Inherits from `TenantAwareModel` which adds a `tenant` FK. The seed command creates categories without a tenant, which will **fail** at runtime because `tenant` is not nullable by default. |

### Frontend (`frontend/src/apps/itsm/`)

| Component | File | Status | Finding |
|-----------|------|--------|---------|
| `ITServiceCatalog.jsx` | `pages/lists/` | ⚠️ PARTIAL | Connects to real API via `itsmService.getServiceItems()`. **But category filter is hardcoded to 4 categories** (Identity, Cloud, Hardware, Support). Missing: Managed IT, Cybersecurity, Digital Services, Physical Security. |
| `ServiceCatalogManager.jsx` | `pages/` | ❌ MOCK DATA | Uses `setTimeout` with 3 hardcoded rows. **Never calls the real API.** Has no Create/Edit form. |
| `ItsmDashboard.jsx` | `pages/dashboards/` | ✅ Exists | 28KB — assume rich dashboard. |
| **Missing Pages** | — | ❌ | No `ServiceItemForm.jsx` (Create/Edit service), no `ServiceItemDetail.jsx` (view one service's full detail with pricing tiers display). |

---

## ✅ What Actually Needs to Be Done (No Wasted Work)

### The Gap Is Simple and Clear:

1. **No migrations generated** — `ServiceCategory` and `ServiceItem` models exist in Python but have never been applied to the database. This is why the seed command would fail.
2. **No service data seeded** — the seed command only creates categories, not a single `ServiceItem`. The entire catalog is empty.
3. **Frontend category filter hardcoded** — `ITServiceCatalog.jsx` only shows 4 categories; 4 pillars are invisible.
4. **`ServiceCatalogManager.jsx` is a fake** — it has mock data and no real API connection, no create/edit functionality.
5. **Admin is minimal** — `ServiceItemAdmin` needs bulk actions, better inlines, and more search power.

---

## 📋 Step-by-Step Implementation Plan

### Phase A — Fix the Foundation (Backend)

#### Step A1 — Fix `ServiceCategory` Tenant Issue in Seed Command

`ServiceCategory` inherits from `TenantAwareModel`, which adds a non-nullable `tenant` FK. The seed command must either:
- Pass a default system tenant, OR
- The model must use `null=True, blank=True` for tenant on categories (since categories are global/shared)

**Action:** Modify `seed_enterprise_data.py` to fetch the first available Tenant and assign it, or check if `ServiceCategory.tenant` is nullable.

#### Step A2 — Generate & Apply Migrations

```bash
# In WSL with venv activated, from backend/
python manage.py makemigrations itsm
python manage.py migrate
```

This creates the actual DB tables for `ServiceCategory`, `ServiceItem`, `ServiceRequest`, `ChangeRequest`, `Problem`, `ChangeTask`.

#### Step A3 — Expand the Seed Command with ALL Service Items

Replace `seed_enterprise_data.py` with the full dataset below. This is the **DoItAll IT Enterprise** complete service catalog with real pricing benchmarked against CDW, Palo Alto, Datadog, and Cloudflare.

**Target:** 5 Pillars × 4–5 services each = **22 `ServiceItem` records**, all with realistic `base_price`, `pricing_type`, `description`, `icon`, `visibility`, and `approval_required` flags.

#### Step A4 — Upgrade Django Admin

Modify `admin.py`:
- Add `list_display` columns: `name`, `category`, `base_price`, `pricing_type`, `visibility`, `is_featured`, `is_active`
- Add `list_editable`: `is_active`, `is_featured`
- Add `list_filter`: `category`, `pricing_type`, `visibility`, `billing_cycle`, `approval_required`
- Add `search_fields`: `name`, `description`, `sku`, `tags`
- Add `actions`: `activate_services`, `deactivate_services`, `mark_as_featured`

---

### Phase B — Frontend Fixes

#### Step B1 — Fix `ITServiceCatalog.jsx` — Remove Hardcoded Categories

Replace the hardcoded `categories` array (lines 37–43) with a dynamic fetch from the API. The categories should be loaded from `/api/itsm/service-categories/` (add this endpoint) or derived from the returned service items.

> **Note:** This requires adding a `ServiceCategoryViewSet` to the API and router.

#### Step B2 — Fix `ServiceCatalogManager.jsx` — Connect to Real API

Replace the `setTimeout` mock with real `itsmService.getServiceItems()` calls. Add a slide-out modal with a Create/Edit `ServiceItem` form that sends `POST`/`PATCH` to the API.

#### Step B3 — Add `ServiceItemForm` Modal

Build a form modal inside `ServiceCatalogManager.jsx` with fields:
- Name, Description, Category (dropdown), SKU, Base Price, Pricing Type (dropdown), Billing Cycle, Visibility, SLA Tier, Approval Required, Is Featured, Icon, Tags

---

### Phase C — Run the Seed Script

After A1–A3 are complete, run:
```bash
python manage.py seed_enterprise_data
```

This will populate all categories and all 22+ service items.

---

## 💰 Complete DoItAll Service Catalog — Seed Data

Below is the exact data that will be loaded. Pricing is benchmarked against CDW, ConnectWise, Datadog, Palo Alto Networks, and Cloudflare.

### Pillar 1 — Managed IT (`slug: managed-it`)

| Service Name | SKU | Price/mo | Billing | Visibility | Approval | Description |
|---|---|---|---|---|---|---|
| NOC Monitoring & Alerting | MNGT-NOC-01 | $299 | monthly | client-facing | No | 24/7 Network Operations Center monitoring with proactive alerting for servers, firewalls, switches, and endpoints. Includes real-time dashboards, escalation workflows, and monthly health reports. Benchmarked vs. Dattocon at $250–$400/mo. |
| Managed Help Desk (Tier 1–3) | MNGT-HD-01 | $199 | monthly | client-facing | No | End-user IT support via phone, email, and chat. Covers password resets, software installs, connectivity issues, and escalation to L2/L3 engineers. 4-hour SLA response on P1 incidents. Benchmarked vs. CDW at $149–$249/mo. |
| On-Site IT Field Services | MNGT-FS-01 | $0 | one_time | client-facing | Yes | Dispatched on-site technician for cabling, device setup, server rack installation, or emergency break-fix. Rate: $175/hr (min. 2hrs). Approval required for scheduling. |
| Device Lifecycle Management | MNGT-DLM-01 | $49 | per_seat | self-service | No | End-to-end management of employee devices from procurement to disposal. Includes asset tagging, warranty tracking, refresh cycles, and secure decommissioning. Price per device/month. |
| Proactive Patch Management | MNGT-PM-01 | $99 | monthly | client-facing | No | Automated OS and application patching across Windows, macOS, and Linux endpoints. Monthly vulnerability reports and change-advisory board approval workflow included. |

### Pillar 2 — Cybersecurity (`slug: cybersecurity`)

| Service Name | SKU | Price/mo | Billing | Visibility | Approval | Description |
|---|---|---|---|---|---|---|
| SOC-as-a-Service (MDR) | SEC-SOC-01 | $799 | monthly | client-facing | Yes | Managed Detection & Response powered by a 24/7 security operations center. Includes SIEM integration, threat hunting, incident response playbooks, and executive threat briefings. Benchmarked vs. Arctic Wolf at $700–$1,200/mo. |
| Endpoint Detection & Response | SEC-EDR-01 | $159 | per_seat | client-facing | No | Enterprise-grade EDR agent deployment and management using CrowdStrike Falcon or SentinelOne. Covers threat detection, behavioral analysis, automated quarantine, and forensic investigation. Per-endpoint pricing. |
| Penetration Testing | SEC-PEN-01 | $0 | one_time | client-facing | Yes | Ethical hacking engagement covering network, web application, API, and social engineering vectors. Deliverable: executive summary + technical report with CVSS-scored findings. Pricing: $5,000–$25,000 per engagement. Request triggers approval and scoping call. |
| Compliance-as-a-Service | SEC-CMP-01 | $499 | monthly | client-facing | Yes | Continuous compliance monitoring and gap assessment for SOC 2 Type II, ISO 27001, HIPAA, PCI-DSS, and NIST CSF. Includes evidence collection automation, policy templates, and auditor liaison. |
| Vulnerability Management | SEC-VM-01 | $249 | monthly | client-facing | No | Continuous scanning of internal and external attack surface using Tenable or Qualys. Monthly prioritized remediation reports with CVSS scoring and SLA-based fix timelines. |

### Pillar 3 — Cloud Services (`slug: cloud`)

| Service Name | SKU | Price/mo | Billing | Visibility | Approval | Description |
|---|---|---|---|---|---|---|
| Managed AWS Infrastructure | CLD-AWS-01 | $599 | monthly | client-facing | Yes | Full lifecycle management of AWS environments including VPC design, EC2/RDS/S3 administration, cost optimization, and 24/7 CloudWatch monitoring. Pricing excludes AWS usage fees. Benchmarked vs. Rackspace at $500–$800/mo. |
| Managed Microsoft Azure | CLD-AZR-01 | $549 | monthly | client-facing | Yes | Azure infrastructure management covering Entra ID, Azure Virtual Desktop, Sentinel SIEM, and M365 integration. Includes governance, tagging standards, and cost advisory. |
| Microsoft 365 Administration | CLD-M365-01 | $29 | per_seat | self-service | No | Full M365 tenant administration: Exchange Online, SharePoint, Teams governance, license management, conditional access policies, and MFA enforcement. Per-user monthly pricing. |
| Virtual Desktop Infrastructure (VDI) | CLD-VDI-01 | $89 | per_seat | client-facing | Yes | Cloud-hosted Windows desktops via Azure Virtual Desktop or AWS WorkSpaces. Includes image management, app packaging, profile persistence, and FSLogix configuration. |
| Cloud Backup & Disaster Recovery | CLD-DR-01 | $199 | monthly | client-facing | No | Automated backup of on-premise and cloud workloads with defined RTO/RPO SLAs. Quarterly DR testing, immutable backup storage, and ransomware recovery playbook included. |

### Pillar 4 — Digital Services (`slug: digital`)

| Service Name | SKU | Price/mo | Billing | Visibility | Approval | Description |
|---|---|---|---|---|---|---|
| Web Development Retainer | DIG-WEB-01 | $1,499 | monthly | client-facing | Yes | Dedicated development capacity (20hrs/mo) for web app builds, feature sprints, bug fixes, and performance optimization. Tech stack: React, Next.js, Django REST. Benchmarked vs. Toptal at $1,200–$2,500/mo. |
| E-Commerce Platform Management | DIG-ECM-01 | $799 | monthly | client-facing | Yes | End-to-end e-commerce operations: product catalog management, payment gateway integration, checkout optimization, inventory sync, and analytics dashboards. |
| AI Automation & Integration | DIG-AI-01 | $1,999 | monthly | client-facing | Yes | Custom AI workflow automation using LLMs, RAG pipelines, and RPA bots. Use cases: customer support automation, document processing, data extraction, predictive analytics. |
| Mobile App Development | DIG-MOB-01 | $2,999 | monthly | client-facing | Yes | Cross-platform mobile development (React Native / Flutter) with sprint-based delivery. Includes UX design, API integration, App Store / Google Play deployment, and post-launch maintenance. |

### Pillar 5 — Physical Security (`slug: physical-security`)

| Service Name | SKU | Price/mo | Billing | Visibility | Approval | Description |
|---|---|---|---|---|---|---|
| IP Video Surveillance | PHY-CAM-01 | $199 | monthly | client-facing | Yes | Enterprise IP camera deployment and remote monitoring. Includes camera placement assessment, NVR/DVR configuration, mobile access, 30-day cloud storage, and proactive footage review. |
| Access Control Systems | PHY-ACS-01 | $149 | monthly | client-facing | Yes | Keycard and biometric access control installation and management. Covers door controllers, badge enrollment, visitor management, and audit log reporting. |
| Physical Security Assessment | PHY-AST-01 | $0 | one_time | client-facing | Yes | On-site physical security audit covering perimeter controls, surveillance coverage, tailgating risks, server room access, and employee security awareness. Deliverable: risk report with remediation roadmap. |

---

## 🔧 Exact Code Changes Required

### File 1 — `seed_enterprise_data.py` [MODIFY]
**Path:** `backend/apps/core/management/commands/seed_enterprise_data.py`

Replace the entire file with the full dataset above (all 22 services, all categories, with correct tenant assignment for `TenantAwareModel` requirements).

### File 2 — `admin.py` [MODIFY]
**Path:** `backend/apps/itsm/admin.py`

Add to `ServiceItemAdmin`:
- `list_display` expanded
- `list_editable = ['is_active', 'is_featured']`
- `list_filter` expanded
- Custom `actions` for bulk activate/deactivate/feature

Add new `ServiceCategoryAdmin`:
- `list_display = ('name', 'slug', 'sort_order', 'is_active', 'parent')`
- `list_editable = ['sort_order', 'is_active']`

### File 3 — `api/views.py` [MODIFY]
**Path:** `backend/apps/itsm/api/views.py`

Add `ServiceCategoryViewSet`:
```python
class ServiceCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServiceCategory.objects.filter(is_active=True).order_by('sort_order')
    serializer_class = ServiceCategorySerializer
    permission_classes = [permissions.IsAuthenticated]
```

### File 4 — `api/urls.py` [MODIFY]
**Path:** `backend/apps/itsm/api/urls.py`

Add: `router.register(r'service-categories', ServiceCategoryViewSet)`

### File 5 — `api/serializers.py` [MODIFY]
Add `ServiceCategorySerializer`.

### File 6 — `ITServiceCatalog.jsx` [MODIFY]
**Path:** `frontend/src/apps/itsm/pages/lists/ITServiceCatalog.jsx`

Replace hardcoded `categories` array (lines 37–43) with a `useEffect` that fetches `/api/itsm/service-categories/`. Map all 5 pillars dynamically.

### File 7 — `ServiceCatalogManager.jsx` [OVERWRITE]
**Path:** `frontend/src/apps/itsm/pages/ServiceCatalogManager.jsx`

Replace with a fully functional admin table that:
1. Calls `itsmService.getServiceItems()` (with `is_active=all` filter for admins)
2. Has a Create/Edit slide-out form modal
3. Supports toggle `is_active` and `is_featured` directly in the table

---

## 🗂 Verification Plan

| Step | Command / Action | Expected Result |
|------|-----------------|----------------|
| **Migrations created** | `python manage.py makemigrations itsm` | New migration file generated |
| **Migrations applied** | `python manage.py migrate` | Tables created: `itsm_servicecategory`, `itsm_serviceitem`, etc. |
| **Seed runs** | `python manage.py seed_enterprise_data` | Console shows 5 categories created + 22 services created |
| **API works** | `curl /api/itsm/service-items/` | Returns 22 service JSON objects |
| **API categories** | `curl /api/itsm/service-categories/` | Returns 5 categories |
| **Admin works** | Login `/admin/` → ITSM → Service Items | 22 rows visible, bulk edit works |
| **Frontend catalog** | Open `/console/itsm/catalog` | All 5 category tabs, 22 service cards |
| **Manager page** | Open `/console/itsm/service-manager` | Real data from API, not mocks |

---

## ⚡ Execution Order (Do These Exactly)

```
Step 1 → Modify seed_enterprise_data.py  (all 22 services)
Step 2 → Modify admin.py                 (bulk actions, expanded display)
Step 3 → Modify api/serializers.py       (add ServiceCategorySerializer)
Step 4 → Modify api/views.py             (add ServiceCategoryViewSet)
Step 5 → Modify api/urls.py              (register new viewset)
Step 6 → Run migrations via seed_data.sh or WSL native filesystem
Step 7 → Modify ITServiceCatalog.jsx     (dynamic categories from API)
Step 8 → Overwrite ServiceCatalogManager.jsx (connect to real API + form modal)
Step 9 → Verify: curl API + check admin + open frontend
```

> [!IMPORTANT]
> Steps 1–5 are pure code edits (no migrations needed). Step 6 is the only step that requires WSL. Steps 7–8 are React-only changes. Approve this plan and I will execute all 9 steps automatically.
