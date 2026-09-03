import re
filepath = 'odoo_architecture_sequence.md'
with open(filepath, 'r') as f:
    content = f.read()

# Replace the base mappings in Administration
old_admin = '''## 10. Administration (Sequence: 100)
*System configuration and master controls.*
1. **Settings** (ase) - The master configuration gateway.
2. **Apps** (ase) - The App Store / installer.'''

new_admin = '''## 10. Administration (Sequence: 100)
*System configuration and master controls.*
1. **Settings** (system) - The master configuration gateway.
2. **Apps** (pps) - The App Store / installer.'''

content = content.replace(old_admin, new_admin)

# Remove system from Hidden Kernel
old_kernel = '''### Hidden / Technical Kernel (Sequence: 999)
*These modules operate in the background and are deliberately excluded from standard dashboards to protect system integrity. They are the absolute foundation of the ERP.*
* **Core** (core) - Abstract base models and global routing.
* **System** (system) - System registries and global settings structure.
* **Auth** (uth) - Security gateways, JWT, and login logic.
* **Tenants** (	enants) - Multi-SaaS isolation and data segregation.'''

new_kernel = '''### Hidden / Technical Kernel (Sequence: 999)
*These modules operate in the background and are deliberately excluded from standard dashboards to protect system integrity. They are the absolute foundation of the ERP.*
* **Core** (core) - Abstract base models and global routing.
* **Auth** (uth) - Security gateways, JWT, and login logic.
* **Tenants** (	enants) - Multi-SaaS isolation and data segregation.'''

content = content.replace(old_kernel, new_kernel)

with open(filepath, 'w') as f:
    f.write(content)
print('Patched sequence markdown.')
