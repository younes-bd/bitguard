from django.dispatch import Signal

# Core generic signals for cross-domain event-driven architecture
lifecycle_transition = Signal()
obligation_created = Signal()
