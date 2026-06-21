import os
import uuid
from io import BytesIO
from django.conf import settings
from django.template import Context, Template
from django.core.files.base import ContentFile
from apps.core.domain.models import Attachment
from django.contrib.contenttypes.models import ContentType
import logging

logger = logging.getLogger(__name__)

class ReportingService:
    """
    Service responsible for converting HTML templates to PDFs (WeasyPrint)
    and attaching them to models (like Odoo's ir.actions.report).
    """

    @classmethod
    def generate_pdf(cls, report_template, record, context_data=None):
        """
        Generates a PDF from a ReportTemplate and attaches it to the record.
        """
        try:
            from weasyprint import HTML, CSS
        except ImportError:
            logger.error("WeasyPrint is not installed. PDF generation failed.")
            return None

        # Build context
        if context_data is None:
            context_data = {}
        context_data['record'] = record
        
        # Render HTML
        django_template = Template(report_template.html_content)
        django_context = Context(context_data)
        rendered_html = django_template.render(django_context)

        # Build PDF
        html_doc = HTML(string=rendered_html)
        css_docs = [CSS(string=report_template.css_content)] if report_template.css_content else []
        
        pdf_bytes = html_doc.write_pdf(stylesheets=css_docs)

        # Create Attachment
        content_type = ContentType.objects.get_for_model(record)
        filename = f"{report_template.name.replace(' ', '_')}_{record.id}_{uuid.uuid4().hex[:6]}.pdf"

        attachment = Attachment.objects.create(
            name=f"{report_template.name} for {record}",
            res_model=content_type,
            res_id=str(record.id),
            mimetype="application/pdf",
            file_size=len(pdf_bytes)
        )
        attachment.file.save(filename, ContentFile(pdf_bytes))
        
        # --- EDMS INTEGRATION ---
        try:
            from apps.edms.domain.models import Document, DocumentWorkspace
            record_model_str = f"{record._meta.app_label}.{record._meta.model_name}"
            
            MODULE_WORKSPACE_MAP = {
                'purchase': 'Purchase',
                'inventory': 'Inventory',
                'accounting': 'Finance',
                'hrm': 'HR',
                'crm': 'Sales',
                'contracts': 'Contracts',
                'itsm': 'IT & Security',
                'soc': 'IT & Security',
                'itam': 'IT & Security',
                'projects': 'Sales',
                'erp': 'General'
            }
            app_label = record._meta.app_label
            workspace_name = MODULE_WORKSPACE_MAP.get(app_label, 'General')
            slug_name = workspace_name.lower().replace(' ', '-').replace('&', 'and')

            workspace, _ = DocumentWorkspace.objects.get_or_create(
                tenant=record.tenant,
                name=workspace_name,
            )
            Document.objects.create(
                tenant=record.tenant,
                attachment=attachment,
                workspace=workspace,
                source_module=record_model_str,
                source_id=str(record.id),
                version='1.0',
            )
        except Exception as e:
            logger.error(f"Failed to auto-save to EDMS: {str(e)}")
        
        return attachment
