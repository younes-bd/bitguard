# EDMS & Reporting Engine — Production Readiness Plan

## Audit Summary

Both modules were deeply audited against Odoo Documents, Odoo QWeb Reports, and enterprise DMS standards.

| Module | Score | Status |
| :--- | :--- | :--- |
| **Document Management (EDMS)** | **3.5 / 10** | Visually polished shell with critical security bugs |
| **Document Reporting Engine** | **2.5 / 10** | Skeleton scaffold — zero API endpoints exposed |

---

## User Review Required

> [!CAUTION]
> **SECURITY BLOCKER — Affects EDMS Immediately**
> The 4 EDMS API ViewSets (`DocumentWorkspace`, `Tag`, `Document`, `DocumentVersion`) have **zero `permission_classes`** defined. Any authenticated — or potentially unauthenticated — user can read, write, and delete any document in the system. This must be patched before any other work.

> [!CAUTION]
> **DATA ISOLATION BUG — Owner Filter**
> The "My Personal Vault" filter in `EDMSDashboard.jsx` matches documents by `first_name` substring instead of user ID. If your name is "Ali", you see ALL documents owned by anyone named "Ali". This is an active data leak.

> [!WARNING]
> **REPORTING ENGINE HAS ZERO API ENDPOINTS**
> `backend/apps/reporting/api/urls.py` is a file containing only `urlpatterns = []`. The `ReportingService.generate_pdf()` WeasyPrint service exists and is well-written but is **completely unreachable** — no route invokes it.

> [!WARNING]
> **3 Features Are Visually Present But Entirely Broken**
> - **Workspace Filtering**: `workspace_id` is marked `write_only` in the serializer, so `doc.workspace_id` is always `undefined` in responses. The filter never matches anything.
> - **Version History Modal**: Reads `document.history` from props, but the `DocumentSerializer` never returns a `history` field. The modal is permanently empty.
> - **Permanent Delete**: `Document.is_deleted` exists (soft-delete field) but `DocumentViewSet.perform_destroy()` is not overridden, so deletes are **permanent and cascade to file storage**.

---

## Open Questions

> [!IMPORTANT]
> **Q1 — Reporting PDF Library**: The backend has WeasyPrint (`pdf_generator.py`) and the ERP module has a separate WeasyPrint implementation (`erp/application/services.py:1006`). Should I unify these into a single shared service, or keep them separate?

> [!IMPORTANT]
> **Q2 — File Storage**: Files currently go to **local disk** (`attachments/%Y/%m/`). For production, should I configure **Amazon S3** or another object storage backend (`django-storages`)? This affects the reporting module's PDF storage too.

> [!IMPORTANT]
> **Q3 — Reporting Template Editor**: The TemplateManager needs an HTML editor. Should I use a **full code editor (Monaco/CodeMirror)** for raw HTML/CSS editing (most powerful, Odoo-like), or a **visual WYSIWYG editor (Quill/TipTap)** (simpler for non-developers)?

> [!IMPORTANT]
> **Q4 — Scope**: Given the scale of these fixes, should I prioritize **Phase 1 only** (critical security + bug fixes, ~1-2 days) to make things stable, or should I go ahead and implement **Phase 1 + Phase 2** (full feature completion)?

---

## Proposed Changes

### Phase 1 — Critical Security & Bug Fixes (BLOCKING)

---

#### [EDMS] Backend Security & Data Integrity

##### [MODIFY] backend/apps/edms/api/views.py
- Add `from rest_framework.permissions import IsAuthenticated` and set `permission_classes = [IsAuthenticated]` on all 4 ViewSets.
- Override `perform_destroy()` on `DocumentViewSet` to do `instance.is_deleted = True; instance.save()` (soft delete) instead of permanent delete.
- Add server-side file type and max size validation in `create()`.
- Fix `bump_version` action: use `request.user` as `created_by` instead of `document.owner`.

##### [MODIFY] backend/apps/edms/api/serializers.py
- Remove `write_only=True` from `workspace_id` field so the filter can match against it in the frontend.
- Add a `versions` nested serializer field on `DocumentSerializer` using `DocumentVersionSerializer(many=True, read_only=True)`. This is what populates the history modal.

##### [MODIFY] backend/apps/edms/domain/models.py
- Change `DocumentVersion.attachment` from `OneToOneField` to `ForeignKey` to allow proper version history without IntegrityError.

##### [MODIFY] backend/apps/edms/admin.py
- Register all 4 models with proper `list_display`, `list_filter`, and `search_fields`.

---

#### [EDMS] Frontend Bug Fixes

##### [MODIFY] frontend/src/apps/edms/pages/dashboards/EDMSDashboard.jsx
- Fix owner filter: compare `doc.owner` (UUID) to `user.id` instead of name substring.
- Fix workspace filter: compare `doc.workspace_id` to `activeWorkspace` (now readable from API).
- Replace `window.prompt()` for workspace creation with a proper inline modal.
- Replace `window.confirm()` delete with a styled confirmation dialog + toast notification.

##### [MODIFY] frontend/src/apps/edms/components/DocumentHistoryModal.jsx
- Add `useState` and `useEffect` that calls `edmsService.getVersions(document.id)` on mount.
- Remove the broken `document.history` prop read.

