from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Document, DocumentVersion
from .serializers import DocumentSerializer, DocumentVersionSerializer
from .services import DocumentService

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all().order_by('-created_at')
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

    @action(detail=True, methods=['post'])
    def bump_version(self, request, pk=None):
        document = self.get_object()
        new_version = request.data.get('version')
        new_file = request.FILES.get('file')
        notes = request.data.get('notes', '')

        if not new_version or not new_file:
            return Response({"error": "Both 'version' and 'file' payload components are required."}, status=status.HTTP_400_BAD_REQUEST)

        updated_doc = DocumentService.create_new_version(document, new_version, new_file, request.user, notes)
        return Response(self.get_serializer(updated_doc).data)

class DocumentVersionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DocumentVersion.objects.all().order_by('-created_at')
    serializer_class = DocumentVersionSerializer
    permission_classes = [permissions.IsAuthenticated]
