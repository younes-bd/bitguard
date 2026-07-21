from django.db import models
from apps.core.domain.models import TenantAwareModel
from apps.hr.domain.models import Employee

class ExpenseReport(TenantAwareModel):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='expense_reports')
    title = models.CharField(max_length=255)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, default='draft', choices=[
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('paid', 'Paid'),
        ('rejected', 'Rejected')
    ])
    analytic_account = models.ForeignKey('accounting.AnalyticAccount', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.title
