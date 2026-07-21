import os

replacements = {
    "from apps.erp.api.permissions import IsERPAccessible": "from apps.accounting.api.permissions import IsERPAccessible",
    "from apps.erp.application.services import": "from apps.accounting.application.services import",
    "from apps.erp.models import InternalProject": "from apps.projects.domain.models import Project as InternalProject",
    "from apps.erp.models import Invoice, Payment, Expense": "from apps.accounting.domain.models import Invoice, Payment, Expense",
    "from apps.erp.models import Invoice, Payment": "from apps.accounting.domain.models import Invoice, Payment",
    "from apps.erp.models import Invoice": "from apps.accounting.domain.models import Invoice",
    "from apps.erp.services import InternalProjectService": "from apps.projects.application.services import ProjectService as InternalProjectService",
    "from apps.erp.services import InvoiceService": "from apps.accounting.application.services import InvoiceService",
    "('erp', 'ERP')": "('projects', 'Projects')"
}

directory = "." # relative path

count = 0
for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith((".py", ".js", ".jsx")):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            
            new_content = content
            for old, new in replacements.items():
                new_content = new_content.replace(old, new)
            
            if content != new_content:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                count += 1
                print(f"Updated {path}")
print(f"Total files updated: {count}")
