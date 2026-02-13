from rest_framework import viewsets, permissions
from .models import (
    InternalProject, Task, OperationKPI, Asset, Service, Milestone,
    EmployeeProfile, TimeLog, Vendor, VendorContract,
    Invoice, InvoiceItem, Expense, VendorBill,
    RiskRegister, ComplianceItem, Policy, Integration
)
from .serializers import (
    ProjectSerializer, TaskSerializer, OperationKPISerializer, AssetSerializer,
    ServiceSerializer, MilestoneSerializer, EmployeeProfileSerializer, TimeLogSerializer,
    VendorSerializer, VendorContractSerializer, InvoiceSerializer, InvoiceItemSerializer,
    ExpenseSerializer, VendorBillSerializer, RiskRegisterSerializer, ComplianceItemSerializer,
    PolicySerializer, IntegrationSerializer
)
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count, Avg, Q
from django.utils import timezone
from apps.store.models import Subscription, Order
from django.contrib.admin.models import LogEntry

from apps.core.permissions import ConstitutionPermission
from apps.core.services.audit import AuditService

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = InternalProject.objects.all().order_by('-created_at')
    serializer_class = ProjectSerializer
    permission_classes = [ConstitutionPermission]

    def perform_create(self, serializer):
        project = serializer.save()
        AuditService.log(
            self.request,
            action="ERP_PROJECT_CREATED",
            resource=f"erp.InternalProject:{project.pk}",
            payload=serializer.data
        )

    def perform_update(self, serializer):
        project = serializer.save()
        AuditService.log(
            self.request,
            action="ERP_PROJECT_UPDATED",
            resource=f"erp.InternalProject:{project.pk}",
            payload=serializer.data
        )

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-due_date')
    serializer_class = TaskSerializer
    permission_classes = [ConstitutionPermission]
    filterset_fields = ['project', 'status', 'assigned_to']
    search_fields = ['title', 'description']

    def perform_create(self, serializer):
        task = serializer.save()
        AuditService.log(
            self.request,
            action="ERP_TASK_CREATED",
            resource=f"erp.Task:{task.pk}",
            payload=serializer.data
        )

class KPIViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = OperationKPI.objects.all()
    serializer_class = OperationKPISerializer
    permission_classes = [ConstitutionPermission]

class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    permission_classes = [ConstitutionPermission]

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [ConstitutionPermission]

class MilestoneViewSet(viewsets.ModelViewSet):
    queryset = Milestone.objects.all()
    serializer_class = MilestoneSerializer
    permission_classes = [ConstitutionPermission]

class EmployeeProfileViewSet(viewsets.ModelViewSet):
    queryset = EmployeeProfile.objects.all()
    serializer_class = EmployeeProfileSerializer
    permission_classes = [ConstitutionPermission]

class TimeLogViewSet(viewsets.ModelViewSet):
    queryset = TimeLog.objects.all().order_by('-date')
    serializer_class = TimeLogSerializer
    permission_classes = [ConstitutionPermission]
    
    def perform_create(self, serializer):
        timelog = serializer.save(user=self.request.user)
        AuditService.log(
            self.request,
            action="ERP_TIMELOG_CREATED",
            resource=f"erp.TimeLog:{timelog.pk}",
            payload=serializer.data
        )

class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [ConstitutionPermission]

class VendorContractViewSet(viewsets.ModelViewSet):
    queryset = VendorContract.objects.all()
    serializer_class = VendorContractSerializer
    permission_classes = [ConstitutionPermission]

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all().order_by('-issue_date')
    serializer_class = InvoiceSerializer
    permission_classes = [ConstitutionPermission]

    def perform_create(self, serializer):
        invoice = serializer.save()
        AuditService.log(
            self.request,
            action="ERP_INVOICE_CREATED",
            resource=f"erp.Invoice:{invoice.pk}",
            payload=serializer.data
        )

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all().order_by('-date')
    serializer_class = ExpenseSerializer
    permission_classes = [ConstitutionPermission]
    
    def perform_create(self, serializer):
        expense = serializer.save(submitted_by=self.request.user)
        AuditService.log(
            self.request,
            action="ERP_EXPENSE_CREATED",
            resource=f"erp.Expense:{expense.pk}",
            payload=serializer.data
        )

class VendorBillViewSet(viewsets.ModelViewSet):
    queryset = VendorBill.objects.all().order_by('-due_date')
    serializer_class = VendorBillSerializer
    permission_classes = [ConstitutionPermission]

class RiskViewSet(viewsets.ModelViewSet):
    queryset = RiskRegister.objects.all().order_by('-created_at')
    serializer_class = RiskRegisterSerializer
    permission_classes = [ConstitutionPermission]

class ComplianceItemViewSet(viewsets.ModelViewSet):
    queryset = ComplianceItem.objects.all()
    serializer_class = ComplianceItemSerializer
    permission_classes = [ConstitutionPermission]

class PolicyViewSet(viewsets.ModelViewSet):
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer
    permission_classes = [ConstitutionPermission]

class IntegrationViewSet(viewsets.ModelViewSet):
    queryset = Integration.objects.all()
    serializer_class = IntegrationSerializer
    permission_classes = [ConstitutionPermission]

from .services import EnterpriseService

class ERPDashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        stats = EnterpriseService.get_dashboard_stats(request.user)
        return Response(stats)
