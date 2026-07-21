import re

def uncomment_models():
    file_path = "apps/services/domain/models.py"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    lines = content.split('\n')
    for i in range(4, 90):
        if lines[i].startswith("# "):
            lines[i] = lines[i][2:]
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

def fix_imports():
    analytics = "apps/board/services/analytics.py"
    with open(analytics, "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace("from apps.itsm.domain.models import ChangeRequest", "from apps.services.domain.models import ChangeRequest")
    with open(analytics, "w", encoding="utf-8") as f:
        f.write(content)
        
    support = "apps/helpdesk/application/services.py"
    with open(support, "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace("from apps.itsm.domain.models import Problem", "from apps.services.domain.models import Problem")
    with open(support, "w", encoding="utf-8") as f:
        f.write(content)
        
    script = "../scripts/migrate_services_data.py"
    try:
        with open(script, "r", encoding="utf-8") as f:
            content = f.read()
        content = content.replace("from apps.itsm.domain.models import ServiceItem", "from apps.services.domain.models import ServiceItem")
        with open(script, "w", encoding="utf-8") as f:
            f.write(content)
    except FileNotFoundError:
        pass

uncomment_models()
fix_imports()
print("Fixed itsm references and uncommented models.")
