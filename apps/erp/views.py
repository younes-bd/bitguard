from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import TemplateView, ListView, DetailView, CreateView, UpdateView, View
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.urls import reverse_lazy
from django.db.models import Count, Q, Sum, Avg
from django.utils import timezone
from django.contrib.admin.models import LogEntry
from django.contrib.auth import get_user_model

from .models import (
    OperationKPI, InternalProject, Task, Asset, Vendor, 
    RiskRegister, ComplianceItem, EmployeeProfile, Policy,
    TimeLog,    Expense, VendorBill, Invoice, InvoiceItem, Policy, Integration, Service, VendorContract
)
from apps.store.models import Subscription, Order
from .forms import (
    TaskForm, AssetForm, ExpenseForm, VendorBillForm, VendorContractForm, VendorForm, RiskForm, 
    ComplianceItemForm, PolicyForm, EmployeeForm, IntegrationForm, InvoiceForm, InvoiceItemFormSet,
    ServiceForm, TimeLogForm
)

from django.db import transaction
# System Check Imports
import shutil
import time
from django.db import connection
from django.core.cache import cache

# ==============================================================================
# MIXINS & UTILS
# ==============================================================================

from .permissions import (
    ERPAccessMixin, OperationsRequiredMixin, EngineeringRequiredMixin, 
    SalesRequiredMixin, StoreManagerRequiredMixin, ExecutiveRequiredMixin
)

# ==============================================================================
# DASHBOARD
# ==============================================================================

class ERPDashboardView(ERPAccessMixin, TemplateView):
    template_name = 'erp/overview.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Operations KPIs
        context['kpis'] = OperationKPI.objects.all()
        sla_kpi = OperationKPI.objects.filter(category='sla').first()
        context['sla_health'] = sla_kpi.value if sla_kpi else "99.9%"
        # Extract numeric value for progress bar width
        try:
            context['sla_health_val'] = float(context['sla_health'].strip('%'))
        except (ValueError, AttributeError):
            context['sla_health_val'] = 99.9
        
        # Project Summary
        active_projects = InternalProject.objects.filter(status='active')
        context['active_projects_count'] = active_projects.count()
        context['pending_projects_count'] = InternalProject.objects.filter(status='planning').count()
        
        # Project Budget Usage (Active Projects)
        total_budget = active_projects.aggregate(Sum('budget_cost'))['budget_cost__sum'] or 0
        total_actual_cost = TimeLog.objects.filter(
            task__project__in=active_projects
        ).aggregate(Sum('cost_amount'))['cost_amount__sum'] or 0
        
        if total_budget > 0:
            context['budget_usage'] = (total_actual_cost / total_budget) * 100
        else:
            context['budget_usage'] = 0

        # Task Summary
        my_tasks_qs = Task.objects.filter(assigned_to=self.request.user, status__in=['todo', 'in_progress'])
        context['my_active_tasks'] = my_tasks_qs
        context['my_tasks_count'] = my_tasks_qs.count()
        context['overdue_tasks_count'] = Task.objects.filter(status__in=['todo', 'in_progress'], due_date__lt=timezone.now().date()).count()
        
        # Resource Utilization
        avg_load = EmployeeProfile.objects.aggregate(Avg('current_load'))['current_load__avg'] or 0
        context['resource_utilization'] = round(avg_load)

        # Recent Risks
        context['high_risks_count'] = RiskRegister.objects.filter(impact__in=['high', 'severe']).count()
        
        # New Invoices (Vendor Bills)
        context['new_invoices_count'] = VendorBill.objects.filter(status__in=['scheduled', 'pending']).count()
        
        # --- FINANCIALS ---
        # 1. REVENUE
        project_revenue = InternalProject.objects.aggregate(Sum('revenue'))['revenue__sum'] or 0
        order_revenue = Order.objects.aggregate(Sum('amount'))['amount__sum'] or 0
        
        subscriptions = Subscription.objects.all().select_related('plan')
        total_mrr = sum([s.plan.price_monthly for s in subscriptions if s.is_valid and s.plan])
        
        total_revenue = project_revenue + order_revenue
        
        # 2. EXPENSES & COSTS
        expenses = Expense.objects.filter(status='approved').aggregate(Sum('amount'))['amount__sum'] or 0
        vendor_bills = VendorBill.objects.filter(status__in=['scheduled', 'paid']).aggregate(Sum('amount'))['amount__sum'] or 0
        labor_cost = TimeLog.objects.aggregate(Sum('cost_amount'))['cost_amount__sum'] or 0
        
        total_costs = expenses + vendor_bills + labor_cost
        
        # 3. PROFIT
        net_profit = total_revenue - total_costs
        margin = (net_profit / total_revenue * 100) if total_revenue > 0 else 0
        
        context.update({
            'total_mrr': total_mrr,
            'active_subs': subscriptions.filter(status='active').count(),
            'total_revenue': total_revenue,
            'project_revenue': project_revenue,
            'order_revenue': order_revenue,
            'total_costs': total_costs,
            'total_expenses': expenses,
            'total_bills': vendor_bills,
            'total_labor_cost': labor_cost,
            'net_profit': net_profit,
            'profit_margin': margin,
        })
        
        # --- SYSTEM ---
        from django.db import connection
        try:
            connection.ensure_connection()
            context['system_status_db'] = 'Operational'
        except Exception:
            context['system_status_db'] = 'Downtime'
        context['system_status_core'] = 'Operational'
        
        # Audit Logs (Recent 5)
        context['recent_logs'] = LogEntry.objects.select_related('user', 'content_type').order_by('-action_time')[:5]
        
        return context

