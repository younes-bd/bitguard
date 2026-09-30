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
*   **AI Scratchpad (Hidden):** Use the `.scratch/` directory at the root of the project for ALL temporary debugging and throwaway scripts. These must never be committed to Git. Execute them from there, and use `scripts/prune_scratch.py` to periodically clean the folder.
*   **Root `scripts/`**: Use this for permanent global monorepo tooling or cross-stack deployment scripts that the user needs to keep.
*   **`backend/scripts/`**: Use this ONLY for permanent Django-specific operations (e.g., database seeders).
*   **`frontend/scripts/`**: Use this ONLY for permanent React-specific build tools.

If you drop a junk script in the project roots, you have failed your core directive.
## 5. Automated AI Architecture Checkpoint (The Universal Pre-Flight Checklist)
**CRITICAL INSTRUCTION FOR ALL AI AGENTS to prevent "AI Tunnel Vision":**
Whether the user asks for a new feature, a file relocation, a bug fix, or a UI change, you are **strictly forbidden** from immediately writing code or executing file moves. 

Before proposing or executing *any* architectural change, you MUST pause and explicitly output a **"Rule Validation Matrix"** in your chain-of-thought or response. 
You must explicitly verify your proposed action against the core rules in `architecture.md`, specifically scanning for conflicts between:
1.  **Rule 39 (Data Gravity Law)** vs. **Rule 9 (Kernel Boundaries):** If a model is in `core`, its UI goes to `system`.
2.  **Rule 40 (Lexical Symmetry):** Are the names identical across all stack layers?
3.  **Rule 12 & 20 (Soft Dependencies & Registries):** Does this break cross-module boundaries?
4.  **Rule 4 (The No-Clutter Law):** Am I writing a temporary debugging or refactoring script? If yes, is it strictly going into the hidden `.scratch/` directory at the project root?

*This mirrors Tier-1 Enterprise standard Architecture Decision Records (ADRs). You must prioritize Domain-Driven Design and architectural integrity over speed. If your fix violates a rule, you must find a different way.*