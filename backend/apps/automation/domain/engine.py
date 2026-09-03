import logging
from .models import AutomatedAction

logger = logging.getLogger(__name__)

class AutomationEngine:
    @classmethod
    def evaluate_rules(cls, instance, model_name, trigger_type):
        """
        Finds all active rules for this model/trigger and executes them.
        """
        # Determine the tenant from the instance if it exists
        tenant_id = getattr(instance, 'tenant_id', None)
        
        if not tenant_id:
            return

        # Fetch matching active rules
        rules = AutomatedAction.objects.filter(
            tenant_id=tenant_id,
            is_active=True,
            model_name=model_name,
            trigger=trigger_type
        )

        for rule in rules:
            if cls._check_conditions(instance, rule.filter_domain):
                cls._execute_action(instance, rule)

    @classmethod
    def _check_conditions(cls, instance, filter_domain):
        """
        Evaluates the filter_domain JSON against the instance.
        If empty, returns True.
        """
        if not filter_domain:
            return True
            
        # Example naive evaluation: {"status": "high"}
        for key, expected_val in filter_domain.items():
            actual_val = getattr(instance, key, None)
            if actual_val != expected_val:
                return False
                
        return True

    @classmethod
    def _execute_action(cls, instance, rule):
        """
        Executes the requested action (Update Field, Send Email, etc.)
        """
        logger.info(f"Executing Automation Rule: {rule.name} on {instance}")
        
        action_type = rule.action_type
        action_data = rule.action_data
        
        try:
            if action_type == 'update_field':
                # action_data: {"field": "status", "value": "escalated"}
                field = action_data.get('field')
                value = action_data.get('value')
                if field and hasattr(instance, field):
                    setattr(instance, field, value)
                    instance.save(update_fields=[field])
                    logger.info(f"Updated {field} to {value}")
                    
            elif action_type == 'send_email':
                # Hook into email service
                pass
                
        except Exception as e:
            logger.error(f"Error executing rule {rule.name}: {e}")
