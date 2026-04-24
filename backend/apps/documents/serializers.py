from rest_framework import serializers
from .models import Document, DocumentVersion

class DocumentVersionSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)
    
    class Meta:
        model = DocumentVersion
        fields = [
            'id', 'document', 'version_number', 'file', 
            'uploaded_by', 'uploaded_by_name', 'notes', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ('created_at', 'updated_at')

class DocumentSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)
    history = DocumentVersionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Document
        fields = [
            'id', 'title', 'file', 'category', 'version', 
            'is_archived', 'uploaded_by', 'uploaded_by_name', 
            'history', 'created_at', 'updated_at'
        ]
        read_only_fields = ('created_at', 'updated_at')