# ==============================================================================
# PROJECTS
# ==============================================================================

class ProjectListView(ERPAccessMixin, ListView):
    model = InternalProject
    template_name = 'erp/projects/project_list.html'
    context_object_name = 'projects'
    paginate_by = 10

    def get_queryset(self):
        queryset = super().get_queryset()
        status = self.request.GET.get('status')
        if status:
            queryset = queryset.filter(status=status)
        return queryset

class ProjectDetailView(ERPAccessMixin, DetailView):
    model = InternalProject
    template_name = 'erp/projects/project_detail.html'
    context_object_name = 'project'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['tasks'] = self.object.tasks.all()
        context['milestones'] = self.object.milestones.all()
        context['today'] = timezone.now().date()
        return context

class ProjectCreateView(OperationsRequiredMixin, CreateView):
    model = InternalProject
    template_name = 'erp/projects/project_form.html'
    fields = ['client', 'contract', 'crm_project', 'name', 'description', 'service_type', 'manager', 'team', 'status', 'start_date', 'deadline', 'revenue', 'budget_cost']
    success_url = reverse_lazy('erp_project_list')

class ProjectUpdateView(OperationsRequiredMixin, UpdateView):
    model = InternalProject
    template_name = 'erp/projects/project_form.html'
    fields = ['client', 'contract', 'crm_project', 'name', 'description', 'service_type', 'manager', 'team', 'status', 'start_date', 'deadline', 'revenue', 'budget_cost']
    
    def get_success_url(self):
        return reverse_lazy('erp_project_detail', kwargs={'pk': self.object.pk})

# ==============================================================================
# TASKS
# ==============================================================================

class TaskListView(EngineeringRequiredMixin, ListView):
    model = Task
    template_name = 'erp/tasks/task_list.html'
    context_object_name = 'tasks'
    paginate_by = 20

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['pending_count'] = Task.objects.filter(status__in=['todo', 'in_progress']).count()
        context['critical_count'] = Task.objects.filter(priority='critical').count()
        context['today'] = timezone.now().date()
        return context

class TaskDetailView(EngineeringRequiredMixin, DetailView):
    model = Task
    template_name = 'erp/tasks/task_detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['today'] = timezone.now().date()
        return context

class TaskCreateView(OperationsRequiredMixin, CreateView):
    model = Task
    template_name = 'erp/tasks/task_form.html'
    fields = ['project', 'title', 'description', 'assigned_to', 'priority', 'status', 'estimated_hours', 'due_date']
    success_url = reverse_lazy('erp_task_list')

    def get_initial(self):
        initial = super().get_initial()
        project_id = self.request.GET.get('project')
        if project_id:
            initial['project'] = project_id
        return initial

class TaskUpdateView(EngineeringRequiredMixin, UpdateView):
    model = Task
    template_name = 'erp/tasks/task_form.html'
    fields = ['project', 'title', 'description', 'assigned_to', 'priority', 'status', 'estimated_hours', 'actual_hours', 'due_date']
    
    def get_success_url(self):
        return reverse_lazy('erp_task_detail', kwargs={'pk': self.object.pk})

class TimeLogListView(ERPAccessMixin, ListView):
    model = TimeLog
    template_name = 'erp/tasks/timelog_list.html'
    context_object_name = 'timelogs'
    ordering = ['-date']

    def get_queryset(self):
        # Optional: Filter by user if needed, or show all for managers
        return super().get_queryset().select_related('task', 'user', 'task__project')

class TimeLogCreateView(ERPAccessMixin, CreateView):
    model = TimeLog
    form_class = TimeLogForm
    template_name = 'erp/tasks/timelog_form.html'
    success_url = reverse_lazy('erp_task_list') # Or timelog list

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy('erp_timelog_list')

class TimeLogUpdateView(ERPAccessMixin, UpdateView):
    model = TimeLog
    form_class = TimeLogForm
    template_name = 'erp/tasks/timelog_form.html'
    success_url = reverse_lazy('erp_timelog_list')

