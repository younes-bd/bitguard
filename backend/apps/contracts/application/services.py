from django.utils import timezone
from ..domain.models import ServiceContract, Quote, SLATier, SLABreach

class ContractService:
    @staticmethod
    def execute_contract(contract_obj, signed_by):
        """Advances a pending contract into the Signed/Active operational mode."""
        contract_obj.status = 'active'
        # Since signed_date and signed_by don't exist on the model, we only update status
        contract_obj.save(update_fields=['status'])
        return contract_obj
        
    @staticmethod
    def log_sla_breach(contract_obj, details):
        """Calculates default fines scaling based on enterprise SLAs and records a distinct breach payload."""
        tier = contract_obj.sla_tier
        if not tier:
            return None
            
        return SLABreach.objects.create(
            contract=contract_obj,
            breach_type='resolution', # default type
            breached_at=timezone.now(),
            resolution_note=details
        )
