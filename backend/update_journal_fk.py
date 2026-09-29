import os

file_path = "apps/accounting/domain/models.py"
with open(file_path, "r") as f:
    content = f.read()

content = content.replace("currency = models.ForeignKey(Currency,", "currency = models.ForeignKey('core.Currency',")

with open(file_path, "w") as f:
    f.write(content)
