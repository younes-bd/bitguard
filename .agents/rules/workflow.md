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

You must strictly follow this Code Placement Matrix for tooling:
*   **AI Scratchpad (Hidden):** Use the `.scratch/` directory at the root of the project for ALL temporary debugging and throwaway scripts. These must never be committed to Git. Execute them from there, and use `scripts/prune_scratch.py` to periodically clean the folder.
*   **Standalone Scripts (Root `scripts/`):** Use this ONLY for pure OS-level infrastructure automation (e.g., File Deletion, Docker Builds, Git Hooks). *They must never connect to the database.*
*   **Django Management Commands (`apps/*/management/commands/`):** MUST be used for ANY tool that requires Database access, Business Logic, or the Django ORM (e.g., Database Seeders, Tenant Verification, Data Migrations). Do NOT build raw Python scripts in the backend for these tasks.
*   **Frontend Scripts (`frontend/scripts/`):** Use this ONLY for permanent React-specific build tools.

If you drop a junk script in the project roots, you have failed your core directive.
## 5. Automated AI Architecture Checkpoint (The Universal Pre-Flight Checklist)
**CRITICAL INSTRUCTION FOR ALL AI AGENTS to prevent "AI Tunnel Vision":**
Whether the user asks for a new feature, a file relocation, a bug fix, or a UI change, you are **strictly forbidden** from immediately writing code or executing file moves. 

Before proposing or executing *any* architectural change, you MUST pause and explicitly output a **"Rule Validation Matrix"** in your chain-of-thought or response. 
You must explicitly verify your proposed action against the core rules in `architecture.md`, specifically scanning for conflicts between:
0.  **MACH Verification:** Does this proposal maintain strict Headless decoupling and Cloud-Native multi-tenancy?
1.  **Rule 39 (Data Gravity Law)** vs. **Rule 9 (Kernel Boundaries):** If a model is in `base`, its UI goes to `system`.
2.  **Rule 40 (Lexical Symmetry):** Are the names identical across all stack layers?
3.  **Rule 12 & 20 (Soft Dependencies & Registries):** Does this break cross-module boundaries?
4.  **Rule 4 (The No-Clutter Law):** Am I writing a temporary debugging or refactoring script? If yes, is it strictly going into the hidden `.scratch/` directory at the project root?
5.  **Rule 45 (Service Domain Law):** Is the frontend API service placed in the folder matching the backend app (e.g., `base`), ensuring it is not accidentally coupled to the UI app (e.g., `system`)?

*This mirrors Tier-1 Enterprise standard Architecture Decision Records (ADRs). You must prioritize Domain-Driven Design and architectural integrity over speed. If your fix violates a rule, you must find a different way.*
