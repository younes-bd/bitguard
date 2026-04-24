from django.contrib import admin
from .models import Document, DocumentVersion

class DocumentVersionInline(admin.TabularInline):
    model = DocumentVersion
    extra = 0

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'version', 'uploaded_by', 'is_archived', 'created_at')
    list_filter = ('category', 'is_archived', 'created_at')
    search_fields = ('title', 'uploaded_by__email')
    inlines = [DocumentVersionInline]
    readonly_fields = ('created_at', 'updated_at')

@admin.register(DocumentVersion)
class DocumentVersionAdmin(admin.ModelAdmin):
    list_display = ('document', 'version_number', 'uploaded_by', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('document__title', 'uploaded_by__email')
