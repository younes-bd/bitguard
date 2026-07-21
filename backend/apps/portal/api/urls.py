from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PortalAccessViewSet, 
    PortalShareViewSet, 
    PortalDashboardView, 
    PortalInvoiceListView
)

router = DefaultRouter()
router.register(r'access', PortalAccessViewSet, basename='portal-access')
router.register(r'shares', PortalShareViewSet, basename='portal-shares')

urlpatterns = [
    path('dashboard/', PortalDashboardView.as_view(), name='portal-dashboard'),
    path('invoices/', PortalInvoiceListView.as_view(), name='portal-invoices'),
    path('', include(router.urls))
]
