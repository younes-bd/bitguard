import os
import platform
from django.db import connection
from django.db.utils import OperationalError

class SystemHealthService:
    @classmethod
    def get_system_status(cls):
        """
        Retrieves core infrastructure metrics for the Admin Command Center.
        Uses standard library instead of psutil to avoid C-bindings.
        """
        db_status = 'Healthy'
        try:
            connection.ensure_connection()
        except OperationalError:
            db_status = 'Unreachable'

        # Basic OS/Container Resource Metrics using psutil
        try:
            import psutil
            cpu_usage = psutil.cpu_percent(interval=0.1)
            memory_percent = psutil.virtual_memory().percent
            disk_usage = psutil.disk_usage('/').percent
        except ImportError:
            cpu_usage = 0.0
            memory_percent = 0.0
            disk_usage = 0.0

        return {
            "database": {
                "status": db_status
            },
            "infrastructure": {
                "cpu_percent": cpu_usage,
                "memory_percent": memory_percent,
                "disk_usage": disk_usage
            },
            "platform": {
                "version": "1.0.0-enterprise",
                "environment": os.getenv("DJANGO_ENV", "production")
            }
        }
