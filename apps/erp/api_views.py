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

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = InternalProject.objects.all().order_by('-created_at')
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-due_date')
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['project', 'status', 'assigned_to']
    search_fields = ['title', 'description']

class KPIViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = OperationKPI.objects.all()
    serializer_class = OperationKPISerializer
    permission_classes = [permissions.IsAuthenticated]

class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    permission_classes = [permissions.IsAuthenticated]

# New ViewSets
class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]

class MilestoneViewSet(viewsets.ModelViewSet):
    queryset = Milestone.objects.all()
    serializer_class = MilestoneSerializer
    permission_classes = [permissions.IsAuthenticated]

class EmployeeProfileViewSet(viewsets.ModelViewSet):
    queryset = EmployeeProfile.objects.all()
    serializer_class = EmployeeProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

class TimeLogViewSet(viewsets.ModelViewSet):
    queryset = TimeLog.objects.all().order_by('-date')
    serializer_class = TimeLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [permissions.IsAuthenticated]

class VendorContractViewSet(viewsets.ModelViewSet):
    queryset = VendorContract.objects.all()
    serializer_class = VendorContractSerializer
    permission_classes = [permissions.IsAuthenticated]

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all().order_by('-issue_date')
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all().order_by('-date')
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(submitted_by=self.request.user)

class VendorBillViewSet(viewsets.ModelViewSet):
    queryset = VendorBill.objects.all().order_by('-due_date')
    serializer_class = VendorBillSerializer
    permission_classes = [permissions.IsAuthenticated]

class RiskViewSet(viewsets.ModelViewSet):
    queryset = RiskRegister.objects.all().order_by('-created_at')
    serializer_class = RiskRegisterSerializer
    permission_classes = [permissions.IsAuthenticated]

class ComplianceItemViewSet(viewsets.ModelViewSet):
    queryset = ComplianceItem.objects.all()
    serializer_class = ComplianceItemSerializer
    permission_classes = [permissions.IsAuthenticated]

class PolicyViewSet(viewsets.ModelViewSet):
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer
    permission_classes = [permissions.IsAuthenticated]

class IntegrationViewSet(viewsets.ModelViewSet):
    queryset = Integration.objects.all()
    serializer_class = IntegrationSerializer
    permission_classes = [permissions.IsAuthenticated]

class ERPDashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        
        # --- Operations KPIs ---
        active_projects = InternalProject.objects.filter(status='active')
        active_projects_count = active_projects.count()
        pending_projects_count = InternalProject.objects.filter(status='planning').count()
        
        # Budget Usage
        total_budget = active_projects.aggregate(Sum('budget_cost'))['budget_cost__sum'] or 0
        total_actual_cost = TimeLog.objects.filter(task__project__in=active_projects).aggregate(Sum('cost_amount'))['cost_amount__sum'] or 0
        budget_usage = (total_actual_cost / total_budget * 100) if total_budget > 0 else 0

        # Task Stats
        my_tasks = Task.objects.filter(assigned_to=request.user, status__in=['todo', 'in_progress'])
        my_tasks_count = my_tasks.count()
        overdue_tasks_count = Task.objects.filter(status__in=['todo', 'in_progress'], due_date__lt=today).count()
        
        # Risks
        high_risks_count = RiskRegister.objects.filter(impact__in=['high', 'severe']).count()
        
        # Invoices
        new_invoices_count = VendorBill.objects.filter(status__in=['scheduled', 'pending']).count()

        # --- Financials ---
        project_revenue = InternalProject.objects.aggregate(Sum('revenue'))['revenue__sum'] or 0
        order_revenue = Order.objects.aggregate(Sum('amount'))['amount__sum'] or 0
        total_revenue = project_revenue + order_revenue
        
        subscriptions = Subscription.objects.all().select_related('plan')
        # Simple MRR calculation
        total_mrr = sum([s.plan.price_monthly for s in subscriptions if s.is_valid and s.plan])

        expenses = Expense.objects.filter(status='approved').aggregate(Sum('amount'))['amount__sum'] or 0
        vendor_bills = VendorBill.objects.filter(status__in=['scheduled', 'paid']).aggregate(Sum('amount'))['amount__sum'] or 0
        labor_cost = TimeLog.objects.aggregate(Sum('cost_amount'))['cost_amount__sum'] or 0
        total_costs = expenses + vendor_bills + labor_cost
        
        net_profit = total_revenue - total_costs
        profit_margin = (net_profit / total_revenue * 100) if total_revenue > 0 else 0

        # --- System Status ---
        system_status = "Operational" 

        data = {
            "kpi": {
                "active_projects": active_projects_count,
                "planning_projects": pending_projects_count,
                "my_tasks": my_tasks_count,
                "overdue_tasks": overdue_tasks_count,
                "high_risks": high_risks_count,
                "new_invoices": new_invoices_count,
                "budget_usage": round(budget_usage, 1),
                "resource_utilization": 85, # Mock
                "sla_health": 99.9
            },
            "financials": {
                "total_revenue": total_revenue,
                "project_revenue": project_revenue,
                "mrr": total_mrr,
                "total_costs": total_costs,
                "net_profit": net_profit,
                "profit_margin": round(profit_margin, 1)
            },
            "system": {
                "status": system_status,
                "database": "Operational",
                "core": "Operational"
            }
        }
        return Response(data)
