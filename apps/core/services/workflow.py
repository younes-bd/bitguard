from django.db import transaction
from apps.core.services.audit import AuditService
from django.utils import timezone

class WorkflowEngine:
    """
    Centralized Enterprise Workflow Engine (Charter Section 7).
    Governs state transitions for Orders, Services, and Incidents.
    """

    STATES = {
        'ORDER': ['pending', 'paid', 'provisioned', 'fulfilled', 'failed'],
        'SERVICE': ['active', 'suspended', 'completed', 'breached_sla'],
        'INCIDENT': ['new', 'investigating', 'containment', 'resolved', 'closed']
    }

    VALID_TRANSITIONS = {
        'ORDER': {
            'pending': ['paid', 'failed'],
            'paid': ['provisioned', 'failed'],
            'provisioned': ['fulfilled', 'failed'],
            'fulfilled': [],
            'failed': ['pending'] # Allow retry
        },
        'SERVICE': {
            'active': ['suspended', 'completed', 'breached_sla'],
            'suspended': ['active', 'completed'],
            'completed': [],
            'breached_sla': ['active', 'suspended']
        }
        # INCIDENT transitions are matched in IncidentService
    }

    @staticmethod
    def transition(obj, new_state, user, request=None, reason=None):
        """
        Transactional transition with mandatory audit logging.
        """
        entity_type = WorkflowEngine._get_entity_type(obj)
        old_state = getattr(obj, 'status', None)

        if not old_state:
            raise ValueError(f"Entity {obj} does not have a status field.")

        if entity_type not in WorkflowEngine.VALID_TRANSITIONS:
             # Fallback to basic allowed check if not explicitly defined
             pass
        else:
            allowed = WorkflowEngine.VALID_TRANSITIONS[entity_type].get(old_state, [])
            if new_state not in allowed:
                raise ValueError(f"Invalid transition for {entity_type} from {old_state} to {new_state}")

        with transaction.atomic():
            obj.status = new_state
            if hasattr(obj, 'updated_at'):
                obj.updated_at = timezone.now()
            obj.save()

            AuditService.log(
                request,
                action=f"{entity_type}_STATE_TRANSITION",
                resource=f"{obj._meta.app_label}.{obj._meta.model_name}:{obj.pk}",
                payload={
                    "old": old_state,
                    "new": new_state,
                    "user": user.email,
                    "reason": reason
                }
            )

    @staticmethod
    def _get_entity_type(obj):
        from apps.store.models import Order
        from apps.security.models import SecurityIncident
        from apps.erp.models import InternalProject # Mapping Service Obligations to ERP
        
        if isinstance(obj, Order): return 'ORDER'
        if isinstance(obj, SecurityIncident): return 'INCIDENT'
        if hasattr(obj, 'is_service_obligation') and obj.is_service_obligation: return 'SERVICE'
        
        return obj._meta.model_name.upper()
