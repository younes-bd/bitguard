from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReportTemplateViewSet, GeneratedReportViewSet, ReportEngineSettingsViewSet

router = DefaultRouter()
router.register(r'templates', ReportTemplateViewSet, basename='report-template')
router.register(r'generated', GeneratedReportViewSet, basename='generated-report')
router.register(r'settings', ReportEngineSettingsViewSet, basename='report-settings')

urlpatterns = [
    path('', include(router.urls)),
]
