with open('.agents/rules/architecture.md', 'a', encoding='utf-8') as f:
    f.write('\n\n## 22. Strict Prohibition of Temporal and Versioning Suffixes\n')
    f.write('**The Problem:** Developers sometimes create files like `CrmSettings_new.jsx`, `InventorySettings_v2.jsx`, or `Dashboard_backup.jsx` during a refactor. This causes severe routing confusion, breaks global search predictability, and leaves dead code in the repository.\n\n')
    f.write('**The Rule:** You are STRICTLY FORBIDDEN from using temporal or versioning suffixes in filenames (e.g., `_new`, `_old`, `_v2`, `_backup`, `_temp`).\n')
    f.write('* If you are refactoring a file, you must overwrite the existing file in place or use Git branching.\n')
    f.write('* Code must always reflect the absolute present state. The codebase is not a graveyard for "old" versions.\n\n')
    f.write("**Why:** Combined with Lexical Symmetry (Rule 21), a developer must guarantee that `StockSettings.jsx` is the one and only source of truth for the `stock` module's settings, without having to wonder if `StockSettings_new.jsx` is secretly the active route.\n")
