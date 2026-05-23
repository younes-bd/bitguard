from django.core.cache import cache
from django.contrib.auth import get_user_model
from django.db.models import Sum
from apps.core.services.base import BaseService
from .models import SystemSetting
from apps.audit.models import AuditLog

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
        
        # Ensure action is one of the choices in AuditLog
        # 'create', 'update', 'delete', 'login', 'logout', 'other'
        valid_actions = ['create', 'update', 'delete', 'login', 'logout', 'other']
        log_action_val = action if action in valid_actions else 'other'
        if action not in valid_actions and 'message' not in details:
            details['original_action'] = action
            details['message'] = f"Action {action} performed on {resource_type}"

        audit_log = AuditLog(
            user=user,
            action=log_action_val,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details,
            ip_address=ip_address
        )
        if tenant:
            audit_log.tenant = tenant
        audit_log.save()
        return audit_log

    def update_setting(self, key, value, user, ip_address=None, tenant=None):
        """
        Updates a system setting and logs the action.
        """
        setting, created = self.model.objects.get_or_create(key=key, tenant=tenant)
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
        Gathers system metrics using actual server telemetry via psutil.
        """
        import psutil
        import time
        from datetime import datetime

        active_users_count = User.objects.filter(is_active=True).count()
        audit_count = AuditLog.objects.count()
        
        # Calculate uptime
        boot_time = psutil.boot_time()
        uptime_seconds = time.time() - boot_time
        days, remainder = divmod(uptime_seconds, 86400)
        hours, remainder = divmod(remainder, 3600)
        minutes, _ = divmod(remainder, 60)
        server_uptime = f"{int(days)}d {int(hours)}h {int(minutes)}m"

        # CPU
        cpu_load = psutil.cpu_percent(interval=0.1)
        cpu_cores_load = psutil.cpu_percent(interval=0.1, percpu=True)

        # Memory
        mem = psutil.virtual_memory()
        
        # Disk
        disk = psutil.disk_usage('/')

        # Simulated Service Health (In a real scenario, this would ping endpoints/DBs)
        services_health = [
            {'name': 'Core Application Service (Django API)', 'status': 'Operational', 'latency': '24ms', 'color': 'bg-emerald-500'},
            {'name': 'Database Instance (PostgreSQL Main)', 'status': 'Operational', 'latency': '4ms', 'color': 'bg-emerald-500'},
            {'name': 'Caching & Session Store (Redis)', 'status': 'Operational', 'latency': '1ms', 'color': 'bg-emerald-500'},
            {'name': 'Background Workers (Celery & RabbitMQ)', 'status': 'Operational', 'latency': '98% Queue Empty', 'color': 'bg-emerald-500'},
            {'name': 'CDN & File Delivery S3 Bucket', 'status': 'Operational', 'latency': '12ms', 'color': 'bg-emerald-500'},
        ]

        return {
            'active_users': active_users_count,
            'error_rate': 0.02, # Keeping as simulated or pull from a log aggregator like Sentry
            'server_uptime': server_uptime,
            'cpu_load': f"{cpu_load}%",
            'cpu_cores_load': cpu_cores_load,
            'memory': {
                'total': mem.total,
                'used': mem.used,
                'percent': mem.percent
            },
            'disk': {
                'total': disk.total,
                'used': disk.used,
                'percent': disk.percent
            },
            'total_audits': audit_count,
            'services_health': services_health
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

    # --- ENTERPRISE EXPANSION ---

    def create_api_key(self, name, user, tenant=None):
        import secrets
        import hashlib
        from .models import PlatformAPIKey
        
        raw_key = f"bg_live_{secrets.token_urlsafe(32)}"
        hashed_key = hashlib.sha256(raw_key.encode()).hexdigest()
        key_prefix = raw_key[:12]
        
        api_key = PlatformAPIKey.objects.create(
            name=name,
            key_prefix=key_prefix,
            hashed_key=hashed_key,
            created_by=user,
            tenant=tenant
        )
        
        self.log_action(user, 'create', 'PlatformAPIKey', str(api_key.id), tenant=tenant)
        return api_key, raw_key

    def register_webhook(self, data, user, tenant=None):
        from .models import WebhookEndpoint
        webhook = WebhookEndpoint.objects.create(tenant=tenant, **data)
        self.log_action(user, 'create', 'WebhookEndpoint', str(webhook.id), tenant=tenant)
        return webhook

    def trigger_backup(self, user, tenant=None):
        import os
        import shutil
        from django.conf import settings
        from django.utils import timezone
        from .models import DatabaseBackup

        # Simulate or perform SQLite backup
        db_path = settings.DATABASES['default']['NAME']
        backup_dir = os.path.join(settings.BASE_DIR, 'backups')
        os.makedirs(backup_dir, exist_ok=True)
        
        timestamp = timezone.now().strftime("%Y%m%d_%H%M%S")
        filename = f"backup_{timestamp}.sqlite3"
        dest_path = os.path.join(backup_dir, filename)
        
        try:
            shutil.copy2(db_path, dest_path)
            size_bytes = os.path.getsize(dest_path)
            status = 'completed'
        except Exception as e:
            size_bytes = 0
            status = f'failed: {str(e)}'

        backup = DatabaseBackup.objects.create(
            filename=filename,
            size_bytes=size_bytes,
            status=status,
            triggered_by=user,
            tenant=tenant
        )
        
        self.log_action(user, 'create', 'DatabaseBackup', str(backup.id), details={'status': status}, tenant=tenant)
        return backup

    def prune_audit_logs(self, days_retention, user, tenant=None):
        from django.utils import timezone
        from datetime import timedelta
        
        threshold = timezone.now() - timedelta(days=days_retention)
        deleted_count, _ = AuditLog.objects.filter(tenant=tenant, created_at__lt=threshold).delete()
        
        self.log_action(user, 'delete', 'AuditLog', details={'message': f'Pruned {deleted_count} logs older than {days_retention} days'}, tenant=tenant)
        return deleted_count
