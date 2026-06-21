from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from ..domain.models import ServicePage, Page, MediaAsset
from .serializers import ServicePageSerializer, PageSerializer, MediaAssetSerializer

class ServicePageViewSet(viewsets.ModelViewSet):
    """
    Content pages for services.
    Public can read, Admin can edit.
    """
    queryset = ServicePage.objects.all().order_by('title')
    serializer_class = ServicePageSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return ServicePage.objects.all().order_by('title')
        return ServicePage.objects.filter(status='published').order_by('title')

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def publish(self, request, slug=None):
        page = self.get_object()
        page.status = 'published'
        page.published_at = timezone.now()
        page.save()
        return Response(self.get_serializer(page).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def unpublish(self, request, slug=None):
        page = self.get_object()
        page.status = 'draft'
        page.save()
        return Response(self.get_serializer(page).data)
        
    lookup_field = 'slug'

class PageViewSet(viewsets.ModelViewSet):
    """
    CMS Content Pages.
    Admin can CRUD. Public can Read published.
    """
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
    
    lookup_field = 'slug'

    def get_queryset(self):
        if self.request.user.is_staff:
            return Page.objects.all()
        return Page.objects.filter(status='published')

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def publish(self, request, slug=None):
        page = self.get_object()
        page.status = 'published'
        page.published_at = timezone.now()
        page.save()
        return Response(self.get_serializer(page).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def unpublish(self, request, slug=None):
        page = self.get_object()
        page.status = 'draft'
        page.save()
        return Response(self.get_serializer(page).data)

class MediaAssetViewSet(viewsets.ModelViewSet):
    """
    Media Asset Management.
    """
    queryset = MediaAsset.objects.all().order_by('-created_at')
    serializer_class = MediaAssetSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
