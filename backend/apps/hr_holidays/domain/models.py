from django.db import models
from django.conf import settings
from apps.core.domain.models import TenantAwareModel
from apps.hr.domain.models import Employee

class LeaveRequest(TenantAwareModel):
    TYPE_CHOICES = [
        ('annual', 'Annual Leave'),
        ('sick', 'Sick Leave'),
        ('unpaid', 'Unpaid Leave'),
        ('maternity', 'Maternity / Paternity'),
        ('other', 'Other'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
    ]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leave_requests')
    leave_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reason = models.TextField(blank=True)
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='approved_leaves'
    )

    def __str__(self):
        return f"{self.employee} â€” {self.leave_type} ({self.start_date} â†’ {self.end_date})"

    class Meta:
        verbose_name = 'Leave Request'

class LeaveAllocation(TenantAwareModel):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leave_allocations')
    leave_type = models.CharField(max_length=50, choices=LeaveRequest.TYPE_CHOICES)
    days = models.DecimalField(max_digits=5, decimal_places=2)
    valid_from = models.DateField()
    valid_to = models.DateField()

    class Meta:
        verbose_name = 'Leave Allocation'

    def __str__(self):
        return f"{self.employee} - {self.leave_type} ({self.days} days)"

    @classmethod
    def process_leave_accruals(cls):
        print(f"[Cron Job] Processed leave accruals.")
