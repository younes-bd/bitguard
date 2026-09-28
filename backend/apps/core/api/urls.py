from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import LanguageViewSet, TranslationViewSet, AnalyticsViewSet, SequenceViewSet
from apps.core.api.views import InstalledModuleViewSet, ContentTypeViewSet, CommandCenterSectionViewSet, SystemParameterViewSet, ScheduledActionViewSet, DatabaseBackupViewSet

router = DefaultRouter()
router.register(r'languages', LanguageViewSet, basename='core-languages')
router.register(r'translations', TranslationViewSet, basename='core-translations')
router.register(r'sequences', SequenceViewSet, basename='sequences')

router.register(r'modules', InstalledModuleViewSet, basename='core-modules')
router.register(r'content-types', ContentTypeViewSet, basename='core-content-types')
router.register(r'sections', CommandCenterSectionViewSet, basename='core-sections')
router.register(r'parameters', SystemParameterViewSet, basename='core-parameters')
router.register(r'scheduled-actions', ScheduledActionViewSet, basename='core-scheduled-actions')
router.register(r'database-backups', DatabaseBackupViewSet, basename='core-database-backups')

from apps.core.api.views import AuditTrailViewSet, UoMCategoryViewSet, UoMViewSet
router.register(r'audit-logs', AuditTrailViewSet, basename='core-audit-logs')
router.register(r'uom-categories', UoMCategoryViewSet, basename='core-uom-categories')
router.register(r'uoms', UoMViewSet, basename='core-uoms')

urlpatterns = router.urls + [
    path('analytics/global/', AnalyticsViewSet.as_view({'get': 'global_metrics'}), name='core-global-metrics'),
    path('command-center/global/', AnalyticsViewSet.as_view({'get': 'global_metrics'}), name='core-command-center-global'),
    path('command-center/system_health/', AnalyticsViewSet.as_view({'get': 'system_health'}), name='core-command-center-system-health'),
]
