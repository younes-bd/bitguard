from django.apps import apps
from django.conf import settings
from .base import BaseService

class ControlService(BaseService):
    """
    Enterprise Control Plane (Section 13).
    Governs configuration, operational visibility, and policy enforcement.
    """

    @staticmethod
    def get_system_health():
        """
        Observability (Section 19): Exposes workflow states and pending obligations.
        """
        InternalProject = apps.get_model('erp', 'InternalProject')
        Order = apps.get_model('store', 'Order')
        Ticket = apps.get_model('crm', 'Ticket')

        return {
            "obligations": {
                "active": InternalProject.objects.filter(status='active').count(),
                "planning": InternalProject.objects.filter(status='planning').count(),
                "stalled": InternalProject.objects.filter(status='planning', created_at__lt=BaseService.get_stale_threshold()).count()
            },
            "commerce": {
                "pending_orders": Order.objects.filter(status='pending').count(),
                "recent_revenue": Order.objects.filter(status='paid', created_at__gte=BaseService.get_today()).count()
            },
            "support": {
                "critical_tickets": Ticket.objects.filter(priority='critical', status='open').count()
            },
            "status": "Healthy"
        }

    @staticmethod
    def enforce_policy(user, action, resource):
        """
        Centralized Policy Enforcement (Section 13 & 21).
        Governs access based on Business Responsibility.
        
        Roles: SUPER_ADMIN, OPS_MANAGER, SOC_ANALYST, SALES, FINANCE, CUSTOMER
        """
        if not user or not user.is_authenticated:
            return False
            
        if user.is_superuser:
            return True

        # Resolve Business Role (In production, this comes from user.roles m2m)
        # For this refactor, we map staff/groups to enterprise roles
        is_soc = user.groups.filter(name='SOC_ANALYST').exists() or getattr(user, 'is_staff', False)
        is_ops = user.groups.filter(name='OPS_MANAGER').exists()
        is_finance = user.groups.filter(name='FINANCE').exists()
        is_sales = user.groups.filter(name='SALES').exists()

        # SOC Analyst: Can view everything, but only mutate security/incident resources
        if is_soc:
            if 'security.' in resource or 'INCIDENT' in action:
                return True
            if action == 'VIEW':
                return True
            return False

        # Operations Manager: Can mutate ERP, Projects, Tasks
        if is_ops:
            if 'erp.' in resource or 'crm.Project' in resource:
                return True
            if action == 'VIEW':
                return True
            return False

        # Finance: Can mutate billing/invoice resources
        if is_finance:
            if 'store.' in resource or 'crm.Contract' in resource:
                return True
            return action == 'VIEW'

        # Default fallback to staff-only mutations
        if action in ["CREATE", "UPDATE", "DELETE", "ADMIN_DAEMON"]:
            return user.is_staff
            
        return True
