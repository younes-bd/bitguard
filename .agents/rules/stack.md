---
name: Technology Stack Directives
description: Defines the strict frontend and backend technologies used in the BitGuard platform.
trigger: always_on
---

# BitGuard Technology Stack

This document defines the strict technology stack used across the platform. Do not hallucinate or import unauthorized third-party libraries without explicit user consent.

## Frontend (Control Plane)
*   **Core Framework:** React 18 built with Vite.
*   **Routing:** React Router DOM (v6). Use `useNavigate` and `<Link>` for all internal routing.
*   **Styling:** Tailwind CSS. No custom CSS files or inline styles are allowed unless absolutely necessary for complex animations.
*   **Icons:** Strictly `lucide-react`. Do NOT use FontAwesome, Heroicons, or Material Icons.
*   **State Management:** React Context API (e.g., `ManifestContext`, `AuthContext`). Redux is NOT used.
*   **HTTP Client:** Axios, but it MUST be routed through the custom `apiClient` wrapper located in `frontend/src/core/api/client.js` to ensure JWT tokens and tenant headers are correctly attached.
*   **Notifications:** `react-hot-toast` (`import toast from 'react-hot-toast'`).

## Backend (Data Plane)
*   **Core Framework:** Python 3 & Django.
*   **API Framework:** Django REST Framework (DRF) utilizing `viewsets.ModelViewSet` and `@action` decorators.
*   **Authentication:** SimpleJWT (JSON Web Tokens). The frontend passes the token in the `Authorization: Bearer <token>` header.
*   **Background Tasks:** Managed via WebhookEndpoints and Automated Actions.

## API Response Standard
*   The backend typically wraps API responses in a standard dictionary format or Django Pagination format. 
*   **CRITICAL:** When fetching data on the frontend, always anticipate wrapped JSON (e.g., `response.data.results`) and unwrap it safely before using Array functions like `.map()` or `.filter()`.
