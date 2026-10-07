from apps.base.services.core import BaseService

class DatabaseBackupService(BaseService):
    """
    Service responsible for database backup operations.
    Moved here to adhere to Rule 37 (Layer 1 Infrastructure Ownership).
    """

    def trigger_backup(self, user, tenant=None):
        import os
        import shutil
        from django.conf import settings
        from django.utils import timezone
        from apps.base.domain.models import DatabaseBackup

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
        
        # Log action (assuming BaseService or similar has log_action, but wait: SettingsService had log_action!
        # Let's just create an SystemEventLog record directly if needed.
        from apps.base.domain.models import SystemEventLog
        SystemEventLog.objects.create(
            user=user,
            tenant=tenant,
            action='create',
            resource_type='DatabaseBackup',
            resource_id=str(backup.id),
            details={'status': status}
        )
        return backup
