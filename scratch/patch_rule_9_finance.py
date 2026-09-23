import re

with open('.agents/rules/architecture.md', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '*   **3. Accounting & Finance:** ccounting, invoicing, consolidation, spreadsheet, oard, equity',
    '*   **3. Accounting & Finance:** ccounting, invoicing, consolidation, spreadsheet, oard, equity, documents, sign, esg, hr_expense'
)
content = content.replace(
    '*   **8. Human Resources:** hr, hr_recruitment, hr_holidays, hr_attendance, rontdesk, hr_payroll, hr_expense, hr_appraisal, eferrals, leet, lunch, esg',
    '*   **8. Human Resources:** hr, hr_recruitment, hr_holidays, hr_attendance, rontdesk, hr_payroll, hr_appraisal, eferrals, leet, lunch'
)
content = content.replace(
    '*   **9. Productivity:** discuss, 	odo, documents, sign, pprovals, knowledge, calendar, oip',
    '*   **9. Productivity:** discuss, 	odo, pprovals, knowledge, calendar, oip'
)

with open('.agents/rules/architecture.md', 'w', encoding='utf-8') as f:
    f.write(content)
