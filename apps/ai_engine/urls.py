from django.urls import path
from . import views

urlpatterns = [
    path('analysis/', views.analysis, name='ai_engine_analysis'),
    path('reports/', views.reports, name='ai_engine_reports'),
    path('api/', views.api, name='{name}_api'),
]