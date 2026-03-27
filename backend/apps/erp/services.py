"""
ERP Service Layer — Charter §8, §11, §16, §18 Compliance
Handles Invoice, Payment, Expense, and InternalProject with full audit tracing.
"""
from django.db import transaction
from django.db.models import Sum
from django.utils import timezone
from apps.core.services.base import BaseService
from apps.core.services.audit import AuditService
from .models import Invoice, Payment, Expense, InternalProject


class EnterpriseService(BaseService):
    """
    High-level Enterprise operations and dashboard statistics.
    """
    @classmethod
    def get_dashboard_stats(cls, request):
        """
        Aggregates operational and financial KPIs across the Enterprise.
        """
        tenant = cls.get_tenant_context(request)
        today = timezone.now().date()
        
        # --- Operations Stats ---
        active_projects = InternalProject.objects.filter(tenant=tenant, status='active')
        active_projects_count = active_projects.count()
        
        # Financials from ERP
        total_invoiced = Invoice.objects.filter(tenant=tenant).aggregate(total=Sum('amount'))['total'] or 0
        total_paid = Payment.objects.filter(invoice__tenant=tenant).aggregate(total=Sum('amount'))['total'] or 0
        total_expenses = Expense.objects.filter(tenant=tenant).aggregate(total=Sum('amount'))['total'] or 0
        
        # SCM and ITAM Integration (Lazy imports to avoid circular deps)
        try:
            from apps.scm.models import PurchaseOrder
            pending_po_count = PurchaseOrder.objects.filter(tenant=tenant, status__in=['draft', 'sent']).count()
        except ImportError:
            pending_po_count = 0
            
        try:
            from apps.itam.models import Asset
            total_assets_count = Asset.objects.filter(tenant=tenant).count()
        except ImportError:
            total_assets_count = 0

        # Note: In a real enterprise system, more complex logic for MRR and Profit would go here
        # utilizing the billing and store apps.
        
        return {
            "kpi": {
                "active_projects": active_projects_count,
                "pending_purchase_orders": pending_po_count,
                "total_managed_assets": total_assets_count,
                "overdue_invoices": Invoice.objects.filter(tenant=tenant, status='overdue').count(),
            },
            "financials": {
                "total_invoiced": float(total_invoiced),
                "total_paid": float(total_paid),
                "total_expenses": float(total_expenses),
                "net_cash_flow": float(total_paid - total_expenses)
            },
            "system": {
                "status": "Operational",
                "last_audit": timezone.now().isoformat()
            }
        }


class InvoiceService(BaseService):
    """Manages ERP Invoices. Charter §18: all revenue actions are traceable."""

    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(Invoice.objects.all(), request)

    @classmethod
    @transaction.atomic
    def create_invoice(cls, request, data: dict) -> Invoice:
        tenant = cls.get_tenant_context(request)
        invoice = Invoice(tenant=tenant, **data)
        invoice.full_clean()
        invoice.save()
        AuditService.log_action(
            request,
            action="ERP_INVOICE_CREATED",
            resource=f"erp.Invoice:{invoice.pk}",
            payload={
                "invoice_number": invoice.invoice_number,
                "amount": float(invoice.amount),
                "status": invoice.status,
            },
        )
        return invoice

    @classmethod
    @transaction.atomic
    def update_invoice(cls, request, invoice: Invoice, data: dict) -> Invoice:
        cls.validate_ownership(invoice, request)
        for field, value in data.items():
            setattr(invoice, field, value)
        invoice.full_clean()
        invoice.save()
        AuditService.log_action(
            request,
            action="ERP_INVOICE_UPDATED",
            resource=f"erp.Invoice:{invoice.pk}",
            payload={"changes": data},
        )
        return invoice


class PaymentService(BaseService):
    """
    Manages ERP Payments. Charter §18: Payments generate accounting events.
    """

    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(Payment.objects.all(), request)

    @classmethod
    @transaction.atomic
    def record_payment(cls, request, invoice: Invoice, data: dict) -> Payment:
        payment = Payment(invoice=invoice, **data)
        payment.full_clean()
        payment.save()

        # Mark invoice as paid if fully covered
        total_received = invoice.payments.aggregate(total=Sum('amount'))['total'] or 0
        if invoice.amount <= total_received:
            invoice.status = 'paid'
            invoice.save(update_fields=['status'])

        AuditService.log_action(
            request,
            action="ERP_PAYMENT_RECORDED",
            resource=f"erp.Payment:{payment.pk}",
            payload={
                "invoice": invoice.invoice_number,
                "amount": float(payment.amount),
                "method": payment.payment_method,
            },
        )
        return payment


class ExpenseService(BaseService):
    """Manages ERP Expenses with tenant scoping."""

    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(Expense.objects.all(), request)

    @classmethod
    @transaction.atomic
    def create_expense(cls, request, data: dict) -> Expense:
        tenant = cls.get_tenant_context(request)
        expense = Expense(tenant=tenant, **data)
        expense.full_clean()
        expense.save()
        AuditService.log_action(
            request,
            action="ERP_EXPENSE_CREATED",
            resource=f"erp.Expense:{expense.pk}",
            payload={"title": expense.title, "amount": float(expense.amount)},
        )
        return expense


class InternalProjectService(BaseService):
    """
    Manages ERP Internal Projects (service delivery obligations).
    Charter §16: Selling a service creates a delivery obligation.
    """

    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(InternalProject.objects.all(), request)

    @classmethod
    @transaction.atomic
    def create_project_from_order(cls, request, order) -> InternalProject:
        """
        Charter §16: Creates a delivery obligation from a Store Order.
        """
        tenant = cls.get_tenant_context(request)
        project = InternalProject.objects.create(
            name=f"Delivery: {order.product.name} for {order.user.username}",
            client=getattr(order.user, 'client', None), # Assume user has a linked client
            tenant=tenant,
            status='planning',
            budget=order.total_amount,
            is_service_obligation=True,
            due_date=timezone.now().date() + timezone.timedelta(days=7),
            description=f"Automated delivery obligation from Order #{order.id}"
        )
        
        AuditService.log_action(
            request,
            action="ERP_PROJECT_CREATED_FROM_ORDER",
            resource=f"erp.InternalProject:{project.pk}",
            payload={"order_id": order.id}
        )
        return project

    @classmethod
    @transaction.atomic
    def update_project(cls, request, project: InternalProject, data: dict) -> InternalProject:
        cls.validate_ownership(project, request)
        for field, value in data.items():
            setattr(project, field, value)
        project.full_clean()
        project.save()
        AuditService.log_action(
            request,
            action="ERP_PROJECT_UPDATED",
            resource=f"erp.InternalProject:{project.pk}",
            payload={"changes": data},
        )
        return project
