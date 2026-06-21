from rest_framework import viewsets, status, pagination, views
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404
from django.http import FileResponse
from apps.edms.domain.models import DocumentWorkspace, Tag, Document, DocumentVersion
from apps.core.domain.models import Attachment
from .serializers import DocumentWorkspaceSerializer, TagSerializer, DocumentSerializer, DocumentVersionSerializer

class DocumentWorkspaceViewSet(viewsets.ModelViewSet):
    queryset = DocumentWorkspace.objects.all()
    serializer_class = DocumentWorkspaceSerializer
    permission_classes = [IsAuthenticated]

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]

class StandardResultsSetPagination(pagination.PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.select_related('attachment', 'workspace', 'owner').prefetch_related('tags').all()
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
            
        return qs

    def create(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Max file size 50MB (could be a setting later)
        if file_obj.size > 50 * 1024 * 1024:
            return Response({'error': 'File too large. Maximum size is 50MB.'}, status=status.HTTP_400_BAD_REQUEST)

        # Basic file type check
        allowed_types = ['application/pdf', 'image/png', 'image/jpeg', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
        if file_obj.content_type not in allowed_types:
             return Response({'error': 'Unsupported file type.'}, status=status.HTTP_400_BAD_REQUEST)

        title = request.data.get('title', file_obj.name)
        workspace_id = request.data.get('workspace_id')
        
        # 1. Create the Document instance first (to get an ID for Attachment)
        document = Document.objects.create(
            workspace_id=workspace_id,
            owner=request.user,
            # We will set attachment shortly
        )

        # 2. Create the Attachment
        content_type = ContentType.objects.get_for_model(Document)
        attachment = Attachment.objects.create(
            name=title,
            res_model=content_type,
            res_id=str(document.id),
            mimetype=file_obj.content_type,
            file_size=file_obj.size,
            file=file_obj
        )

        # 3. Link them
        document.attachment = attachment
        document.save()

        # Handle tags if provided
        tag_ids = request.data.getlist('tag_ids')
        if tag_ids:
            document.tags.set(tag_ids)

        # Trigger text extraction for search indexing
        document.extract_text()

        serializer = self.get_serializer(document)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def bump_version(self, request, pk=None):
        document = self.get_object()
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        notes = request.data.get('notes', '')
        new_version_number = request.data.get('version', f"{float(document.version) + 0.1:.1f}")

        # 1. Save current attachment to history
        DocumentVersion.objects.create(
            document=document,
            attachment=document.attachment,
            version_number=document.version,
            created_by=request.user,
            notes="Archived version"
        )

        # 2. Create new Attachment
        content_type = ContentType.objects.get_for_model(Document)
        new_attachment = Attachment.objects.create(
            name=file_obj.name,
            res_model=content_type,
            res_id=str(document.id),
            mimetype=file_obj.content_type,
            file_size=file_obj.size,
            file=file_obj
        )

        # 3. Update document
        document.attachment = new_attachment
        document.version = new_version_number
        document.save()

        # Extract text from new version
        document.extract_text()

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

class DocumentVersionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DocumentVersion.objects.all()
    serializer_class = DocumentVersionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        doc_id = self.request.query_params.get('document')
        if doc_id:
            qs = qs.filter(document_id=doc_id)
        return qs
