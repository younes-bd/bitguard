from django.urls import path
from .views import CommandCenterView, SystemHealthView, MRRView

urlpatterns = [
    path('metrics/', CommandCenterView.as_view(), name='command-center-metrics'),
    path('health/', SystemHealthView.as_view(), name='system-health-status'),
    path('mrr/', MRRView.as_view(), name='executive-mrr'),
]