# ==============================================================================
# ASSETS
# ==============================================================================

class AssetListView(ERPAccessMixin, ListView):
    model = Asset
    template_name = 'erp/assets/asset_list.html'
    context_object_name = 'assets'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Fix filter: 'hardware' is not a valid choice, check for actual hardware types
        context['hardware_count'] = Asset.objects.filter(asset_type__in=['laptop', 'server', 'mobile', 'peripheral']).count()
        # 'software' matches 'license' choice? No, choice is 'license'
        context['license_count'] = Asset.objects.filter(asset_type='license').count()
        return context

class AssetDetailView(ERPAccessMixin, DetailView):
    model = Asset
    template_name = 'erp/assets/asset_detail.html'

class AssetCreateView(StoreManagerRequiredMixin, CreateView):
    model = Asset
    form_class = AssetForm
    template_name = 'erp/assets/asset_form.html'
    success_url = reverse_lazy('erp_asset_list')

class AssetUpdateView(OperationsRequiredMixin, UpdateView):
    model = Asset
    form_class = AssetForm
    template_name = 'erp/assets/asset_form.html'
    success_url = reverse_lazy('erp_asset_list')

# ==============================================================================
# SERVICES CATALOG
# ==============================================================================

class ServiceListView(ERPAccessMixin, ListView):
    model = Service
    template_name = 'erp/projects/service_list.html'
    context_object_name = 'services'
    ordering = ['name']

class ServiceCreateView(ERPAccessMixin, CreateView):
    model = Service
    form_class = ServiceForm
    template_name = 'erp/projects/service_form.html'
    success_url = reverse_lazy('erp_service_list')

class ServiceUpdateView(ERPAccessMixin, UpdateView):
    model = Service
    form_class = ServiceForm
    template_name = 'erp/projects/service_form.html'
    success_url = reverse_lazy('erp_service_list')

# ==============================================================================
# FINANCIALS
# ==============================================================================

class FinancialOverviewView(ExecutiveRequiredMixin, TemplateView):
    template_name = 'erp/financials/overview.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # 1. REVENUE (Invoices & Subscriptions)
        project_revenue = InternalProject.objects.aggregate(Sum('revenue'))['revenue__sum'] or 0
        
        # Store Revenue
        subscriptions = Subscription.objects.all().select_related('plan')
        total_mrr = sum([s.plan.price_monthly for s in subscriptions if s.is_valid and s.plan])
        order_revenue = Order.objects.aggregate(Sum('amount'))['amount__sum'] or 0
        
        # Grand Total Revenue
        total_revenue = project_revenue + order_revenue
        
        # 2. EXPENSES
        expenses = Expense.objects.filter(status='approved').aggregate(Sum('amount'))['amount__sum'] or 0
        vendor_bills = VendorBill.objects.filter(status__in=['scheduled', 'paid']).aggregate(Sum('amount'))['amount__sum'] or 0
        
        # 3. LABOR COST
        labor_cost = TimeLog.objects.aggregate(Sum('cost_amount'))['cost_amount__sum'] or 0
        
        # 4. TOTALS & PROFIT
        total_costs = expenses + vendor_bills + labor_cost
        net_profit = total_revenue - total_costs
        margin = (net_profit / total_revenue * 100) if total_revenue > 0 else 0

        context.update({
            'project_revenue': project_revenue,
            'order_revenue': order_revenue,
            'total_revenue': total_revenue,
            'total_mrr': total_mrr,
            'active_subs': subscriptions.filter(status='active').count(),
            'total_expenses': expenses,
            'total_bills': vendor_bills,
            'total_labor_cost': labor_cost,
            'total_costs': total_costs,
            'net_profit': net_profit,
            'profit_margin': margin,
        })
        return context





# ==============================================================================
# COMPLIANCE
# ==============================================================================

class RiskRunbookView(OperationsRequiredMixin, ListView):
    model = RiskRegister
    template_name = 'erp/compliance/risk_runbook.html'
    context_object_name = 'risks'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['severe_count'] = RiskRegister.objects.filter(impact='severe').count()
        context['high_count'] = RiskRegister.objects.filter(impact='high').count()
        context['medium_count'] = RiskRegister.objects.filter(impact='medium').count()
        context['low_count'] = RiskRegister.objects.filter(impact='low').count()
        return context

class RiskCreateView(OperationsRequiredMixin, CreateView):
    model = RiskRegister
    form_class = RiskForm
    template_name = 'erp/compliance/risk_form.html'
    success_url = reverse_lazy('erp_risk_runbook')
    
    def form_valid(self, form):
        form.instance.owner = self.request.user # Default owner if not selected
        return super().form_valid(form)

