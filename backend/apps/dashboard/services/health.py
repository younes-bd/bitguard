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

        # Basic OS/Container Resource Metrics (Simulated/Standard Lib)
        cpu_usage = 0.0
        if hasattr(os, 'getloadavg'):
            try:
                cpu_usage = round((os.getloadavg()[0] / os.cpu_count()) * 100, 2)
            except Exception:
                pass

        return {
            "database": {
                "status": db_status
            },
            "infrastructure": {
                "cpu_percent": cpu_usage,
                "memory_percent": 45.0,  # Placeholder or implement via /proc/meminfo
                "disk_usage": 60.0       # Placeholder
            },
            "platform": {
                "version": "1.0.0-enterprise",
                "environment": os.getenv("DJANGO_ENV", "production")
            }
        }
