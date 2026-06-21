import re

path = "apps/accounting/application/services.py"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

content = re.sub(r'class RecurringInvoiceService.*?(?=class |$)', '', content, flags=re.DOTALL)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Cleaned services 2")