class RiskUpdateView(OperationsRequiredMixin, UpdateView):
    model = RiskRegister
    form_class = RiskForm
    template_name = 'erp/compliance/risk_form.html'
    success_url = reverse_lazy('erp_risk_runbook')

class RiskDetailView(ERPAccessMixin, DetailView):
    model = RiskRegister
    template_name = 'erp/compliance/risk_detail.html'
    context_object_name = 'risk'

class ComplianceItemListView(ERPAccessMixin, ListView):
    model = ComplianceItem
    template_name = 'erp/compliance/item_list.html'
    context_object_name = 'items'

class ComplianceItemCreateView(OperationsRequiredMixin, CreateView):
    model = ComplianceItem
    form_class = ComplianceItemForm
    template_name = 'erp/compliance/item_form.html'
    success_url = reverse_lazy('erp_compliance_items')

class ComplianceItemUpdateView(OperationsRequiredMixin, UpdateView):
    model = ComplianceItem
    form_class = ComplianceItemForm
    template_name = 'erp/compliance/item_form.html'
    success_url = reverse_lazy('erp_compliance_items')

class ComplianceItemDetailView(ERPAccessMixin, DetailView):
    model = ComplianceItem
    template_name = 'erp/compliance/item_detail.html'
    context_object_name = 'item'

# ==============================================================================
# WORKFORCE
# ==============================================================================

class WorkforceListView(OperationsRequiredMixin, ListView):
    model = get_user_model()
    template_name = 'erp/workforce/workforce_list.html'
    context_object_name = 'users'

    def get_queryset(self):
        return get_user_model().objects.select_related('employee_profile').all().order_by('username')

