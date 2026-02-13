# Global Agent Instructions

As an agent working on this project, you must always adhere to the standards and rules defined in the root `CHARTER.md`.

## Core Principles:
1.  **Service Layer & Control Plane (Section 8, 13)**: Never perform direct database queries in views or serializers. All modules are managed by the central control plane, not autonomous. Delegate business logic to dedicated service classes.
2.  **Stateless Frontend & Command Center (Section 9, 14)**: The React frontend remains a stateless projection layer. The Admin Dashboard is the authoritative operational interface; it never bypasses validation and uses the same backend workflows as public actions.
3.  **Auditability & Traceability (Section 11, 18)**: All critical system mutations and revenue-impacting actions must be logged via the `AuditService`. Financial truth is derived from these logs, not the UI.
4.  **Multi-Tenant Isolation & Identity (Section 1, 7, 21)**: Ensure strict data isolation using `TenantMiddleware` and `BaseService.filter_by_context`. Access is role-based and responsibility-driven.
5.  **Lifecycle & Service Delivery (Section 15, 16, 17)**: Adhere to the Customer Lifecycle Canon. Services defined in ERP must coordinate with Commerce and CRM via event-driven coordination (Section 20).
6.  **Fail-Safe Automation (Section 22, 24)**: Handle failures gracefully without corrupting state. AI assistance must never invent workflows or bypass validation.

## Operational Requirements:
- Refer to `CHARTER.md` at the start of every task to ensure alignment.
- Prioritize architectural integrity over quick fixes.
- Use the `.agent/workflows/charter-audit.md` to verify changes before final delivery.
