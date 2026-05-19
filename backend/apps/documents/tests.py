from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.tenants.models import Tenant
from .models import Document, DocumentVersion
from .services import DocumentService

User = get_user_model()

class DocumentVersioningTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tenant = Tenant.objects.create(name="Test Tenant", domain="test.bitguard.local")
        self.user = User.objects.create_user(username="testuser", password="password", email="test@test.com", is_staff=True)
        self.client.force_authenticate(user=self.user)
        
        # Initial file
        self.initial_file = SimpleUploadedFile("initial.txt", b"Initial content")
        self.doc = Document.objects.create(
            tenant=self.tenant,
            title="SOP Document",
            file=self.initial_file,
            uploaded_by=self.user,
            category="policy",
            version="1.0"
        )

    def test_service_bump_version(self):
        """Test the DocumentService.create_new_version logic."""
        new_file = SimpleUploadedFile("updated.txt", b"Updated content")
        updated_doc = DocumentService.create_new_version(
            self.doc, "2.0", new_file, self.user, "Added safety guidelines"
        )
        
        # Verify document state
        self.assertEqual(updated_doc.version, "2.0")
        self.assertEqual(updated_doc.history.count(), 2) # v1.0 and v2.0
        
        # Verify history
        v1 = updated_doc.history.filter(version_number="1.0").first()
        self.assertIsNotNone(v1)
        self.assertEqual(v1.notes, "Archived by automated version bump.")
        
        v2 = updated_doc.history.filter(version_number="2.0").first()
        self.assertIsNotNone(v2)
        self.assertEqual(v2.notes, "Added safety guidelines")

    def test_api_bump_version(self):
        """Test the /api/documents/vault/{id}/bump_version/ endpoint."""
        new_file = SimpleUploadedFile("v3.txt", b"v3 content")
        response = self.client.post(
            f'/api/documents/vault/{self.doc.id}/bump_version/',
            {'version': '3.0', 'file': new_file, 'notes': 'Critical update'},
            format='multipart'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.doc.refresh_from_db()
        self.assertEqual(self.doc.version, "3.0")
        self.assertEqual(self.doc.history.count(), 2) # v1.0 (original) and v3.0 (new)
        # Note: The service currently archives the *current* state before updating.
        # If we call it once, we get v1 and v3 in history.