class EmployeeUpdateView(OperationsRequiredMixin, UpdateView):
    model = EmployeeProfile
    form_class = EmployeeForm
    template_name = 'erp/workforce/employee_form.html'
    success_url = reverse_lazy('erp_workforce_list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['employee_user'] = self.object.user
        return context

class EmployeeDetailView(ERPAccessMixin, DetailView):
    model = EmployeeProfile
    template_name = 'erp/workforce/employee_detail.html'
    context_object_name = 'profile'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Get tasks assigned to this user's user account
        context['assigned_tasks'] = Task.objects.filter(assigned_to=self.object.user).order_by('-created_at')[:5]
        # Get recent timelogs
        context['recent_logs'] = TimeLog.objects.filter(user=self.object.user).order_by('-date')[:5]
        return context

class EmployeeUpdateView(OperationsRequiredMixin, UpdateView):
    model = EmployeeProfile
    form_class = EmployeeForm
    template_name = 'erp/workforce/employee_form.html'
    
    def get_success_url(self):
        return reverse_lazy('erp_employee_detail', kwargs={'pk': self.object.pk})

# ==============================================================================
# VENDORS
# ==============================================================================

class VendorListView(ERPAccessMixin, ListView):
    model = Vendor
    template_name = 'erp/vendors/vendor_list.html'
    context_object_name = 'vendors'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['total_vendors'] = Vendor.objects.count()
        context['active_contracts_count'] = 5  # Placeholder
        return context

class VendorDetailView(ERPAccessMixin, DetailView):
    model = Vendor
    template_name = 'erp/vendors/vendor_detail.html'

class VendorCreateView(OperationsRequiredMixin, CreateView):
    model = Vendor
    form_class = VendorForm
    template_name = 'erp/vendors/vendor_form.html'
    success_url = reverse_lazy('erp_vendor_list')

# ==============================================================================
# REPORTS & EXPORTS
# ==============================================================================

import csv
from django.http import HttpResponse

class OperationsReportView(ExecutiveRequiredMixin, TemplateView):
    template_name = 'erp/reports/operations.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Aggregate data for reports
        context['total_tasks'] = Task.objects.count()
        context['completed_tasks'] = Task.objects.filter(status='done').count()
        context['total_hours'] = Task.objects.aggregate(Sum('actual_hours'))['actual_hours__sum'] or 0
        return context

# ==============================================================================
# FINANCIALS (NEW)
# ==============================================================================

class InvoiceListView(ERPAccessMixin, ListView):
    model = Invoice
    template_name = 'erp/financials/invoice_list.html'
    context_object_name = 'invoices'
    ordering = ['-issue_date']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        today = timezone.now().date()
        context['today'] = today
        context['total_receivable'] = Invoice.objects.exclude(status='paid').aggregate(Sum('total'))['total__sum'] or 0
        context['total_overdue'] = Invoice.objects.filter(status='overdue').aggregate(Sum('total'))['total__sum'] or 0
        context['paid_this_month'] = Invoice.objects.filter(
            status='paid', 
            paid_date__month=today.month, 
            paid_date__year=today.year
        ).aggregate(Sum('total'))['total__sum'] or 0
        return context

class InvoiceDetailView(ERPAccessMixin, DetailView):
    model = Invoice
    template_name = 'erp/financials/invoice_detail.html'
    context_object_name = 'invoice'

class InvoiceCreateView(ERPAccessMixin, CreateView):
    model = Invoice
    form_class = InvoiceForm
    template_name = 'erp/financials/invoice_form.html'
    success_url = reverse_lazy('erp_invoice_list')

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        if self.request.POST:
            data['items'] = InvoiceItemFormSet(self.request.POST)
        else:
            data['items'] = InvoiceItemFormSet()
        return data

    def form_valid(self, form):
        context = self.get_context_data()
        items = context['items']
        with transaction.atomic():
            self.object = form.save()
            if items.is_valid():
                items.instance = self.object
                items.save()
                # Update totals
                self.object.subtotal = sum(item.amount or 0 for item in self.object.items.all())
                self.object.total = self.object.subtotal + self.object.tax
                self.object.save()
        return super().form_valid(form)

class InvoiceUpdateView(ERPAccessMixin, UpdateView):
    model = Invoice
    form_class = InvoiceForm
    template_name = 'erp/financials/invoice_form.html'
    success_url = reverse_lazy('erp_invoice_list')

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        if self.request.POST:
            data['items'] = InvoiceItemFormSet(self.request.POST, instance=self.object)
        else:
            data['items'] = InvoiceItemFormSet(instance=self.object)
        return data

    def form_valid(self, form):
        context = self.get_context_data()
        items = context['items']
        with transaction.atomic():
            self.object = form.save()
            if items.is_valid():
                items.instance = self.object
                items.save()
                # Update totals
                self.object.subtotal = sum(item.amount or 0 for item in self.object.items.all())
                self.object.total = self.object.subtotal + self.object.tax
                self.object.save()
        return super().form_valid(form)

# ==============================================================================
# VENDOR CONTRACTS
# ==============================================================================

class VendorContractListView(ERPAccessMixin, ListView):
    model = VendorContract
    template_name = 'erp/vendors/contract_list.html'
    context_object_name = 'contracts'
    ordering = ['-start_date']

class VendorContractCreateView(ERPAccessMixin, CreateView):
    model = VendorContract
    form_class = VendorContractForm
    template_name = 'erp/vendors/contract_form.html'
    success_url = reverse_lazy('erp_contract_list')

class VendorContractUpdateView(ERPAccessMixin, UpdateView):
    model = VendorContract
    form_class = VendorContractForm
    template_name = 'erp/vendors/contract_form.html'
    success_url = reverse_lazy('erp_contract_list')

# ==============================================================================
# INVOICES (Billing)
# ==============================================================================

class InvoiceCreateView(ERPAccessMixin, CreateView):
    model = Invoice
    template_name = 'erp/financials/invoice_form.html'
    fields = ['client', 'contract', 'project', 'invoice_number', 'issue_date', 'due_date', 'subtotal', 'tax', 'total', 'status', 'notes']
    success_url = reverse_lazy('crm_invoices')

    def get_initial(self):
        initial = super().get_initial()
        # Pre-fill from GET parameters (e.g. ?client=1&contract=5)
        if self.request.GET.get('client'):
            initial['client'] = self.request.GET.get('client')
        if self.request.GET.get('contract'):
            initial['contract'] = self.request.GET.get('contract')
        if self.request.GET.get('project'):
            initial['project'] = self.request.GET.get('project')
        
        # Auto-generate Invoice Number (Simple logic)
        import random
        from datetime import datetime
        initial['invoice_number'] = f"INV-{datetime.now().year}-{random.randint(1000, 9999)}"
        initial['issue_date'] = datetime.now().date()
        initial['due_date'] = datetime.now().date()
        return initial

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if self.request.GET.get('contract'):
            from apps.crm.models import Contract
            try:
                context['linked_contract'] = Contract.objects.get(pk=self.request.GET.get('contract'))
            except Contract.DoesNotExist:
                pass
        return context

    def form_invalid(self, form):
        with open('debug_invoice_errors.txt', 'a') as f:
            f.write(f"TIMESTAMP: {timezone.now()}\n")
            f.write(f"ERRORS: {form.errors.as_json()}\n")
            f.write(f"DATA: {self.request.POST}\n")
            f.write("-" * 20 + "\n")
        return super().form_invalid(form)

class InvoiceDetailView(ERPAccessMixin, DetailView):
    model = Invoice
    template_name = 'erp/financials/invoice_detail.html'

class InvoiceUpdateView(ERPAccessMixin, UpdateView):
    model = Invoice
    template_name = 'erp/financials/invoice_form.html'
    fields = ['client', 'contract', 'project', 'invoice_number', 'issue_date', 'due_date', 'subtotal', 'tax', 'total', 'status', 'notes']
    success_url = reverse_lazy('erp_invoice_list')
    
    def get_success_url(self):
         return reverse_lazy('erp_invoice_detail', kwargs={'pk': self.object.pk})

class InvoiceItemCreateView(ERPAccessMixin, CreateView):
    model = InvoiceItem
    template_name = 'erp/financials/invoice_item_form.html'
    fields = ['product', 'description', 'quantity', 'unit_price']
    
    def form_valid(self, form):
        form.instance.invoice_id = self.kwargs['pk']
        return super().form_valid(form)
        
    def get_success_url(self):
        return reverse_lazy('erp_invoice_detail', kwargs={'pk': self.kwargs['pk']})

class VendorBillListView(ERPAccessMixin, ListView):
    model = VendorBill
    template_name = 'erp/financials/bill_list.html'
    context_object_name = 'bills'
    ordering = ['due_date']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['today'] = timezone.now().date()
        return context

class VendorBillCreateView(OperationsRequiredMixin, CreateView):
    model = VendorBill
    form_class = VendorBillForm
    template_name = 'erp/financials/bill_form.html'
    success_url = reverse_lazy('erp_bill_list')

class VendorBillUpdateView(OperationsRequiredMixin, UpdateView):
    model = VendorBill
    form_class = VendorBillForm
    template_name = 'erp/financials/bill_form.html'
    success_url = reverse_lazy('erp_bill_list')

class VendorBillDetailView(ERPAccessMixin, DetailView):
    model = VendorBill
    template_name = 'erp/financials/bill_detail.html'
    context_object_name = 'bill'

class ExpenseListView(ERPAccessMixin, ListView):
    model = Expense
    template_name = 'erp/financials/expense_list.html'
    context_object_name = 'expenses'
    ordering = ['-date']

class ExpenseDetailView(ERPAccessMixin, DetailView):
    model = Expense
    template_name = 'erp/financials/expense_detail.html'
    context_object_name = 'expense'

class ExpenseCreateView(ERPAccessMixin, CreateView):
    model = Expense
    form_class = ExpenseForm
    template_name = 'erp/financials/expense_form.html'
    success_url = reverse_lazy('erp_expense_list')
    
    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)

