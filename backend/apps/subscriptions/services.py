from .application.services import *


    @staticmethod
    def get_active_contracts_for_client(client):
        from .domain.models import ServiceContract
        return ServiceContract.objects.filter(client=client, status='active').count()
