from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PartnerViewSet, CompanySettingsViewSet,
    UoMViewSet, UoMCategoryViewSet, SequenceViewSet, AttachmentViewSet,
    # Chatter system
    RecordMessageViewSet, RecordActivityViewSet, RecordFollowerViewSet,
    FieldChangeLogViewSet, ChatterSummaryView,
    AutomatedActionViewSet, ScheduledActionViewSet,
)

router = DefaultRouter()

# Core domain
router.register(r'partners', PartnerViewSet, basename='partner')
router.register(r'company-settings', CompanySettingsViewSet, basename='company-settings')
router.register(r'uoms', UoMViewSet, basename='uom')
router.register(r'uom-categories', UoMCategoryViewSet, basename='uomcategory')
router.register(r'sequences', SequenceViewSet, basename='sequence')
router.register(r'attachments', AttachmentViewSet, basename='attachment')

# Chatter system (Odoo mail.thread equivalent)
router.register(r'messages', RecordMessageViewSet, basename='record-message')
router.register(r'activities', RecordActivityViewSet, basename='record-activity')
router.register(r'followers', RecordFollowerViewSet, basename='record-follower')
router.register(r'field-changes', FieldChangeLogViewSet, basename='field-change-log')

# Automation
router.register(r'automated-actions', AutomatedActionViewSet, basename='automated-action')
router.register(r'scheduled-actions', ScheduledActionViewSet, basename='scheduled-action')

urlpatterns = [
    path('', include(router.urls)),
    # Unified chatter summary: GET /api/core/chatter/?model=crm.Deal&object_id=<uuid>
    path('chatter/', ChatterSummaryView.as_view(), name='chatter-summary'),
]

