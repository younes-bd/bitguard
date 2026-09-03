from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from apps.maintenance.domain.models import MaintenanceRecord

@shared_task
def generate_recurring_maintenance():
    today = timezone.now().date()
    records = MaintenanceRecord.objects.filter(is_recurring=True, next_due_date__lte=today)
    
    count = 0
    for record in records:
        if not record.recurrence_interval_days:
            continue
            
        MaintenanceRecord.objects.create(
            tenant=record.tenant,
            asset=record.asset,
            maintenance_type=record.maintenance_type,
            performed_by=record.performed_by,
            performed_at=today,
            is_recurring=True,
            recurrence_interval_days=record.recurrence_interval_days,
            next_due_date=today + timedelta(days=record.recurrence_interval_days),
            notes=f"Auto-generated recurring maintenance from record {record.id}"
        )
        record.is_recurring = False
        record.next_due_date = None
        record.save()
        count += 1
        
    return f"Generated {count} recurring maintenance records."
