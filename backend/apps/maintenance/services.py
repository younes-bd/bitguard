from .application.services import *

class MaintenanceService:
    @staticmethod
    def get_assets_for_client(client):
        from .domain.models import Asset
        return Asset.objects.filter(client=client).count()
