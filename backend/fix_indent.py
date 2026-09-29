import os

file_path = "apps/accounting/services/accounting.py"
with open(file_path, "r") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if line.strip() == "from ..domain.models import VendorBill":
        if not line.startswith(" "):
            lines[i] = "from ..domain.models import VendorBill\n"
        elif "class" not in "".join(lines[max(0, i-10):i]):
             lines[i] = "from ..domain.models import VendorBill\n"
    if line.startswith("        from ..domain.models import Invoice, Expense"):
        # this was around 1012, let's look if it's inside a function
        if "def " in "".join(lines[max(0, i-5):i]):
            pass # Keep indentation

with open(file_path, "w") as f:
    f.writelines(lines)
