# Enterprise Identity & Access Management Workflow

This plan outlines the refactoring required to fully support the "Do-It-All Enterprise" identity workflow, specifically separating internal users, SaaS tenants, and CRM portal clients.

## User Review Required

> [!IMPORTANT]
> The database schema changes will link your CRM module directly to your IAM User module via the `Contact` model. Please review the proposed data flow. 

## Open Questions

> [!WARNING]
> Do you want Portal Clients to be able to log into the system with a standard password, or should we force SSO/Magic Links for external clients? (Currently proposing standard password authentication for them).

## Proposed Changes

### Backend: Identity & CRM Schemas

We need to properly link the `crm.Contact` model to the IAM `User` model, and expose both `tenant` and `contact` fields in the User APIs.

---

#### [MODIFY] backend/apps/crm/domain/models.py
- Update `Contact` model to include a One-To-One link to `User`:
  `user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='crm_contact')`
- This ensures a CRM client contact can be natively elevated to a "Portal User".

#### [MODIFY] backend/apps/users/api/serializers.py
- Update `UserSerializer` to expose the `tenant` field (read/write).
- Update `UserSerializer` to read/write a `contact_id` which automatically creates/updates the `Contact.user` link.

#### [MODIFY] backend/apps/users/api/views.py
- Update the `UserViewSet` `create` and `update` methods to handle `tenant_id` assignment.
- Ensure the view handles assigning the `User` to a specific CRM `Contact` if `contact_id` is passed.

### Frontend: Identity Management UI

The frontend User Editor needs to support assigning Principals to either a Tenant Workspace (Scenario A) or a CRM Client Portal (Scenario B).

---

#### [MODIFY] frontend/src/apps/auth/pages/identity/UserEditor.jsx
- Add a dropdown for **Tenant Assignment** (fetching active tenants). This allows you to assign a user to NovaTech's SaaS tenant.
- Add a dropdown for **CRM Contact Assignment** (fetching CRM contacts). This allows you to link a user to a NovaTech CRM Client profile for the Client Portal.
- Update the form payload to send `tenant_id` and `contact_id` when saving.

#### [MODIFY] frontend/src/core/api/iamService.js
- Ensure the API calls properly format and send the `tenant_id` and `contact_id` fields.

#### [MODIFY] frontend/src/core/api/client.js
- Create fetching methods in a new or existing CRM service to retrieve CRM Contacts for the assignment dropdown.

## Verification Plan

### Automated Tests
- Run `python manage.py makemigrations` and `migrate` to verify schema changes.
- Ensure `python manage.py check` passes with no issues.

### Manual Verification
- **Scenario A:** Open the Identity Dashboard, create a user `john@novatech.com`, and assign them to the "NovaTech" tenant from the dropdown. Verify in the database that their `tenant_id` is set.
- **Scenario B:** Open the Identity Dashboard, create a user `support@acme.com`, and assign them to the Acme Corp CRM contact from the dropdown. Verify that the `crm_contact` table links to this user ID.
