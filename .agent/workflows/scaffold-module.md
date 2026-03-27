---
description: Scaffold a new Full-Stack DDD Business Module for BitGuard
---

This workflow is used to generate a new business module (e.g., "Marketing", "Support") ensuring it has both a backend Django app and a frontend React slice that perfectly adhere to the Multi-Tenant Enterprise Architecture.

// turbo-all

1. **Prompt for Module Name**
   - Ask the user for the name of the new module (e.g., `support`).

2. **Backend Scaffolding**
   - Create a new Django app under `backend/apps/{module_name}`.
   - Refactor the generated app to include the standard DDD enterprise structure:
     - `models.py` (TenantAware models)
     - `serializers.py`
     - `views.py` (API ViewSets using Core BaseViews)
     - `services.py` (Where all business logic goes)
     - `urls.py`
   - Update `backend/config/settings/base.py` to add `apps.{module_name}` to `INSTALLED_APPS`.
   - Update `backend/api/urls.py` to register the new module's router.

3. **Frontend Scaffolding**
   - Create a new Feature-Slice under `frontend/src/apps/{module_name}`.
   - Scaffold the following structure:
     - `api/{module_name}Service.js` (Extending the core API client)
     - `components/` (Domain-specific UI components)
     - `pages/{module_name}Dashboard.jsx`
     - `routes/routes.jsx`
   - Update `frontend/src/core/routes/EnterpriseRouter.jsx` to register the new module's routes under the appropriate section.

4. **Integration & Audit**
   - Run `/charter-audit` to guarantee the new module strictly follows the platform rules.
   - Ensure `Task boundaries` describe the completion of the scaffolding seamlessly.
