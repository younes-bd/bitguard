from celery import shared_task
from django.utils import timezone
from django.apps import apps
import logging
import traceback
from dateutil.relativedelta import relativedelta

logger = logging.getLogger(__name__)

@shared_task(name='core.run_due_scheduled_actions')
def run_due_scheduled_actions():
    """
    Master Cron Engine:
    This task runs every 1 minute. It queries the custom ScheduledAction model
    to find any actions that are due to run (is_active=True and next_run <= now).
    It then executes the target method dynamically and schedules the next run.
    """
    # Import inside task to avoid circular imports during app initialization
    from apps.core.domain.models import ScheduledAction
    
    now = timezone.now()
    # Find active tasks that are due, or have never run but are active and have a next_run in the past
    due_actions = ScheduledAction.objects.filter(
        is_active=True,
        next_run__lte=now
    )
    
    if not due_actions.exists():
        return "No scheduled actions due."
        
    executed = []
    errors = []
    
    for action in due_actions:
        try:
            logger.info(f"Executing scheduled action: {action.name} ({action.model_name}.{action.method_name})")
            
            # Resolve model
            app_label, model_name = action.model_name.split('.')
            model_class = apps.get_model(app_label, model_name)
            
            # Resolve method (can be on the manager or on the model class if it's a classmethod)
            method = getattr(model_class.objects, action.method_name, None)
            if not method:
                method = getattr(model_class, action.method_name, None)
                
            if not method:
                raise AttributeError(f"Method '{action.method_name}' not found on model '{action.model_name}'")
                
            # Execute method
            method()
            
            # Update success status
            action.last_run = now
            action.last_error = ''
            
            # Calculate next run
            if action.interval_type == 'minutes':
                delta = relativedelta(minutes=action.interval_number)
            elif action.interval_type == 'hours':
                delta = relativedelta(hours=action.interval_number)
            elif action.interval_type == 'days':
                delta = relativedelta(days=action.interval_number)
            elif action.interval_type == 'weeks':
                delta = relativedelta(weeks=action.interval_number)
            elif action.interval_type == 'months':
                delta = relativedelta(months=action.interval_number)
            else:
                delta = relativedelta(days=action.interval_number)
                
            action.next_run = now + delta
            action.save()
            
            executed.append(action.name)
            logger.info(f"Successfully executed {action.name}. Next run at {action.next_run}")
            
        except Exception as e:
            error_msg = f"Error executing {action.name}: {str(e)}\n{traceback.format_exc()}"
            logger.error(error_msg)
            action.last_run = now
            action.last_error = error_msg
            # We still bump next_run so it doesn't get stuck infinitely looping and crashing
            # You might want to disable it if it fails repeatedly, but for now we just bump it
            try:
                if action.interval_type == 'minutes':
                    delta = relativedelta(minutes=action.interval_number)
                elif action.interval_type == 'days':
                    delta = relativedelta(days=action.interval_number)
                else:
                    delta = relativedelta(hours=1) # Bump by 1 hour as fallback
                action.next_run = now + delta
                action.save()
            except Exception:
                pass
            errors.append(action.name)
            
    summary = f"Executed: {len(executed)}. Errors: {len(errors)}."
    return summary
