from apps.core.api.mixins import TenantScopedMixin
from rest_framework import viewsets, status, pagination, views
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404
from django.http import FileResponse
from apps.documents.domain.models import DocumentWorkspace, Tag, Document, DocumentVersion
from apps.core.domain.models import Attachment
from .serializers import DocumentWorkspaceSerializer, TagSerializer, DocumentSerializer, DocumentVersionSerializer

class DocumentWorkspaceViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = DocumentWorkspace.objects.all()
    serializer_class = DocumentWorkspaceSerializer
    permission_classes = [IsAuthenticated]

class TagViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]

class StandardResultsSetPagination(pagination.PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class DocumentViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = Document.objects.select_related('attachment', 'workspace', 'owner').prefetch_related('tags').order_by('-created_at')
    serializer_class = DocumentSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        qs = super().get_queryset()
        workspace = self.request.query_params.get('workspace')
        if workspace:
            qs = qs.filter(workspace_id=workspace)
        tag = self.request.query_params.get('tag')
        if tag:
            qs = qs.filter(tags__id=tag)
            
        source_module = self.request.query_params.get('source_module')
        if source_module:
            qs = qs.filter(source_module=source_module)
            
        source_id = self.request.query_params.get('source_id')
        if source_id:
            qs = qs.filter(source_id=source_id)
            
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(
                Q(attachment__name__icontains=search) | 
                Q(ocr_text__icontains=search)
            )

        is_archived = self.request.query_params.get('is_archived')
        if is_archived is not None:
            qs = qs.filter(is_archived=is_archived.lower() == 'true')
            
        owner = self.request.query_params.get('owner')
        if owner:
            qs = qs.filter(owner_id=owner)
            
        recent_days = self.request.query_params.get('recent_days')
        if recent_days:
            from django.utils import timezone
            import datetime
            cutoff = timezone.now() - datetime.timedelta(days=int(recent_days))
            qs = qs.filter(created_at__gte=cutoff)
            
        return qs

    def create(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        title = request.data.get('title', file_obj.name)
        workspace_id = request.data.get('workspace_id') or request.data.get('workspace')
        tag_ids = request.data.getlist('tag_ids')

        from apps.documents.services import DocumentService
        try:
            document = DocumentService.create_document(
                user=request.user,
                tenant=getattr(request, 'tenant', None),
                file_obj=file_obj,
                title=title,
                workspace_id=workspace_id,
                tag_ids=tag_ids
            )
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(document)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def bump_version(self, request, pk=None):
        document = self.get_object()
        file_obj = request.FILES.get('file')
        new_version_number = request.data.get('version', f"{float(document.version) + 0.1:.1f}")

        from apps.documents.services import DocumentService
        try:
            document = DocumentService.bump_version(
                document=document,
                user=request.user,
                tenant=getattr(request, 'tenant', None),
                file_obj=file_obj,
                new_version_number=new_version_number
            )
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(self.get_serializer(document).data)

    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        document = self.get_object()
        document.is_archived = not document.is_archived
        document.save()
        return Response(self.get_serializer(document).data)

    @action(detail=True, methods=['post'])
    def lock(self, request, pk=None):
        document = self.get_object()
        document.is_locked = not document.is_locked
        document.save()
        return Response(self.get_serializer(document).data)

    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        document = self.get_object()
        document.is_public = True
        document.save(update_fields=['is_public'])
        
        # Build the full public URL using the frontend host
        # Assuming frontend is on window.location.origin
        share_url = f"/shared/document/{document.share_token}"
        
        return Response({
            'share_token': document.share_token,
            'is_public': document.is_public,
            'share_url': share_url
        })

class PublicDocumentView(views.APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, token, format=None):
        document = get_object_or_404(Document, share_token=token, is_public=True)
        if not document.attachment or not document.attachment.file:
            return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)
            
        return FileResponse(document.attachment.file, as_attachment=False, filename=document.attachment.name)

class DocumentVersionViewSet(TenantScopedMixin, viewsets.ReadOnlyModelViewSet):
    queryset = DocumentVersion.objects.all()
    serializer_class = DocumentVersionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        doc_id = self.request.query_params.get('document')
        if doc_id:
            qs = qs.filter(document_id=doc_id)
        return qs

from apps.documents.domain.models import SpreadsheetDocument
from .serializers import SpreadsheetDocumentSerializer

class SpreadsheetDocumentViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SpreadsheetDocumentSerializer
    def get_queryset(self): return SpreadsheetDocument.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else SpreadsheetDocument.objects.all()
