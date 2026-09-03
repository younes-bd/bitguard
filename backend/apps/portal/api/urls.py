from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PortalAccessViewSet, 
    PortalShareViewSet, 
    PortalDashboardView, 
    PortalInvoiceListView,
    PortalTicketListView,
    PortalOrderListView,
    PortalOrderDetailView,
    PortalProjectListView,
    PortalSubscriptionListView
)

router = DefaultRouter()
router.register(r'access', PortalAccessViewSet, basename='portal-access')
router.register(r'shares', PortalShareViewSet, basename='portal-shares')

urlpatterns = [
    path('dashboard/', PortalDashboardView.as_view(), name='portal-dashboard'),
    path('invoices/', PortalInvoiceListView.as_view(), name='portal-invoices'),
    path('tickets/', PortalTicketListView.as_view(), name='portal-tickets'),
    path('orders/', PortalOrderListView.as_view(), name='portal-orders'),
    path('orders/<int:pk>/', PortalOrderDetailView.as_view(), name='portal-order-detail'),
    path('projects/', PortalProjectListView.as_view(), name='portal-projects'),
    path('subscriptions/', PortalSubscriptionListView.as_view(), name='portal-subscriptions'),
    path('', include(router.urls))
]
