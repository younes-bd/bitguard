from django.urls import path
from .views import ClientDashboardView

urlpatterns = [
    path('dashboard/', ClientDashboardView.as_view(), name='portal-dashboard'),
]
