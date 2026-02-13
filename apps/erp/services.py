from django.db.models import Sum, Count, Q
from django.utils import timezone
from .models import InternalProject, Task, OperationKPI, TimeLog, Expense, VendorBill, RiskRegister
from apps.store.services import CommerceService
from apps.core.services.base import BaseService

class EnterpriseService(BaseService):
    @staticmethod
    def get_dashboard_stats(user):
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
        my_tasks_count = Task.objects.filter(assigned_to=user, status__in=['todo', 'in_progress']).count()
        overdue_tasks_count = Task.objects.filter(status__in=['todo', 'in_progress'], due_date__lt=today).count()
        
        # Risks
        high_risks_count = RiskRegister.objects.filter(impact__in=['high', 'severe']).count()
        
        # Invoices (Bills)
        new_invoices_count = VendorBill.objects.filter(status__in=['scheduled', 'pending']).count()

        # --- Financials ---
        project_revenue = InternalProject.objects.aggregate(Sum('revenue'))['revenue__sum'] or 0
        order_revenue = CommerceService.get_order_revenue()
        total_revenue = project_revenue + order_revenue
        
        subscription_stats = CommerceService.get_subscription_stats()
        total_mrr = subscription_stats['mrr']

        expenses = Expense.objects.filter(status='approved').aggregate(Sum('amount'))['amount__sum'] or 0
        vendor_bills = VendorBill.objects.filter(status__in=['scheduled', 'paid']).aggregate(Sum('amount'))['amount__sum'] or 0
        labor_cost = TimeLog.objects.aggregate(Sum('cost_amount'))['cost_amount__sum'] or 0
        total_costs = expenses + vendor_bills + labor_cost
        
        net_profit = total_revenue - total_costs
        profit_margin = (net_profit / total_revenue * 100) if total_revenue > 0 else 0

        # --- Real-time KPIs from DB ---
        kpis = OperationKPI.objects.all()
        resource_utilization = kpis.filter(category='resource').first()
        sla_health = kpis.filter(category='sla').first()

        return {
            "kpi": {
                "active_projects": active_projects_count,
                "planning_projects": pending_projects_count,
                "my_tasks": my_tasks_count,
                "overdue_tasks": overdue_tasks_count,
                "high_risks": high_risks_count,
                "new_invoices": new_invoices_count,
                "budget_usage": round(budget_usage, 1),
                "resource_utilization": float(resource_utilization.value.strip('%')) if resource_utilization else 85,
                "sla_health": float(sla_health.value.strip('%')) if sla_health else 99.9
            },
            "financials": {
                "total_revenue": float(total_revenue),
                "project_revenue": float(project_revenue),
                "mrr": float(total_mrr),
                "total_costs": float(total_costs),
                "net_profit": float(net_profit),
                "profit_margin": round(profit_margin, 1)
            },
            "system": {
                "status": "Operational",
                "database": "Operational",
                "core": "Operational"
            }
        }
    @staticmethod
    def create_delivery_obligation(order, request=None):
        """
        Automates the creation of a delivery obligation (InternalProject) 
        from a Store Order. Required by Charter Section 16.
        """
        product = order.product
        if not product or not product.service:
            return None # Not a service delivery product

        from apps.crm.models import Client
        # Find or create a Client for this user to maintain Lifecycle Canon (Section 15)
        client = Client.objects.filter(contacts__user=order.user).first()
        if not client:
            # Fallback: create a basic client if none exists
            client = Client.objects.create(
                name=f"{order.user.username} (Client)",
                client_type='individual',
                status='active', # Purchased a product, so they are active
                tenant=order.tenant
            )
        
        project = InternalProject.objects.create(
            name=f"Delivery: {product.name} for {order.user.username}",
            client=client,
            tenant=order.tenant,
            service_type=product.service,
            status='planning',
            revenue=order.amount,
            is_service_obligation=True, # Explicit Section 16 link
            deadline=timezone.now().date() + timezone.timedelta(days=7), # Default delivery SLA
            description=f"Automated delivery obligation from Order #{order.id}"
        )

        # Create an initial task
        Task.objects.create(
            project=project,
            title="Initial Service Provisioning",
            description=f"Set up {product.name} as per order requirements.",
            status='todo',
            priority='high',
            due_date=timezone.now().date() + timezone.timedelta(days=1)
        )

        # Log completion of obligation creation
        if request:
            from apps.core.services.audit import AuditService
            AuditService.log(
                request,
                action="DELIVERY_OBLIGATION_CREATED",
                resource=f"erp.InternalProject:{project.id}",
                payload={"order_id": order.id}
            )

        return project
