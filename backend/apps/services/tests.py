from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.tenants.models import Tenant
from apps.contracts.models import SLATier
from apps.support.models import Ticket
from apps.approvals.models import ApprovalRequest, ApprovalStep
from .models import ServiceItem, ServiceRequest, ServiceCategory
from .services import ITSMService

User = get_user_model()

class MockRequest:
    def __init__(self, tenant, user):
        self.tenant = tenant
        self.user = user
        self.META = {}

class ITSMWorkflowTest(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(name="ITSM Tenant", domain="itsm.bitguard.local")
        self.tenant2 = Tenant.objects.create(name="Other Tenant", domain="other.bitguard.local")
        
        self.user = User.objects.create_user(username="requester", password="password", email="req@test.com", is_staff=True)
        self.owner = User.objects.create_user(username="owner", password="password", email="owner@test.com")
        
        self.sla = SLATier.objects.create(
            name="Premium IT SLA",
            first_response_hours=2,
            resolution_hours=4,
            uptime_percent=99.9,
            coverage="always_on"
        )
        
        self.category_cloud = ServiceCategory.objects.create(tenant=self.tenant, name='Cloud', slug='cloud')
        self.category_id = ServiceCategory.objects.create(tenant=self.tenant, name='Identity', slug='identity')
        self.service_item_auto = ServiceItem.objects.create(
            tenant=self.tenant,
            name="VM Provisioning",
            description="Provision a cloud virtual machine",
            icon="Cloud",
            category=self.category_cloud,
            is_active=True,
            sla_tier=self.sla,
            approval_required=False,
            service_owner=self.owner
        )
        
        self.service_item_approval = ServiceItem.objects.create(
            tenant=self.tenant,
            name="Database Access",
            description="Request DB client access",
            icon="Database",
            category=self.category_id,
            is_active=True,
            sla_tier=self.sla,
            approval_required=True,
            service_owner=self.owner
        )

    def test_create_service_request_no_approval(self):
        """Service requests without approval_required automatically spawn tickets."""
        request = MockRequest(self.tenant, self.user)
        form_data = {"cpu": 4, "ram": "16GB"}
        
        req = ITSMService.create_service_request(
            service_item=self.service_item_auto,
            requester=self.user,
            form_data=form_data,
            request=request
        )
        
        self.assertEqual(req.status, 'in_progress')
        self.assertIsNotNone(req.ticket)
        self.assertEqual(req.ticket.title, f"[REQ-{req.pk}] VM Provisioning")
        self.assertEqual(req.ticket.assigned_to, self.owner)
        self.assertEqual(req.ticket.customer, self.user)

    def test_create_service_request_with_approval(self):
        """Service requests with approval_required start in pending_approval and spawn ApprovalRequests."""
        request = MockRequest(self.tenant, self.user)
        form_data = {"database": "prod_db"}
        
        req = ITSMService.create_service_request(
            service_item=self.service_item_approval,
            requester=self.user,
            form_data=form_data,
            request=request
        )
        
        self.assertEqual(req.status, 'pending_approval')
        self.assertIsNone(req.ticket)
        
        # Check that approval requests were created
        approval_req = ApprovalRequest.objects.filter(tenant=self.tenant).first()
        self.assertIsNotNone(approval_req)
        self.assertEqual(approval_req.payload["service_request_id"], str(req.pk))
        
        step = ApprovalStep.objects.filter(approval_request=approval_req).first()
        self.assertIsNotNone(step)
        self.assertEqual(step.approver, self.owner)
        self.assertEqual(step.status, 'pending')

    def test_approve_service_request(self):
        """Approving a service request updates its status and creates the provisioning ticket."""
        request = MockRequest(self.tenant, self.user)
        req = ServiceRequest.objects.create(
            tenant=self.tenant,
            service_item=self.service_item_approval,
            requester=self.user,
            form_data={"db": "finance"},
            status='pending_approval'
        )
        
        updated_req = ITSMService.approve_service_request(req, self.owner, request)
        self.assertEqual(updated_req.status, 'in_progress')
        self.assertIsNotNone(updated_req.ticket)
        self.assertEqual(updated_req.ticket.assigned_to, self.owner)

    def test_reject_service_request(self):
        """Rejecting a service request closes it immediately."""
        request = MockRequest(self.tenant, self.user)
        req = ServiceRequest.objects.create(
            tenant=self.tenant,
            service_item=self.service_item_approval,
            requester=self.user,
            form_data={"db": "finance"},
            status='pending_approval'
        )
        
        updated_req = ITSMService.reject_service_request(req, self.owner, request)
        self.assertEqual(updated_req.status, 'rejected')
        self.assertIsNone(updated_req.ticket)
        self.assertIsNotNone(updated_req.closed_at)

    def test_tenant_isolation_viewsets(self):
        """Ensure users cannot see service items/requests of another tenant."""
        api_client = APIClient()
        api_client.force_authenticate(user=self.user)

        from unittest.mock import patch

        def extract_results(data):
            """Handle both paginated dict and plain list DRF responses."""
            if isinstance(data, list):
                return data
            return data.get('results', list(data))

        with patch('apps.services.services.ITSMService.get_tenant_context') as mock_tenant:
            mock_tenant.return_value = self.tenant
            response = api_client.get('/api/itsm/service-items/')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            results = extract_results(response.data)
            self.assertEqual(len(results), 2)

            # Switch tenant context — should see zero items
            mock_tenant.return_value = self.tenant2
            response = api_client.get('/api/itsm/service-items/')
            results = extract_results(response.data)
            self.assertEqual(len(results), 0)

