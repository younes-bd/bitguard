---
trigger: always_on
description: Enforces Conventional Commits, branching strategies, and professional coding conduct.
---


# Engineering Workflow & Git Standards

To maintain a professional, collaborative environment, you must act as a Senior Engineer and strictly adhere to the following workflow protocols.

## 1. Conventional Commits
All Git commit messages MUST follow the Conventional Commits specification.
*   **Format:** `<type>(<scope>): <subject>`
*   **Types Allowed:**
    *   `feat:` A new feature or module.
    *   `fix:` A bug fix.
    *   `refactor:` Code changes that neither fix a bug nor add a feature (e.g., UI alignment).
    *   `chore:` Maintenance, dependency updates, or tooling changes.
    *   `docs:` Documentation changes only.
*   **Example:** `feat(apps): implement dynamic registry for command center`

## 2. Branching Strategy
*   **Main Branch:** The `main` (or `master`) branch is strictly protected. Do not commit directly to it unless explicitly ordered to by the user.
*   **Feature Branches:** For new work, always suggest creating a branch named `feature/<feature-name>` or `bugfix/<bug-name>`.

## 3. Professional Code Conduct
*   **No Leftover Debugging:** Never leave `console.log()`, `print()`, or `debugger` statements in the final committed code.
*   **No Dead Code:** Remove unused imports, dead CSS classes, and commented-out legacy code block immediately.
*   **Self-Documenting Code:** Prefer clear, descriptive variable and function names over excessive inline comments. If a comment is needed, explain *why* the code exists, not *what* it does.


## 4. CRITICAL DIRECTIVE: The No-Clutter Law (STRICT BAN)
**UNDER NO CIRCUMSTANCES** are you allowed to write temporary refactoring or debugging scripts (`.py`, `.sh`, `.js`) into the `backend/`, `frontend/`, or global root directories. This is a FATAL violation of the workflow.

You must strictly follow this folder strategy for scripts:
*   **AI Scratchpad (Highly Recommended):** Use your isolated Antigravity `scratch/` artifact directory for ALL temporary debugging and throwaway scripts. Execute them from there.
*   **Root `scripts/`**: Use this for permanent global monorepo tooling or cross-stack deployment scripts that the user needs to keep.
*   **`backend/scripts/`**: Use this ONLY for permanent Django-specific operations (e.g., database seeders).
*   **`frontend/scripts/`**: Use this ONLY for permanent React-specific build tools.

If you drop a junk script in the project roots, you have failed your core directive.
## 5. Automated AI Architecture Checkpoint (The Anti-Tunnel-Vision Rule)
CRITICAL INSTRUCTION FOR ALL AI AGENTS: 
When the user presents a stack trace or bug, you are strictly forbidden from immediately writing a patch to make the error disappear. 
Before generating ANY code to fix a bug, you MUST pause and automatically cross-reference your proposed solution against the rules in rchitecture.md (specifically Rule 9 on Kernel Boundaries, Rule 12 on Soft Dependencies, and Rule 20 on Registries). 
You must prioritize Domain-Driven Design and architectural integrity over a quick fix. If your fix violates the architecture, you must find a different way.