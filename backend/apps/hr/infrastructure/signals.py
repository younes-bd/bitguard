from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.hr.domain.models import Employee

@receiver(post_save, sender=Employee)
def trigger_employee_onboarding(sender, instance, created, **kwargs):
    """
    Trigger IAM and ITAM tasks when a new employee is created.
    """
    if created:
        from apps.hr.domain.models import OnboardingInstance, OnboardingTask
        from django.utils import timezone
        
        onboarding = OnboardingInstance.objects.create(
            employee=instance,
            tenant=instance.tenant,
            start_date=timezone.now().date(),
        )
        
        OnboardingTask.objects.create(
            onboarding=onboarding,
            tenant=instance.tenant,
            title=f"Provision IT Equipment & IAM User for {instance.user.username}",
            category='it_setup',
            status='pending'
        )