class ExpenseUpdateView(ERPAccessMixin, UpdateView):
    model = Expense
    form_class = ExpenseForm
    template_name = 'erp/financials/expense_form.html'
    success_url = reverse_lazy('erp_expense_list')



class FinancialExportView(ExecutiveRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="financial_report_{timezone.now().date()}.csv"'

        writer = csv.writer(response)
        writer.writerow(['Category', 'Metric', 'Value'])
        
        # Logic duplicated for export - considered acceptable for this scale
        project_revenue = InternalProject.objects.aggregate(Sum('revenue'))['revenue__sum'] or 0
        order_revenue = Order.objects.aggregate(Sum('amount'))['amount__sum'] or 0
        
        subscriptions = Subscription.objects.all().select_related('plan')
        total_mrr = sum([s.plan.price_monthly for s in subscriptions if s.is_valid and s.plan])
        
        expenses = Expense.objects.filter(status='approved').aggregate(Sum('amount'))['amount__sum'] or 0
        vendor_bills = VendorBill.objects.filter(status__in=['scheduled', 'paid']).aggregate(Sum('amount'))['amount__sum'] or 0
        labor_cost = TimeLog.objects.aggregate(Sum('cost_amount'))['cost_amount__sum'] or 0
        
        total_costs = expenses + vendor_bills + labor_cost
        net_profit = (project_revenue + order_revenue) - total_costs
        margin = (net_profit / (project_revenue + order_revenue) * 100) if (project_revenue + order_revenue) > 0 else 0

        writer.writerow(['Revenue', 'Project Revenue', project_revenue])
        writer.writerow(['Revenue', 'Order Revenue', order_revenue])
        writer.writerow(['Revenue', 'Total Revenue', project_revenue + order_revenue])
        writer.writerow([])
        writer.writerow(['Costs', 'Total Costs', total_costs])
        writer.writerow([])
        writer.writerow(['Profit', 'Net Profit', net_profit])
        writer.writerow(['Profit', 'Profit Margin (%)', round(margin, 2)])

        return response

class FinancialReportView(ExecutiveRequiredMixin, TemplateView):
    template_name = 'erp/reports/financials.html'
    
    def get_context_data(self, **kwargs):
        # Reuse logic from FinancialOverviewView if possible, or duplicate for now
        # Duplicating for simplicity in this artifact
        context = super().get_context_data(**kwargs)
        project_revenue = InternalProject.objects.aggregate(Sum('revenue'))['revenue__sum'] or 0
        order_revenue = Order.objects.aggregate(Sum('amount'))['amount__sum'] or 0
        total_revenue = project_revenue + order_revenue
        expenses = Expense.objects.filter(status='approved').aggregate(Sum('amount'))['amount__sum'] or 0
        vendor_bills = VendorBill.objects.filter(status__in=['scheduled', 'paid']).aggregate(Sum('amount'))['amount__sum'] or 0
        labor_cost = TimeLog.objects.aggregate(Sum('cost_amount'))['cost_amount__sum'] or 0
        total_costs = expenses + vendor_bills + labor_cost
        net_profit = total_revenue - total_costs
        margin = (net_profit / total_revenue * 100) if total_revenue > 0 else 0
        
        context.update({
            'project_revenue': project_revenue,
            'order_revenue': order_revenue,
            'total_revenue': total_revenue,
            'total_labor_cost': labor_cost,
            'total_expenses': expenses,
            'total_bills': vendor_bills,
            'total_costs': total_costs,
            'net_profit': net_profit,
            'profit_margin': margin,
        })
        return context

class SecurityOpsReportView(ExecutiveRequiredMixin, TemplateView):
    template_name = 'erp/reports/security_operations.html'

# ==============================================================================
# SYSTEM
# ==============================================================================

class AuditLogView(ExecutiveRequiredMixin, ListView):
    model = LogEntry
    template_name = 'erp/audit_logs.html'
    context_object_name = 'logs'
    paginate_by = 50
    
    def get_queryset(self):
        return LogEntry.objects.select_related('user', 'content_type').order_by('-action_time')
class ComplianceDashboardView(ERPAccessMixin, TemplateView):
    template_name = 'erp/compliance/dashboard.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Risk Stats
        context['severe_risks'] = RiskRegister.objects.filter(impact='severe', status__in=['identified', 'mitigating']).count()
        context['high_risks'] = RiskRegister.objects.filter(impact='high', status__in=['identified', 'mitigating']).count()
        context['total_active_risks'] = RiskRegister.objects.exclude(status='closed').count()
        
        # Recent Risks
        context['recent_risks'] = RiskRegister.objects.exclude(status='closed').order_by('-created_at')[:5]
        
        # Compliance Items Stats
        total_items = ComplianceItem.objects.count()
        compliant_items = ComplianceItem.objects.filter(status='compliant').count()
        context['compliance_score'] = (compliant_items / total_items * 100) if total_items > 0 else 0
        context['compliance_items'] = ComplianceItem.objects.all().order_by('framework', 'control_id')
        
        # Policies
        context['policies_count'] = Policy.objects.filter(status='published').count()
        context['policies_in_review'] = Policy.objects.filter(status='review').count()
        context['recent_policies'] = Policy.objects.order_by('-updated_at')[:5]
        
        return context

class PolicyListView(ERPAccessMixin, ListView):
    model = Policy
    template_name = 'erp/compliance/policy_list.html'
    context_object_name = 'policies'
    
    def get_queryset(self):
        return Policy.objects.all().order_by('title')

class PolicyDetailView(ERPAccessMixin, DetailView):
    model = Policy
    template_name = 'erp/compliance/policy_detail.html'
    context_object_name = 'policy'

class PolicyCreateView(OperationsRequiredMixin, CreateView):
    model = Policy
    form_class = PolicyForm
    template_name = 'erp/compliance/policy_form.html'
    success_url = reverse_lazy('erp_policy_list')

class PolicyUpdateView(OperationsRequiredMixin, UpdateView):
    model = Policy
    form_class = PolicyForm
    template_name = 'erp/compliance/policy_form.html'
    
    def get_success_url(self):
        return reverse_lazy('erp_policy_detail', kwargs={'pk': self.object.pk})

# ==============================================================================
# SYSTEM & INTEGRATIONS
# ==============================================================================

class SystemDashboardView(ERPAccessMixin, TemplateView):
    template_name = 'erp/system/dashboard.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # 1. Database Latency Check
        try:
            start_time = time.time()
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                cursor.fetchone()
            latency = (time.time() - start_time) * 1000 # Convert to ms
            context['db_latency'] = round(latency, 2)
            context['db_status'] = 'Operational'
        except Exception as e:
            context['db_latency'] = 0
            context['db_status'] = 'Error'
            
        # 2. Disk Usage
        try:
            total, used, free = shutil.disk_usage("/")
            context['disk_total'] = round(total / (2**30), 1) # GB
            context['disk_used'] = round(used / (2**30), 1)   # GB
            context['disk_percent'] = round((used / total) * 100)
            context['disk_status'] = 'Healthy' if context['disk_percent'] < 90 else 'Warning'
        except Exception:
             context['disk_status'] = 'Unknown'

        # 3. Cache Check
        try:
            cache.set('health_check', 'ok', 5)
            if cache.get('health_check') == 'ok':
                context['cache_status'] = 'Operational'
            else:
                context['cache_status'] = 'Degraded'
        except Exception:
            context['cache_status'] = 'Down'
            
        # 4. Error Rates (Last 24h LogEntries that look like errors)
        # Note: Using django_admin_log as a proxy for 'system events' if no other logger exists
        # In a real app, you'd likely query a specific ErrorLog model or Sentry API
        recent_changes = LogEntry.objects.filter(
            action_time__gte=timezone.now() - timezone.timedelta(hours=24)
        ).count()
        context['system_events_24h'] = recent_changes
        
        return context

class IntegrationListView(ERPAccessMixin, ListView):
    model = Integration
    template_name = 'erp/system/integrations.html'
    context_object_name = 'integrations'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Ensure all integration types exist in DB for valid display
        existing = {i.name for i in Integration.objects.all()}
        for code, label in Integration.SERVICE_CHOICES:
            if code not in existing:
                Integration.objects.create(name=code)
        return context

class IntegrationUpdateView(ERPAccessMixin, UpdateView):
    model = Integration
    form_class = IntegrationForm
    template_name = 'erp/system/integration_form.html'
    success_url = reverse_lazy('erp_integrations')

    def form_valid(self, form):
        # Simulate a connection check or sync
        instance = form.save(commit=False)
        if instance.is_active and not instance.connected_at:
             instance.connected_at = timezone.now()
        if instance.is_active:
             instance.last_sync = timezone.now()
        instance.save()
        return super().form_valid(form)

def toggle_integration(request, pk):
    integration = get_object_or_404(Integration, pk=pk)
    # Simple toggle logic
    integration.is_active = not integration.is_active
    if integration.is_active:
        integration.connected_at = timezone.now()
        integration.last_sync = timezone.now()
    integration.save()
    return redirect('erp_integrations')

# ==============================================================================
# FINANCIALS (EXPORTS & REPORTS) - RESTORED
# ==============================================================================

class FinancialExportView(ExecutiveRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="financial_report_{timezone.now().date()}.csv"'

        writer = csv.writer(response)
        writer.writerow(['Category', 'Metric', 'Value'])
        
        project_revenue = InternalProject.objects.aggregate(Sum('revenue'))['revenue__sum'] or 0
        order_revenue = Order.objects.aggregate(Sum('amount'))['amount__sum'] or 0
        total_revenue = project_revenue + order_revenue
        
        expenses = Expense.objects.filter(status='approved').aggregate(Sum('amount'))['amount__sum'] or 0
        vendor_bills = VendorBill.objects.filter(status__in=['scheduled', 'paid']).aggregate(Sum('amount'))['amount__sum'] or 0
        labor_cost = TimeLog.objects.aggregate(Sum('cost_amount'))['cost_amount__sum'] or 0
        total_costs = expenses + vendor_bills + labor_cost
        
        net_profit = total_revenue - total_costs
        margin = (net_profit / total_revenue * 100) if total_revenue > 0 else 0

        writer.writerow(['Revenue', 'Project Revenue', project_revenue])
        writer.writerow(['Revenue', 'Order Revenue', order_revenue])
        writer.writerow(['Revenue', 'Total Revenue', total_revenue])
        writer.writerow([])
        writer.writerow(['Costs', 'Total Costs', total_costs])
        writer.writerow([])
        writer.writerow(['Profit', 'Net Profit', net_profit])
        writer.writerow(['Profit', 'Profit Margin (%)', round(margin, 2)])

        return response

class FinancialReportView(ExecutiveRequiredMixin, TemplateView):
    template_name = 'erp/reports/financials.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        project_revenue = InternalProject.objects.aggregate(Sum('revenue'))['revenue__sum'] or 0
        order_revenue = Order.objects.aggregate(Sum('amount'))['amount__sum'] or 0
        total_revenue = project_revenue + order_revenue
        expenses = Expense.objects.filter(status='approved').aggregate(Sum('amount'))['amount__sum'] or 0
        vendor_bills = VendorBill.objects.filter(status__in=['scheduled', 'paid']).aggregate(Sum('amount'))['amount__sum'] or 0
        labor_cost = TimeLog.objects.aggregate(Sum('cost_amount'))['cost_amount__sum'] or 0
        total_costs = expenses + vendor_bills + labor_cost
        net_profit = total_revenue - total_costs
        margin = (net_profit / total_revenue * 100) if total_revenue > 0 else 0
        
        context.update({
            'project_revenue': project_revenue,
            'order_revenue': order_revenue,
            'total_revenue': total_revenue,
            'total_labor_cost': labor_cost,
            'total_expenses': expenses,
            'total_bills': vendor_bills,
            'total_costs': total_costs,
            'net_profit': net_profit,
            'profit_margin': margin,
        })
        return context
