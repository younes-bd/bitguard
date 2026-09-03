from rest_framework import serializers
from apps.documents.domain.models import DocumentWorkspace, Tag, Document, DocumentVersion
from apps.core.api.serializers import AttachmentSerializer

class DocumentWorkspaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentWorkspace
        fields = ['id', 'name', 'description', 'parent', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'color', 'workspace']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class DocumentVersionSerializer(serializers.ModelSerializer):
    attachment = AttachmentSerializer(read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)

    class Meta:
        model = DocumentVersion
        fields = ['id', 'document', 'attachment', 'version_number', 'created_by', 'created_by_name', 'notes', 'created_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class DocumentSerializer(serializers.ModelSerializer):
    attachment = AttachmentSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    workspace_name = serializers.CharField(source='workspace.name', read_only=True)
    owner_name = serializers.CharField(source='owner.get_full_name', read_only=True)
    
    # We allow writing to these by ID
    workspace_id = serializers.PrimaryKeyRelatedField(
        queryset=DocumentWorkspace.objects.all(), source='workspace', required=False, allow_null=True
    )
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), source='tags', write_only=True, many=True, required=False
    )

    versions = DocumentVersionSerializer(source='history', many=True, read_only=True)

    class Meta:
        model = Document
        fields = [
            'id', 'attachment', 'workspace', 'workspace_id', 'workspace_name', 
            'tags', 'tag_ids', 'owner', 'owner_name', 'version', 
            'is_archived', 'is_locked', 'ocr_text', 'created_at', 'updated_at',
            'versions', 'source_module', 'source_id', 'expiry_date'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

from apps.documents.domain.models import SpreadsheetDocument

class SpreadsheetDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpreadsheetDocument
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
