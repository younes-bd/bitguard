from django.db import models
from django.conf import settings
from apps.core.models import BaseModel, TenantAwareModel


class Department(TenantAwareModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    manager = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='managed_departments'
    )

    def __str__(self):
        return self.name


class Employee(TenantAwareModel):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('on_leave', 'On Leave'),
        ('terminated', 'Terminated'),
    ]
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='employee_profile'
    )
    department = models.ForeignKey(
        Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='employees'
    )
    employee_id = models.CharField(max_length=50, unique=True)
    job_title = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    hire_date = models.DateField()
    salary = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    skills = models.JSONField(default=list, blank=True, help_text="List of skill tags")
    phone = models.CharField(max_length=30, blank=True)
    emergency_contact = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} ({self.job_title})"

    class Meta:
        verbose_name = 'Employee'


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
        return f"{self.employee} — {self.leave_type} ({self.start_date} → {self.end_date})"

    class Meta:
        verbose_name = 'Leave Request'


class Certification(TenantAwareModel):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='certifications')
    title = models.CharField(max_length=255, help_text="e.g. CISSP, AWS Solutions Architect")
    issuer = models.CharField(max_length=100)
    issued_date = models.DateField()
    expiry_date = models.DateField(null=True, blank=True)
    credential_id = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} ({self.employee})"


class TimeEntry(TenantAwareModel):
    """Billable and non-billable time entries for projects and clients."""
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='time_entries')
    # Links to ERP InternalProject
    project_id = models.UUIDField(null=True, blank=True, help_text="UUID of ERP InternalProject")
    project_name = models.CharField(max_length=255, blank=True, help_text="Snapshot")
    description = models.TextField()
    hours = models.DecimalField(max_digits=5, decimal_places=2)
    entry_date = models.DateField()
    is_billable = models.BooleanField(default=True)
    approved = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Time Entry'
        ordering = ['-entry_date']

    def __str__(self):
        return f"{self.employee} — {self.hours}h on {self.entry_date}"


class PayrollPeriod(TenantAwareModel):
    name = models.CharField(max_length=100) # e.g. "April 2024"
    start_date = models.DateField()
    end_date = models.DateField()
    is_closed = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name

class PayrollRecord(TenantAwareModel):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='payroll_records')
    period = models.ForeignKey(PayrollPeriod, on_delete=models.CASCADE, related_name='records')
    gross_salary = models.DecimalField(max_digits=12, decimal_places=2)
    deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    net_pay = models.DecimalField(max_digits=12, decimal_places=2)
    payment_status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('paid', 'Paid')], default='pending')
    payment_date = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.employee.employee_id} - {self.period.name}"

class OnboardingInstance(TenantAwareModel):
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('on_hold', 'On Hold'),
    ]
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name='onboarding')
    start_date = models.DateField()
    target_completion_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    notes = models.TextField(blank=True)
    def __str__(self):
        return f"Onboarding: {self.employee}"
    @property
    def progress_percent(self):
        total = self.tasks.count()
        if not total:
            return 0
        done = self.tasks.filter(status='done').count()
        return round(done / total * 100)

class OnboardingTask(TenantAwareModel):
    CATEGORY_CHOICES = [
        ('it_setup', 'IT Setup'),
        ('hr_admin', 'HR Admin'),
        ('training', 'Training'),
        ('other', 'Other'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
    ]
    onboarding = models.ForeignKey(OnboardingInstance, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='onboarding_tasks'
    )
    due_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True)
    class Meta:
        ordering = ['category', 'created_at']
    def __str__(self):
        return self.title
