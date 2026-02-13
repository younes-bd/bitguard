from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ClientViewSet, TicketViewSet, ContractViewSet, ProjectViewSet, 
    ActivityLogViewSet, ContactViewSet, DealViewSet, InteractionViewSet,
    CrmOrderViewSet
)

router = DefaultRouter()
router.register(r'clients', ClientViewSet)
router.register(r'tickets', TicketViewSet)
router.register(r'contracts', ContractViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'activity-logs', ActivityLogViewSet)
router.register(r'contacts', ContactViewSet)
router.register(r'deals', DealViewSet)
router.register(r'interactions', InteractionViewSet)
router.register(r'orders', CrmOrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
]