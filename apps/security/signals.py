from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import SecurityAlert
from .services import ScoringEngine, RuleEngine

@receiver(post_save, sender=SecurityAlert)
def alert_processor(sender, instance, created, **kwargs):
    if created:
        # Calculate Risk/Score
        if instance.score == 0:
            score = ScoringEngine.calculate_score(instance)
            instance.score = score
            instance.save(update_fields=['score'])
        
        # Assign Playbook / Detect Action
        playbook = RuleEngine.evaluate(instance)
        if playbook:
            # Create a linked RemediationAction or Incident automatically
            # For now, just log or update context if needed
            # instance.assigned_playbook = playbook 
            # instance.save()
            pass
