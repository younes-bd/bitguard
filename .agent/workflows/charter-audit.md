---
description: Automated audit of codebase against the BitGuard Platform Charter
---

This workflow ensures that the project remains compliant with the 12 sections of the BitGuard Platform Charter. Use this whenever new features are added or significant refactors are performed.

// turbo-all

1. **Service Layer Audit (Section 8)**
   - Scan `apps/` for any direct database queries in `views.py` or `serializers.py`.
   - Verify that all business logic resides in `services/`.
   - Ensure services inherit from `BaseService`.

2. **Multi-Tenancy & Isolation Audit (Section 1, 7)**
   - Check that all new models include a `tenant` ForeignKey where appropriate.
   - Verify that all service methods use `filter_by_context` or equivalent isolation logic.

3. **Auditability & Traceability Audit (Section 11)**
   - Scan for critical mutations (Create/Update/Delete) and ensure `AuditService.log_action` is called.
   - Verify that the `request` object is passed to services to capture IP and User info.

4. **Frontend Architecture Audit (Section 9)**
   - Verify that React components in `frontend/src/features/` do not contain complex business logic.
   - Ensure all API calls are abstracted into `shared/core/services/`.
   - Check that UI components act as pure "projection layers".

5. **Security & RBAC Audit (Section 2, 8)**
   - Verify that `HasRBACPermission` is applied to all new API ViewSets.
   - Check that permission codes (e.g., `crm.view_leads`) are correctly registered in the `apps.access` system.

6. **Notification Standards (Section 10)**
   - Ensure system alerts use the centralized `NotificationService`.

7. **Customer Lifecycle & Service Delivery (Section 15, 16, 17)**
   - Verify that migrations and models adhere to the standard lifecycle stages.
   - Check that selling a service (Store Order) triggers the creation of a delivery obligation (ERP Project/Task).
   - Ensure a unified offering model is used for digital, physical, and managed products.

8. **Financial & Billing Integrity (Section 18)**
   - Verify that every revenue action (Order/Subscription) emits a traceable event.
   - Ensure the UI does not contain "manual override" logic for pricing that isn't captured in the AuditLog.

9. **Observability & Coordination (Section 19, 20)**
   - Scan for event-driven coordination (signals or events) between apps.
   - Verify that `AuditLogView` remains accessible and comprehensive for system observability.

10. **Verification**
   - Run `python manage.py check` to ensure no broken imports or system errors.
   - Run `env/bin/python manage.py test` to verify logic integrity.
