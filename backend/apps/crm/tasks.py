from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from apps.crm.domain.models import Lead
from apps.sale.domain.models import SaleOrder

@shared_task
def decay_lead_scores():
    """
    Runs weekly.
    Decreases the score of any Lead that hasn't been updated in over 14 days,
    helping sales focus on active leads.
    """
    threshold_date = timezone.now() - timedelta(days=14)
    
    # Find leads that haven't been updated recently and are not closed/lost
    stale_leads = Lead.objects.filter(
        updated_at__lt=threshold_date,
        status__in=['new', 'contacted', 'qualified']
    )
    
    for lead in stale_leads:
        # Decrease score by 5, but don't go below 0
        new_score = max(0, lead.score - 5)
        if new_score != lead.score:
            lead.score = new_score
            lead.save(update_fields=['score', 'updated_at'])

@shared_task
def auto_expire_quotes():
    """
    Runs daily.
    Checks for Quotes where valid_until has passed and marks them as expired.
    """
    today = timezone.now().date()
    
    expired_quotes = Quote.objects.filter(
        status__in=['draft', 'sent'],
        valid_until__lt=today
    )
    
    for quote in expired_quotes:
        quote.status = 'expired'
        quote.save(update_fields=['status'])

