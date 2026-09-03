from .application.services import *


    @staticmethod
    def get_open_tickets_for_client(client):
        from .domain.models import Ticket
        return Ticket.objects.filter(client=client, status__in=['open', 'in_progress']).count()
