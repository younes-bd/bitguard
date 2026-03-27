from django.core.cache import cache
from django.contrib.auth import get_user_model
from django.db.models import Sum
from apps.core.services.base import BaseService
from .models import SystemSetting, AuditTrail

User = get_user_model()

class SysadminService(BaseService):
    """
    Business logic layer for System Administration.
    """
    model = SystemSetting

    def get_public_settings(self):
        return self.model.objects.filter(is_public=True)

    def log_action(self, user, action, resource_type, resource_id="", details=None, ip_address=None, tenant=None):
        if details is None:
            details = {}
        
        audit_trail = AuditTrail(
            user=user,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details,
            ip_address=ip_address
        )
        if tenant:
            audit_trail.tenant = tenant
        audit_trail.save()
        return audit_trail

    def update_setting(self, key, value, user, ip_address=None):
        """
        Updates a system setting and logs the action.
        """
        setting, created = self.model.objects.get_or_create(key=key)
        old_value = setting.value
        setting.value = value
        setting.save()

        # Log via Audit Trail
        self.log_action(
            user=user,
            action='settings_change',
            resource_type='SystemSetting',
            resource_id=key,
            details={'old_value': old_value, 'new_value': value},
            ip_address=ip_address,
            tenant=getattr(setting, 'tenant', None)
        )
        
        
        return setting
        
    def get_system_metrics(self):
        """
        Gathers system metrics like active users, estimated load, etc.
        """
        # In a real enterprise system, these would query Redis, Celery queues, OS stats.
        # We are simulating them for the scope of this scaffold.
        active_users_count = User.objects.filter(is_active=True).count()
        audit_count = AuditTrail.objects.count()
        return {
            'active_users': active_users_count,
            'error_rate': 0.02, # Simulated value
            'server_uptime': '99.99%', # Simulated value
            'cpu_load': '34%', # Simulated value
            'total_audits': audit_count
        }

    def clear_django_cache(self, user, ip_address=None, tenant=None):
        cache.clear()
        self.log_action(
            user=user, action='clear_cache', resource_type='System', 
            details={'message': 'System cache cleared globally'},
            ip_address=ip_address, tenant=tenant
        )
        return True

    def sync_search_indexes(self, user, ip_address=None, tenant=None):
        # Trigger background task or celery job here in a real scenario
        self.log_action(
            user=user, action='sync_indexes', resource_type='System', 
            details={'message': 'Search indexes synchronization triggered'},
            ip_address=ip_address, tenant=tenant
        )
        return True

    def toggle_maintenance_mode(self, user, ip_address=None, tenant=None):
        setting, created = self.model.objects.get_or_create(key='maintenance_mode')
        old_value = setting.value or 'false'
        new_value = 'false' if old_value.lower() == 'true' else 'true'
        setting.value = new_value
        setting.save()

        self.log_action(
            user=user, action='settings_change', resource_type='SystemSetting', resource_id='maintenance_mode',
            details={'old_value': old_value, 'new_value': new_value, 'message': f'Maintenance mode toggled to {new_value}'},
            ip_address=ip_address, tenant=tenant
        )
        return new_value
