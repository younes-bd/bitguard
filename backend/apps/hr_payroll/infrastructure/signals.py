from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.hr_payroll.domain.models import Payslip
from apps.notifications.application.services import NotificationService

@receiver(post_save, sender=Payslip)
def payslip_generated(sender, instance, created, **kwargs):
    if instance.state == 'done':
        NotificationService.create_notification(
            user=instance.employee.user,
            tenant=instance.tenant,
            n_type='hrm',
            title='Payslip Generated',
            message=f'Your payslip for {instance.date_from} to {instance.date_to} is ready.'
        )
