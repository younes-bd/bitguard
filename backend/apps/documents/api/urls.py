from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DocumentWorkspaceViewSet, TagViewSet, DocumentViewSet, DocumentVersionViewSet, PublicDocumentView

router = DefaultRouter()
router.register(r'workspaces', DocumentWorkspaceViewSet, basename='workspace')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'vault', DocumentViewSet, basename='document')
router.register(r'versions', DocumentVersionViewSet, basename='version')

from .views import SpreadsheetDocumentViewSet
router.register(r'spreadsheet-documents', SpreadsheetDocumentViewSet, basename='spreadsheetdocument')

urlpatterns = [
    path('public/<uuid:token>/', PublicDocumentView.as_view(), name='public-document'),
    path('', include(router.urls)),
]
