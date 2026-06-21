import os
import django
import sys
from decimal import Decimal
import datetime
import uuid

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.tenants.models import Tenant
from apps.users.models import User, TenantMembership
from apps.crm.models import Client, Deal
from apps.projects.domain.models import Project as InternalProject
from apps.hrm.models import Employee, EmployeeContract, PayrollPeriod
from apps.scm.models import Vendor, PurchaseOrder, GoodsReceipt
from apps.accounting.models import Invoice, Payment, JournalEntry, VendorBill
from apps.dashboard.services.analytics import CommandCenterAnalyticsService

def run_e2e_test():
    run_id = str(uuid.uuid4())[:8]
    print(f"--- STARTING ODOO-STYLE E2E WORKFLOW TEST (Run ID: {run_id}) ---")
    
    tenant, _ = Tenant.objects.get_or_create(name=f"E2E Test Corp {run_id}", domain=f"e2e-{run_id}.example.com")
    
    # 1. CRM to Project (Sales -> Delivery)
    print("\n1. CRM -> Projects Workflow")
    client = Client.objects.create(tenant=tenant, name=f"Big Bank Inc. {run_id}", email=f"contact_{run_id}@bigbank.com")
    deal = Deal.objects.create(tenant=tenant, client=client, title="ERP Implementation", amount=Decimal('50000.00'), stage="won")
    project = InternalProject.objects.create(tenant=tenant, name=f"Big Bank ERP Impl {run_id}", client=client, status="active", budget=Decimal('30000.00'))
    print(f"Deal Won: {deal.title} for {deal.amount}")
    print(f"Project Created: {project.name}")

    # 2. HRM (Hire and Payroll)
    print("\n2. HRM Workflow")
    user = User.objects.create(username=f"emp_e2e_{run_id}", email=f"emp_{run_id}@e2e.com")
    TenantMembership.objects.create(user=user, tenant=tenant, is_active=True)
    employee = Employee.objects.create(tenant=tenant, user=user, employee_id=f"EMP-E2E-{run_id}", job_title="Consultant", hire_date="2026-06-01")
    contract = EmployeeContract.objects.create(tenant=tenant, employee=employee, wage=Decimal('5000.00'), status="open", start_date="2026-06-01")
    print(f"Employee Hired: {employee.job_title} at {contract.wage} wage.")

    # 3. SCM Procure-to-Pay Workflow
    print("\n3. SCM Procure-to-Pay Workflow")
    vendor = Vendor.objects.create(tenant=tenant, name=f"Dell {run_id}")
    po = PurchaseOrder.objects.create(tenant=tenant, vendor=vendor, status="confirmed", total_amount=Decimal('2000.00'), order_date=datetime.date(2026,6,16))
    receipt = GoodsReceipt.objects.create(tenant=tenant, purchase_order=po, receipt_number=f"GR-{run_id}", status="done")
    po.status = "received"
    po.save()
    bill = VendorBill.objects.create(tenant=tenant, vendor=vendor, bill_number=f"VB-{run_id}", total_amount=po.total_amount, due_date=datetime.date(2026,6,30), status="draft")
    print(f"PO {po.id} Confirmed -> Received. Vendor Bill Generated for {bill.total_amount}")

    # 4. Accounting (Billing the Client)
    print("\n4. Accounting Workflow (Order-to-Cash)")
    invoice = Invoice.objects.create(tenant=tenant, client=client, invoice_number=f"INV-E2E-{run_id}", status="sent", total_amount=deal.amount, issue_date="2026-06-16", due_date="2026-07-16")
    payment = Payment.objects.create(tenant=tenant, invoice=invoice, amount=deal.amount, payment_date="2026-06-17", payment_method="bank_transfer")
    invoice.status = "paid"
    invoice.save()
    print(f"Invoice {invoice.invoice_number} sent for {invoice.total_amount}. Payment Received.")

    # 5. Dashboard Aggregation
    print("\n5. Command Center Analytics Aggregation")
    metrics = CommandCenterAnalyticsService.get_global_metrics(tenant=tenant)
    print(f"CRM Active Clients: {metrics['crm']['active_clients']}")
    print(f"CRM Recent Revenue: {metrics['crm']['recent_revenue']}")
    print(f"ERP Monthly Collected: {metrics['erp']['monthly_collected']}")
    print(f"HRM Headcount: {metrics['hrm']['headcount']}")
    print(f"SCM Pending Orders: {metrics['scm']['pending_orders']}")
    
    print("\n--- E2E TEST COMPLETED SUCCESSFULLY ---")

if __name__ == '__main__':
    run_e2e_test()
