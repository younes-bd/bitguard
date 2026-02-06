from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import api_views

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/kpi/', api_views.DashboardKPIView.as_view(), name='dashboard-kpi'),
]
