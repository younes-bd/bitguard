with open('odoo_architecture_sequence.md', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('4. **Spreadsheet** (spreadsheet_dashboard) - Financial BI and reporting.\n', '')
content = content.replace('5. **Dashboards** (oard) - Custom KPI dashboards and pinned executive views.\n', '')

content = content.replace('9. **IoT** (iot) - Machine integration (scales, cameras, foot pedals).\n', '9. **IoT** (iot) - Machine integration (scales, cameras, foot pedals).\n10. **Spreadsheet** (spreadsheet_dashboard) - Data BI and reporting.\n11. **Dashboards** (oard) - Custom KPI dashboards.\n')

with open('odoo_architecture_sequence.md', 'w', encoding='utf-8') as f:
    f.write(content)
print('Patched odoo_architecture_sequence.md for board and spreadsheet')
