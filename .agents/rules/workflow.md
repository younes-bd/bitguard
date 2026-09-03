---
name: Git Workflow & Engineering Standards
description: Enforces Conventional Commits, branching strategies, and professional coding conduct.
trigger: always_on
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


## 4. Scripting & Utility Management (Monorepo Strategy)
In a professional monorepo, utility scripts must be separated by their execution context. You must strictly follow this 3-tier folder strategy:

*   **`backend/scripts/`**: Use this ONLY for Django-specific operations (e.g., database seeders, data migrations, ORM smoke tests).
*   **`frontend/scripts/`**: Use this ONLY for React-specific build tools or scaffolding (e.g., generating boilerplate React components).
*   **Root `scripts/`**: Use this for global monorepo tooling, cross-stack deployment shell scripts, and **all temporary AI-generated refactoring scripts**. If you are writing a script to parse files and rewrite code, it goes here.
*   **No Root Clutter:** Do not drop Python or Bash scripts directly into the root directory.