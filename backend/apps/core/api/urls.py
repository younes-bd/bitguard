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

from apps.core.api.views import SystemEventViewSet, UoMCategoryViewSet, UoMViewSet
router.register(r'system-events', SystemEventViewSet, basename='core-system-events')
router.register(r'uom-categories', UoMCategoryViewSet, basename='core-uom-categories')
router.register(r'uoms', UoMViewSet, basename='core-uoms')

from apps.core.api.views import CurrencyViewSet
from apps.tenants.api.views import TenantViewSet
from apps.core.api.views import CountryViewSet, StateViewSet, ConfigOptionsView

router.register(r'currencies', CurrencyViewSet, basename='core-currencies')
router.register(r'countries', CountryViewSet, basename='core-countries')
router.register(r'states', StateViewSet, basename='core-states')

from apps.core.api.views import CompanyViewSet
urlpatterns = router.urls + [
    path('config-options/', ConfigOptionsView.as_view(), name='core-config-options'),
    path('companies/my_company/', CompanyViewSet.as_view({'get': 'my_company', 'patch': 'my_company'}), name='core-my-company'),
    path('analytics/global/', AnalyticsViewSet.as_view({'get': 'global_metrics'}), name='core-global-metrics'),
    path('command-center/global/', AnalyticsViewSet.as_view({'get': 'global_metrics'}), name='core-command-center-global'),
    path('command-center/system_health/', AnalyticsViewSet.as_view({'get': 'system_health'}), name='core-command-center-system-health'),
]



