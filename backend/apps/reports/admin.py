from django.contrib import admin
from .domain.models import ReportTemplate, GeneratedReport, PaperFormat

@admin.register(ReportTemplate)
class ReportTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'model', 'is_active', 'is_default', 'tenant', 'created_at')
    list_filter = ('tenant', 'is_active', 'is_default', 'model')
    search_fields = ('name', 'model')

@admin.register(GeneratedReport)
class GeneratedReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'template', 'record_model', 'status', 'created_by', 'tenant', 'created_at')
    list_filter = ('tenant', 'status', 'record_model')
    search_fields = ('record_id', 'template__name')

@admin.register(PaperFormat)
class PaperFormatAdmin(admin.ModelAdmin):
    list_display = ('name', 'tenant', 'is_global', 'page_width', 'page_height', 'created_at')
    list_filter = ('tenant', 'is_global')
    search_fields = ('name',)
