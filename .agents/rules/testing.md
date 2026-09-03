---
name: Quality Assurance & Testing Standards
description: Defines the frameworks and methodologies for Backend and Frontend testing.
trigger: always_on
---

# Testing & QA Standards

Reliability is paramount in a Tier-1 ERP. Code is not considered complete until it is fully testable and resilient.

## 1. Backend Testing (Django)
*   **Framework:** Use Django's built-in `TestCase` or `pytest-django`.
*   **Service-Level Testing:** Do not just test API endpoints (Views). You must write isolated unit tests for the core business logic inside `services.py`.
*   **The Multi-Tenancy Mandate:** You MUST write negative test cases ensuring that Tenant A cannot access, read, or modify Tenant B's database records. 
*   **Factories over Fixtures:** Prefer using `factory_boy` to dynamically generate mock data rather than relying on brittle, hardcoded JSON fixtures.

## 2. Frontend Testing (React)
*   **Framework:** Use `Vitest` in combination with React Testing Library (`@testing-library/react`).
*   **API Mocking:** Frontend tests must never make real HTTP requests. You must mock the `apiClient.js` wrapper or use MSW (Mock Service Worker) to intercept requests.
*   **Behavioral Testing:** Test how the user interacts with the component (e.g., clicking buttons, typing in forms) rather than testing internal React state.

## 3. Graceful Error Handling
*   **Never Crash Silently:** All `try/catch` blocks must explicitly handle the error. On the frontend, always use `toast.error()` to inform the user.
*   **Backend Exceptions:** The backend must return standardized JSON error payloads with correct HTTP status codes (400 for validation, 401 for auth, 403 for permission/tenant violations, 404 for not found).
