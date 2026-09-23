import os

apps_with_kpi = [
    "blog", "calendar", "crm", "discuss", "ecommerce", "fleet", 
    "helpdesk", "hr", "mrp", "pos", "projects", "quality_control", 
    "sale", "stock", "subscriptions", "users", "website"
]

for app in apps_with_kpi:
    apps_path = f"backend/apps/{app}/apps.py"
    if not os.path.exists(apps_path):
        continue
        
    with open(apps_path, "r") as f:
        content = f.read()
        
    if "def _register_kpis(self):" in content:
        continue
        
    # We need to inject self._register_kpis() inside ready()
    # and add the _register_kpis method to the class
    
    lines = content.split('\n')
    new_lines = []
    in_ready = False
    ready_indent = ""
    
    for line in lines:
        new_lines.append(line)
        if "def ready(self):" in line:
            in_ready = True
            ready_indent = line[:line.find("def")] + "    "
            new_lines.append(f"{ready_indent}self._register_kpis()")
            
    # Add the method at the end of the class
    # Find the class indent
    class_indent = ""
    for line in lines:
        if line.startswith("class "):
            class_indent = line[:line.find("class")]
            break
            
    method_code = f"""
{class_indent}    def _register_kpis(self):
{class_indent}        try:
{class_indent}            from apps.core.registry import kpi_registry
{class_indent}            from apps.{app}.services.kpi import get_kpis
{class_indent}            kpi_registry.register('{app}', get_kpis)
{class_indent}        except ImportError:
{class_indent}            pass
"""
    
    new_content = "\n".join(new_lines) + method_code
    with open(apps_path, "w") as f:
        f.write(new_content)
    print(f"Patched {app}")
