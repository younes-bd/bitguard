from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.contenttypes.models import ContentType
from apps.core.domain.models import Attachment
from apps.documents.domain.models import Document, DocumentWorkspace, Tag
from apps.users.domain.models import User
from apps.tenants.domain.models import Tenant
import uuid

class EDMSTestCase(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(name="Test Tenant", domain="test")
        self.user = User.objects.create_user(username="testuser", email="test@test.com", password="password")
        self.workspace = DocumentWorkspace.objects.create(name="HR", tenant=self.tenant)
        self.tag = Tag.objects.create(name="Confidential", workspace=self.workspace, tenant=self.tenant)

    def test_document_creation(self):
        # Create an attachment to satisfy NOT NULL constraint
        attachment = Attachment.objects.create(name="Test File.pdf", tenant=self.tenant)
        doc = Document.objects.create(
            workspace=self.workspace,
            tenant=self.tenant,
            attachment=attachment
        )
        doc.tags.add(self.tag)
        
        pdf_content = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
        uploaded_file = SimpleUploadedFile("test.pdf", pdf_content, content_type="application/pdf")
        
        content_type = ContentType.objects.get_for_model(Document)
        attachment = Attachment.objects.create(
            name="test.pdf",
            res_model=content_type,
            res_id=str(doc.id),
            file=uploaded_file,
            tenant=self.tenant
        )
        doc.attachment = attachment
        doc.save()
        
        self.assertEqual(doc.attachment.name, "test.pdf")
        self.assertFalse(doc.is_public)

    def test_document_sharing(self):
        # Create an attachment to satisfy NOT NULL constraint
        attachment = Attachment.objects.create(name="Test File.pdf", tenant=self.tenant)
        doc = Document.objects.create(workspace=self.workspace, tenant=self.tenant, attachment=attachment)
        self.assertFalse(doc.is_public)
        self.assertIsNotNone(doc.share_token)
        
        doc.is_public = True
        doc.save()
        
        self.assertTrue(doc.is_public)
