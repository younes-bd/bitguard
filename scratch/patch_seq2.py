with open('odoo_architecture_sequence.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove from Productivity
content = content.replace('3. **Documents** (documents) - Paperless document management (OCR).\n', '')
content = content.replace('4. **Sign** (sign) - eSignature requests.\n', '')

# Remove from HR
content = content.replace('7. **Expenses** (hr_expense) - Employee reimbursements.\n', '')
content = content.replace('12. **ESG** (esg) - Environmental, Social, and Governance compliance.\n', '')

# Add to Finance
content = content.replace('6. **Equity** (equity) - Cap table management.\n', '6. **Equity** (equity) - Cap table management.\n7. **Documents** (documents) - Paperless document management (OCR).\n8. **Sign** (sign) - eSignature requests.\n9. **ESG** (esg) - Environmental, Social, and Governance compliance.\n10. **Expenses** (hr_expense) - Employee reimbursements.\n')

with open('odoo_architecture_sequence.md', 'w', encoding='utf-8') as f:
    f.write(content)
print('Patched odoo_architecture_sequence.md')
