from django.utils import timezone
from .models import ServiceContract, Quote, SLATier, SLABreach

class ContractService:
    @staticmethod
    def execute_contract(contract_obj, signed_by):
        """Advances a pending contract into the Signed/Active operational mode."""
        contract_obj.status = 'active'
        contract_obj.signed_date = timezone.now()
        contract_obj.signed_by = signed_by
        contract_obj.save()
        return contract_obj
        
    @staticmethod
    def log_sla_breach(contract_obj, details):
        """Calculates default fines scaling based on enterprise SLAs and records a distinct breach payload."""
        tier = contract_obj.sla_tier
        if not tier:
            return None
            
        return SLABreach.objects.create(
            contract=contract_obj,
            breach_date=timezone.now(),
            description=details,
            penalty_amount=tier.penalty_amount if hasattr(tier, 'penalty_amount') else 0.00
        )
