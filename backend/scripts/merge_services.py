import os

accounting_services_content = """\"\"\"
Accounting Services Layer.
\"\"\"

from ..domain.models import VendorBill
from django.db import transaction
from django.utils import timezone

class VendorBillService:
    @staticmethod
    @transaction.atomic
    def approve_bill(vendor_bill: VendorBill):
        if vendor_bill.status != 'draft':
            raise ValueError("Only draft bills can be approved.")
        vendor_bill.status = 'approved'
        vendor_bill.save()
        
        # Odoo-style matching: Link to General Ledger
        # Credit Accounts Payable
        # Debit Expenses / Inventory
        from apps.accounting.application.services import GeneralLedgerService
        # Simple placeholder request object for now
        class DummyRequest:
            user = None
            def __init__(self, tenant):
                self.tenant = tenant
        
        req = DummyRequest(vendor_bill.tenant)
        GeneralLedgerService.record_entry(
            req, "Expenses", vendor_bill.total_amount, 'debit',
            vendor_bill.pk, 'vendor_bill', f"Bill {vendor_bill.bill_number}"
        )
        GeneralLedgerService.record_entry(
            req, "Accounts Payable", vendor_bill.total_amount, 'credit',
            vendor_bill.pk, 'vendor_bill', f"Bill {vendor_bill.bill_number}"
        )

        return vendor_bill
"""

erp_services_path = "apps/accounting/application/services_erp.py"
accounting_services_path = "apps/accounting/application/services.py"

with open(erp_services_path, "r", encoding="utf-16") as f:
    erp_content = f.read()

# Replace all apps.erp.models with apps.accounting.domain.models etc
replacements = {
    "from apps.erp.models import InternalProject": "from apps.projects.domain.models import Project as InternalProject",
    "from apps.erp.models import Invoice, Payment, Expense": "from apps.accounting.domain.models import Invoice, Payment, Expense",
    "from apps.erp.models import Invoice, Payment": "from apps.accounting.domain.models import Invoice, Payment",
    "from apps.erp.models import Invoice": "from apps.accounting.domain.models import Invoice",
    "from apps.erp.models": "from apps.accounting.domain.models",
    "('erp', 'ERP')": "('projects', 'Projects')"
}

for old, new in replacements.items():
    erp_content = erp_content.replace(old, new)

final_content = erp_content + "\n\n" + accounting_services_content

with open(accounting_services_path, "w", encoding="utf-8") as f:
    f.write(final_content)

print("Merged successfully")
