from django.core.management.base import BaseCommand
from apps.reporting.domain.models import ReportTemplate
from apps.reporting.services.pdf_generator import ReportingService
from django.apps import apps
from apps.tenants.domain.models import Tenant
from django.utils import timezone
from decimal import Decimal

class DummyLine:
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)
    
    @property
    def product(self):
        class P: name = "Test Product"
        return P()
    
    @property
    def location(self):
        class L: name = "Test Location"
        return L()
    
    @property
    def account(self):
        class A: name = "Test Account"
        return A()

class DummyRelated:
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)

from unittest.mock import patch
from django.contrib.contenttypes.models import ContentType

class DummyMeta:
    def __init__(self, app_label, model_name):
        self.app_label = app_label
        self.model_name = model_name

class DummyRecord:
    def __init__(self, app_label, model_name, tenant, **kwargs):
        self._meta = DummyMeta(app_label, model_name)
        self.tenant = tenant
        for k, v in kwargs.items():
            setattr(self, k, v)
            
    def __str__(self):
        return self.name if hasattr(self, 'name') else str(getattr(self, 'id', 'dummy'))

class DummyManager:
    def __init__(self, items):
        self.items = items
    def all(self):
        return self.items

class Command(BaseCommand):
    help = 'Test all PDF templates by mocking records if none exist'

    def handle(self, *args, **options):
        tenant = Tenant.objects.first()
        if not tenant:
            self.stdout.write("No tenant found.")
            return
            
        templates = ReportTemplate.objects.filter(tenant=tenant)
        self.stdout.write(f"Testing {templates.count()} templates...")
        
        success = 0
        failed = 0
        
        client = DummyRelated(name="Test Client", address="123 Test St", tax_id="TAX123")
        vendor = DummyRelated(name="Test Vendor")
        employee = DummyRelated(name="Test Employee", job_title="Developer")
        
        with patch('django.contrib.contenttypes.models.ContentTypeManager.get_for_model') as mock_ct:
            mock_ct.return_value = ContentType.objects.first()
            for tpl in templates:
                self.stdout.write(f"Testing template {tpl.name} ({tpl.model})...")
                try:
                    if tpl.model == 'accounting.VATReport':
                        # Special case, not a real model
                        # For VAT Report, the HTML relies on `report_data` passed directly, but the test doesn't do that yet.
                        # We can mock it inside the service or just generate a blank one.
                        attachment = ReportingService.generate_pdf(tpl, DummyRecord(app_label='accounting', model_name='VATReport', tenant=tenant, id=1, name="VAT"))
                        if attachment:
                            self.stdout.write(f"  SUCCESS: Generated VAT Report")
                            success += 1
                        else:
                            failed += 1
                        continue

                    app_label, model_name = tpl.model.split('.')
                    model_class = apps.get_model(app_label, model_name)
                    record = model_class.objects.filter(tenant=tenant).first()
                    
                    if not record:
                        # Create a dummy record in memory
                        record = DummyRecord(
                            app_label=app_label,
                            model_name=model_name,
                            tenant=tenant,
                            id=999,
                            name=f"DUMMY-{model_name}-999",
                            invoice_number="INV-DUMMY-999",
                            issue_date=timezone.now(),
                            due_date=timezone.now(),
                            date=timezone.now(),
                            date_order=timezone.now(),
                            payment_date=timezone.now(),
                            start_date=timezone.now(),
                            date_from=timezone.now(),
                            date_to=timezone.now(),
                            scheduled_date=timezone.now(),
                            client=client,
                            partner=vendor,
                            employee=employee,
                            vendor=vendor,
                            subtotal=Decimal('100.00'),
                            amount_total=Decimal('100.00'),
                            total_amount=Decimal('100.00'),
                            total=Decimal('100.00'),
                            wage=Decimal('5000.00'),
                            currency="$",
                            state="Done",
                            status="Done",
                            severity="High",
                            title="Dummy Incident",
                            description="Dummy description",
                            items=DummyManager([
                                DummyLine(description="Item 1", quantity=1, unit_price=Decimal('50'), tax_rate=10, discount=0, total=Decimal('55')),
                                DummyLine(description="Item 2", quantity=2, unit_price=Decimal('25'), tax_rate=0, discount=0, total=Decimal('50')),
                            ]),
                            lines=DummyManager([
                                DummyLine(name="Line 1", product_qty=1, price_unit=Decimal('50'), price_subtotal=Decimal('50'), theoretical_qty=1, debit=Decimal('100'), credit=Decimal('0'), total=Decimal('100')),
                            ]),
                            move_lines=DummyManager([
                                DummyLine(product_uom_qty=10, quantity_done=10),
                            ])
                        )
                    
                    attachment = ReportingService.generate_pdf(tpl, record)
                    if attachment:
                        self.stdout.write(f"  SUCCESS: Generated {tpl.name} ({attachment.file.size} bytes)")
                        success += 1
                    else:
                        self.stdout.write(f"  FAILED: Returned None")
                        failed += 1
                except Exception as e:
                    self.stdout.write(f"  FAILED: {e}")
                    failed += 1
                
        self.stdout.write(f"\nSummary: {success} successes, {failed} failures.")
