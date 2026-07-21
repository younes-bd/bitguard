import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

import logging
logging.basicConfig(level=logging.WARNING)

from apps.board.services.analytics import CommandCenterAnalyticsService
from apps.tenants.domain.models import Tenant
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum

def test_metrics(tenant):
    now = timezone.now()
    thirty_days_ago = now - timedelta(days=30)
    print("Starting CRM")
    from apps.crm.domain.models import Client, Deal
    clients = Client.objects.filter(tenant=tenant)
    print("CRM active clients:", clients.filter(status="active").count())
    print("Starting Store")
    from apps.ecommerce.domain.models import Order
    orders = Order.objects.filter(tenant=tenant)
    print("Store orders:", orders.count())
    print("Starting ERP")
    from apps.accounting.domain.models import Invoice, Payment
    invoices = Invoice.objects.filter(tenant=tenant)
    print("ERP invoices:", invoices.count())
    print("Starting Support")
    from apps.helpdesk.domain.models import Ticket
    tickets = Ticket.objects.filter(tenant=tenant)
    print("Support tickets:", tickets.count())
    print("Starting Marketing")
    from apps.marketing.domain.models import Campaign
    campaigns = Campaign.objects.filter(tenant=tenant)
    print("Marketing campaigns:", campaigns.count())
    print("Starting Security")
    from apps.soc.domain.models import Alert, Incident, ManagedEndpoint
    alerts = Alert.objects.filter(tenant=tenant)
    endpoints = ManagedEndpoint.objects.filter(workspace__tenant=tenant)
    print("Security alerts:", alerts.count())
    print("Security endpoints:", endpoints.count())
    print("Starting HRM")
    from apps.hr.domain.models import Employee
    employees = Employee.objects.filter(tenant=tenant)
    print("HRM employees:", employees.count())
    print("Starting SCM")
    from apps.scm.domain.models import PurchaseOrder
    pos = PurchaseOrder.objects.filter(tenant=tenant)
    print("SCM pos:", pos.count())
    print("Done")

tenant_id = 'cfc72aac-52e3-44fb-847c-5041cbd1bda2'
try:
    tenant = Tenant.objects.get(id=tenant_id)
    test_metrics(tenant)
except Exception as e:
    print("Error:", e)
