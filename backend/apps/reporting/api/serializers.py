from rest_framework import serializers
from apps.reporting.domain.models import ReportTemplate, GeneratedReport, ReportEngineSettings, ReportTag

class ReportTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportTemplate
        fields = ['id', 'name', 'model', 'html_content', 'css_content', 'is_active', 'is_default', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class GeneratedReportSerializer(serializers.ModelSerializer):
    template_name = serializers.CharField(source='template.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)

    class Meta:
        model = GeneratedReport
        fields = ['id', 'template', 'template_name', 'record_model', 'record_id', 'file', 'status', 'created_by', 'created_by_name', 'created_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class ReportEngineSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportEngineSettings
        fields = ['id', 'paper_format', 'margin_top', 'margin_bottom', 'margin_left', 'margin_right', 'company_header_html', 'company_footer_html']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class ReportTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportTag
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
