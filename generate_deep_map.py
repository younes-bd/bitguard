import os
import ast

def read_manifest(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            # safely evaluate the python dictionary
            return ast.literal_eval(content)
    except Exception as e:
        return None

def main():
    apps_dir = 'backend/apps'
    integrations_dir = 'backend/integrations'
    
    modules = []
    
    for base_dir in [apps_dir, integrations_dir]:
        if not os.path.exists(base_dir): continue
        for d in os.listdir(base_dir):
            manifest_path = os.path.join(base_dir, d, '__manifest__.py')
            if os.path.exists(manifest_path):
                manifest = read_manifest(manifest_path)
                if manifest:
                    manifest['technical_name'] = d
                    manifest['_layer'] = get_layer(manifest)
                    modules.append(manifest)

    # Sort modules by layer, then section, then name
    modules.sort(key=lambda x: (x['_layer'], x.get('command_center_section', 'Z'), x.get('name', '')))

    md = """# Deep Tier-1 ERP Architecture Map (Odoo Standard)

This document provides a 100% exhaustive, deeply detailed audit of all modules in the BitGuard ERP system. It classifies every module based on its frontend requirements, installability, and exact Odoo-equivalent properties.

## Architectural Layers Defined

1. **Layer 1: Headless Kernel (OS)**: Invisible core routing, security, and multi-tenancy engines. `application: False`
2. **Layer 2: Hidden UI / Master Data**: Base data models (Users, Products) managed from within other apps. `application: False`
3. **Layer 3: Primary Business Apps**: Heavyweight domains with top-level Command Center tiles. `application: True`
4. **Layer 4: External Integrations**: API bridges to external platforms (Stripe, WhatsApp, etc.).

---

## ⚡ Quick Summary (Bird's-Eye View)
*A rapid lookup of all modules grouped by their Architectural Layer and Category.*

"""

    # Generate Quick Summary
    for layer in [1, 2, 3, 4]:
        layer_mods = [m for m in modules if m['_layer'] == layer]
        if not layer_mods: continue
        layer_names = {1: 'Layer 1: Headless / Kernel', 2: 'Layer 2: Hidden UI / Master Data', 3: 'Layer 3: Primary Business Applications', 4: 'Layer 4: External Integrations'}
        md += f"### {layer_names.get(layer)}\n"
        
        # Group by Pillar (for Layer 3) or Category (for others)
        groups = {}
        for mod in layer_mods:
            if layer == 3:
                group_key = mod.get('command_center_section', 'Other')
            else:
                group_key = mod.get('category', 'Uncategorized')
                
            if group_key not in groups:
                groups[group_key] = []
            groups[group_key].append(f"`{mod.get('technical_name')}`")
            
        for group, mods in groups.items():
            md += f"- **{group}**: {', '.join(mods)}\n"
        md += "\n"

    md += "---\n\n## 🔍 Exhaustive Module Details\n\n"

    current_layer = 0
    for mod in modules:
        if mod['_layer'] != current_layer:
            current_layer = mod['_layer']
            layer_names = {1: 'Layer 1: Headless / Kernel', 2: 'Layer 2: Hidden UI / Master Data', 3: 'Layer 3: Primary Business Applications', 4: 'Layer 4: External Integrations'}
            md += f"\n## {layer_names.get(current_layer, 'Other')}\n\n"

        name = mod.get('display_name') or mod.get('name', 'Unknown')
        tech_name = mod.get('technical_name', '')
        summary = mod.get('summary', 'No summary provided.')
        category = mod.get('category', 'Uncategorized')
        section = mod.get('command_center_section', 'N/A')
        application = mod.get('application', False)
        installable = mod.get('installable', True)
        url = mod.get('url', 'Headless / No direct URL')
        depends = ", ".join(mod.get('depends', [])) or 'None'
        
        md += f"### 📦 {name} (`{tech_name}`)\n"
        md += f"> {summary}\n\n"
        md += f"- **Odoo App Category:** `{category}`\n"
        md += f"- **Command Center Pillar:** `{section}`\n"
        md += f"- **Is Application (Has Dashboard Tile?):** `{'True ✅' if application else 'False ❌'}`\n"
        md += f"- **Is Installable (App Store Enabled?):** `{'True ✅' if installable else 'False ❌'}`\n"
        md += f"- **Dependencies (Depends Array):** `{depends}`\n"
        md += f"- **Frontend URL Routing:** `{url}`\n\n"

    with open('SYSTEM_ARCHITECTURE_MAP.md', 'w', encoding='utf-8') as f:
        f.write(md)
    print("Map generated successfully.")

def get_layer(mod):
    tech = mod.get('technical_name')
    if tech in ['auth', 'core', 'system', 'tenants', 'automation'] and not mod.get('application'):
        if tech == 'system': return 3 # Because we made settings an application
        return 1
    elif not mod.get('application') and tech not in ['payments', 'whatsapp', 'ai_engine', 'ai_agent', 'soc']:
        return 2
    elif tech in ['payments', 'whatsapp', 'ai_engine', 'ai_agent', 'soc']:
        return 4
    else:
        return 3

if __name__ == '__main__':
    main()
