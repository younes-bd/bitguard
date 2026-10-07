from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import LanguageViewSet, TranslationViewSet, AnalyticsViewSet, SequenceViewSet
from apps.base.api.views import InstalledModuleViewSet, ContentTypeViewSet, CommandCenterSectionViewSet, SystemParameterViewSet, ScheduledActionViewSet, DatabaseBackupViewSet

router = DefaultRouter()
router.register(r'languages', LanguageViewSet, basename='base-languages')
router.register(r'translations', TranslationViewSet, basename='base-translations')
router.register(r'sequences', SequenceViewSet, basename='sequences')

router.register(r'modules', InstalledModuleViewSet, basename='base-modules')
router.register(r'content-types', ContentTypeViewSet, basename='base-content-types')
router.register(r'sections', CommandCenterSectionViewSet, basename='base-sections')
router.register(r'parameters', SystemParameterViewSet, basename='base-parameters')
router.register(r'scheduled-actions', ScheduledActionViewSet, basename='base-scheduled-actions')
router.register(r'database-backups', DatabaseBackupViewSet, basename='base-database-backups')

from apps.base.api.views import SystemEventViewSet, UoMCategoryViewSet, UoMViewSet
router.register(r'system-events', SystemEventViewSet, basename='base-system-events')
router.register(r'uom-categories', UoMCategoryViewSet, basename='base-uom-categories')
router.register(r'uoms', UoMViewSet, basename='base-uoms')

from apps.base.api.views import CurrencyViewSet
from apps.tenants.api.views import TenantViewSet
from apps.base.api.views import CountryViewSet, StateViewSet, ConfigOptionsView

router.register(r'currencies', CurrencyViewSet, basename='base-currencies')
router.register(r'countries', CountryViewSet, basename='base-countries')
router.register(r'states', StateViewSet, basename='base-states')

from apps.base.api.views import CompanyViewSet
urlpatterns = router.urls + [
    path('config-options/', ConfigOptionsView.as_view(), name='core-config-options'),
    path('companies/my_company/', CompanyViewSet.as_view({'get': 'my_company', 'patch': 'my_company'}), name='core-my-company'),
    path('analytics/global/', AnalyticsViewSet.as_view({'get': 'global_metrics'}), name='core-global-metrics'),
    path('command-center/global/', AnalyticsViewSet.as_view({'get': 'global_metrics'}), name='core-command-center-global'),
    path('command-center/system_health/', AnalyticsViewSet.as_view({'get': 'system_health'}), name='core-command-center-system-health'),
]



