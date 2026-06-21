from django.contrib import admin
from .domain.models import ReportTemplate, GeneratedReport, ReportEngineSettings

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

@admin.register(ReportEngineSettings)
class ReportEngineSettingsAdmin(admin.ModelAdmin):
    list_display = ('tenant', 'paper_format', 'created_at')
    list_filter = ('tenant', 'paper_format')