##### [MODIFY] frontend/src/apps/edms/pages/settings/TagManager.jsx
- Fix color picker to store and display hex color codes (`#3B82F6`) instead of Tailwind class names.
- Use inline `style={{ backgroundColor: color }}` with hex values.

##### [MODIFY] frontend/src/apps/edms/pages/settings/WorkspaceManager.jsx
- Wire the existing `Edit3` icon button to a rename modal/inline input.
- Call the PATCH endpoint on submit.

---

#### [Reporting] Backend — Build the Entire API Layer

##### [MODIFY] backend/apps/reporting/domain/models.py
- Add `GeneratedReport` model: `template (FK)`, `record_model`, `record_id`, `generated_by (FK)`, `status (pending/done/failed)`, `file (FileField)`, `generated_at`.
- Add `ReportEngineSettings` singleton model: `paper_format`, `top_margin`, `company_header_html`, `company_footer_html`.

##### [NEW] backend/apps/reporting/api/serializers.py
- `ReportTemplateSerializer`, `GeneratedReportSerializer`, `ReportEngineSettingsSerializer`.

##### [NEW] backend/apps/reporting/api/views.py
- `ReportTemplateViewSet` — full CRUD (`list`, `retrieve`, `create`, `update`, `destroy`)
- `@action preview/` — POST: renders template HTML with sample data, returns HTML string for iframe preview
- `GeneratedReportViewSet` — list, retrieve, download (serves PDF binary with `Content-Disposition: attachment`)
- `GenerateReportAPIView` — POST `{template_id, record_model, record_id}` → calls `ReportingService.generate_pdf()`, saves `GeneratedReport`, returns download URL

##### [MODIFY] backend/apps/reporting/api/urls.py
- Replace `urlpatterns = []` with the full DRF router + endpoint registration.

##### [MODIFY] backend/apps/reporting/admin.py
- Register `ReportTemplate`, `GeneratedReport`, `ReportEngineSettings`.

---

#### [Reporting] Frontend — Build All 4 Pages

##### [NEW] frontend/src/core/api/reportingService.js
- `getTemplates()`, `createTemplate()`, `updateTemplate(id)`, `deleteTemplate(id)`
- `previewTemplate(id, sampleContext)` → returns rendered HTML
- `generateReport(templateId, model, recordId)` → returns `GeneratedReport`
- `getGeneratedReports()`, `downloadReport(id)`

##### [MODIFY] frontend/src/apps/reporting/pages/templates/TemplateManager.jsx
- Full CRUD: fetch list from API, "New Template" modal with `name`, `model` dropdown, HTML editor (Monaco / `<textarea>`), CSS editor.
- Preview button → POST to preview endpoint → render result in `<iframe>`.
- Delete/edit actions on each row.

##### [NEW] frontend/src/apps/reporting/pages/generated/GeneratedDocuments.jsx
- Table: template name, record type, generated by, date, status badge, Download button.
- Calls `reportingService.getGeneratedReports()`.

##### [NEW] frontend/src/apps/reporting/pages/settings/ReportingSettings.jsx
- Paper format (A4/Letter), margin sliders, company header/footer HTML textarea, save button.
- Calls settings CRUD endpoints.

##### [MODIFY] frontend/src/apps/reporting/pages/dashboards/ReportingDashboard.jsx
- Replace static cards with live KPIs: total templates, PDFs generated this month, last generated report.

##### [MODIFY] frontend/src/apps/dashboard/routes/EnterpriseRouter.jsx
- Register `<Route path="generated" element={<GeneratedDocuments />} />`
- Register `<Route path="settings" element={<ReportingSettings />} />`

---

### Phase 2 — Core Missing Enterprise Features

#### [EDMS] Backend
- Add `archive/` and `lock/` custom actions to `DocumentViewSet`
- Add server-side `?search=` query param with PostgreSQL `icontains` on `attachment__name` and `ocr_text`
- Add DRF `PageNumberPagination` to `DocumentViewSet`
- Add `GET /edms/vault/{id}/download/` action returning a signed download URL

#### [EDMS] Frontend
- **[NEW] Document Detail Page** — `DocumentDetail.jsx` with inline PDF preview (`<iframe>` or `react-pdf`), metadata panel, version history, lock/archive actions.
- **Grid/Kanban view toggle** in the dashboard (card view with file type thumbnail + list view).
- **Bulk actions** — multi-select checkboxes + bulk delete/archive/tag bar.
- **Pagination UI** — replace unlimited load with paginated table.

#### [Reporting] 
- Add a "Generate PDF" button to ERP Invoice detail page calling `reportingService.generateReport()`
- Add `menu.js` sidebar entry for App Store under system module

---

## Verification Plan

### Automated Tests
```bash
# Backend — EDMS
cd backend && python manage.py test apps.edms

# Backend — Reporting
cd backend && python manage.py test apps.reporting
```

### Manual Verification
1. Log in, navigate to EDMS, confirm workspace filter correctly segments documents.
2. Upload a document, click version history — verify versions appear in the modal.
3. Delete a document — verify it disappears from UI but `is_deleted=True` in the database (not a permanent delete).
4. Navigate to "My Personal Vault" — confirm only your own documents show.
5. Navigate to Reporting → Templates → Create a template → Click Preview → verify iframe renders.
6. Navigate to Reporting → Generated Documents → verify table loads from API.
7. Press Ctrl+K, type "Generated" — verify command palette navigates correctly.
