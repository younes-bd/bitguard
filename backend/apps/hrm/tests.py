from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.tenants.models import Tenant
from .models import Employee, Department, LeaveRequest
from datetime import date, timedelta

User = get_user_model()

class HRMLeaveTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tenant = Tenant.objects.create(name="HRM Tenant", domain="hrm.bitguard.local")
        self.admin = User.objects.create_user(username="admin", password="password", email="admin@test.com", is_staff=True)
        self.user = User.objects.create_user(username="employee", password="password", email="emp@test.com")
        self.client.force_authenticate(user=self.admin)
        
        self.dept = Department.objects.create(tenant=self.tenant, name="Engineering")
        self.employee = Employee.objects.create(
            tenant=self.tenant,
            user=self.user,
            department=self.dept,
            employee_id="EMP001",
            job_title="Software Engineer",
            hire_date=date.today()
        )

    def test_leave_approval_workflow(self):
        """Test creating, approving, and rejecting leave requests."""
        # 1. Create a request
        leave = LeaveRequest.objects.create(
            tenant=self.tenant,
            employee=self.employee,
            leave_type="annual",
            start_date=date.today() + timedelta(days=5),
            end_date=date.today() + timedelta(days=10),
            reason="Vacation"
        )
        self.assertEqual(leave.status, "pending")
        
        # 2. Approve via API
        response = self.client.post(f'/api/hrm/leave-requests/{leave.id}/approve/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        leave.refresh_from_db()
        self.assertEqual(leave.status, "approved")
        self.assertEqual(leave.approved_by, self.admin)
        
        # 3. Create another one to test rejection
        leave2 = LeaveRequest.objects.create(
            tenant=self.tenant,
            employee=self.employee,
            leave_type="sick",
            start_date=date.today() + timedelta(days=1),
            end_date=date.today() + timedelta(days=2),
            reason="Flu"
        )
        
        response = self.client.post(f'/api/hrm/leave-requests/{leave2.id}/reject/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        leave2.refresh_from_db()
        self.assertEqual(leave2.status, "rejected")
        self.assertEqual(leave2.approved_by, self.admin)
