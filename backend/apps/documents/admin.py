from django.contrib import admin
from .domain.models import DocumentWorkspace, Tag, Document, DocumentVersion

@admin.register(DocumentWorkspace)
class DocumentWorkspaceAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent', 'tenant', 'created_at')
    list_filter = ('tenant',)
    search_fields = ('name',)

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'color', 'workspace', 'tenant')
    list_filter = ('tenant', 'workspace')
    search_fields = ('name',)

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_attachment_name', 'workspace', 'owner', 'version', 'is_archived', 'tenant')
    list_filter = ('tenant', 'workspace', 'is_archived', 'is_locked')
    search_fields = ('attachment__name', 'ocr_text')
    
    def get_attachment_name(self, obj):
        return obj.attachment.name if obj.attachment else ''
    get_attachment_name.short_description = 'Attachment'

@admin.register(DocumentVersion)
class DocumentVersionAdmin(admin.ModelAdmin):
    list_display = ('document', 'version_number', 'created_by', 'created_at')
    list_filter = ('document__tenant',)
