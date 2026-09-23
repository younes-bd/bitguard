with open('odoo_architecture_sequence.md', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('7. **IoT** (iot) - Machine integration (scales, cameras, foot pedals).\n', '')
content = content.replace('8. **VoIP** (oip) - Integrated SIP telephony.\n', '8. **VoIP** (oip) - Integrated SIP telephony.\n9. **IoT** (iot) - Machine integration (scales, cameras, foot pedals).\n')

with open('odoo_architecture_sequence.md', 'w', encoding='utf-8') as f:
    f.write(content)
print('Patched odoo_architecture_sequence.md')
