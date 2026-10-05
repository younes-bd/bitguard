import os
import sys
import re
from pathlib import Path

# Setup paths
PROJECT_ROOT = Path(__file__).parent.parent.resolve()

def check_junk_files():
    print("[1/2] Scanning for junk files (*.bak, *.new, etc.)...")
    junk_extensions = {'.bak', '.new', '.orig'}
    junk_suffixes = ('_bak.py', '_new.py', '_new.jsx', '_bak.jsx')
    
    violations = []
    for root, dirs, files in os.walk(PROJECT_ROOT):
        # Skip irrelevant/hidden directories
        dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', 'venv', '.venv', '.scratch', '__pycache__', '.agents', 'build', 'dist']]
        
        for file in files:
            if any(file.endswith(ext) for ext in junk_extensions) or file.endswith(junk_suffixes):
                violations.append(os.path.join(root, file))
    return violations

def check_system_boundaries():
    print("[2/2] Scanning Layer 1 (System) for illegal Layer 3 cross-imports...")
    system_dir = PROJECT_ROOT / 'frontend' / 'src' / 'apps' / 'system'
    
    if not system_dir.exists():
        return []
        
    # List of Layer 3 apps that System is forbidden from importing
    banned_modules = [
        'crm', 'sales', 'inventory', 'accounting', 'inbox', 
        'automation', 'portal', 'reports', 'users', 'fleet', 
        'documents', 'ecommerce', 'manufacturing', 'payroll'
    ]
    
    violations = []
    import_regex = re.compile(r"import\s+.*?\s+from\s+['\"](.*?)['\"]", re.MULTILINE)
    
    for filepath in system_dir.rglob('*.jsx'):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                matches = import_regex.findall(content)
                for match in matches:
                    # Check if the import path references a banned Layer 3 app
                    for banned in banned_modules:
                        # Catches paths like: ../crm/..., ../../crm/..., @/apps/crm/...
                        if f"/{banned}/" in match or match.endswith(f"/{banned}"):
                            rel_path = filepath.relative_to(PROJECT_ROOT)
                            violations.append(f"{rel_path}: Illegal import -> {match}")
        except Exception as e:
            print(f"Warning: Could not read {filepath}: {e}")
                            
    return violations

def main():
    print("========================================")
    print("🛡️  BitGuard Architecture Validator 🛡️")
    print("========================================\n")
    
    junk_violations = check_junk_files()
    import_violations = check_system_boundaries()
    
    has_errors = False
    
    if junk_violations:
        has_errors = True
        print("\n❌ FAILED: Junk files detected! (Rule 4 Violation)")
        for f in junk_violations:
            print(f"  - {f}")
    else:
        print("✅ PASS: No junk files found.")
        
    if import_violations:
        has_errors = True
        print("\n❌ FAILED: Architectural Boundary Violations in `system` module! (Rule 9 Violation)")
        for i in import_violations:
            print(f"  - {i}")
    else:
        print("✅ PASS: Kernel boundaries are secure.")
        
    print("\n========================================")
    if has_errors:
        print("💥 Validation Failed. Fix the errors above.")
        sys.exit(1)
    else:
        print("🚀 Validation Passed! Architecture is pristine.")
        sys.exit(0)

if __name__ == '__main__':
    main()
