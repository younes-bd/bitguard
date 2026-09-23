# Tier-1 Model Dropdown Unification Plan

This plan standardizes the UI presentation of all database model dropdowns across the ERP to strictly follow the Tier-1 standard (Odoo/Salesforce). Currently, multiple configuration pages render simplified, ambiguous labels (e.g., `Invoice`), which poses a security and configuration risk. We will unify all dropdowns to render the fully qualified model definition: `[App Label] | [Readable Label] ([Technical Model Name])`.

## Proposed Changes

### 1. `apps/users/pages/lists/RecordRulesPage.jsx`
- **Current Rendering:** `{ct.label}` (e.g., `User`)
- **Action:** Update the JSX `<option>` block to map the fully qualified attributes natively provided by the backend serializer.
- **Target JSX:** `{ct.app_label} | {ct.label} ({ct.model})`

### 2. `apps/automation/pages/lists/AutomatedActionsPage.jsx`
- **Current Rendering:** `{m.label}` (e.g., `Sale Order`)
- **Action:** Update the JSX `<option>` block to extract the `app_label` and `model` name.
- **Target JSX:** `{m.app_label} | {m.label} ({m.model || m.model_name})`

### 3. `apps/system/pages/lists/ScheduledActionsPage.jsx`
- **Current Rendering:** `{m.label}` (e.g., `Daily Backup`)
- **Action:** Apply the identical Tier-1 formatting to the scheduled actions form.
- **Target JSX:** `{m.app_label} | {m.label} ({m.model || m.model_name})`

### 4. `apps/users/pages/lists/AccessRightsPage.jsx` (Minor Cleanup)
- **Current State:** Already uses the correct Tier-1 format, but maps a custom `appLabel` manually on the frontend.
- **Action:** Refactor the `useMemo` hook slightly to natively use the `app_label` provided by the backend serializer.

## Technical Details (Why this is seamless)
We do not need to alter the backend Python API or database at all. The `core/content-types/` endpoint already provides the exact payload we need:
```json
{
  "id": 1,
  "app_label": "account",
  "model": "account.users",
  "label": "Account Users"
}
```
All updates are purely React JSX string interpolation changes.

## Verification Plan
- Navigate to Automated Actions and click "New" to verify the target model dropdown visually matches the layout `account | User (account.users)`.
- Repeat for Record Rules and Scheduled Actions to ensure 100% uniformity.
