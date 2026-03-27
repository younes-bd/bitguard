---
description: Automatically aligns the AI's context with the current Enterprise Architecture
---

This workflow is used to force the AI Agent to read and internalize the repository structure before starting complex scaffolding or refactoring. Use this command when starting a new conversation session to ensure the AI doesn't hallucinate non-compliant structures.

1. **Read Architecture**
   - Use the `view_file` tool to read `ARCHITECTURE.md` in the root directory.
   - Internalize the Domain-Driven Design (DDD) rules for the Backend.
   - Internalize the Feature-Sliced Design (FSD) rules for the Frontend.

2. **Acknowledge Compliance**
   - Respond to the user with a short message confirming that you have read the architecture file and are ready to build new modules that comply with the Enterprise Monorepo standards.
