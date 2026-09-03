import os
from celery import Celery

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')

app = Celery('config')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')

# Master Cron Engine Schedule
# This configures Celery Beat to run the master engine every minute.
# The master engine will check the core_scheduledaction table and execute due tasks.
app.conf.beat_schedule = {
    'master-cron-engine': {
        'task': 'core.run_due_scheduled_actions',
        'schedule': 60.0,  # every 60 seconds
    },
    'check-sla-breaches-every-hour': {
        'task': 'apps.helpdesk.tasks.check_sla_breaches',
        'schedule': 3600.0,  # every hour
    },
}
