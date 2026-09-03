from django.db import models
from django.conf import settings
from apps.core.domain.models import BaseModel, TenantAwareModel

class Department(TenantAwareModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    manager = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='managed_departments'
    )
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Employee(TenantAwareModel):
    job_application = models.OneToOneField('hr_recruitment.JobApplication', on_delete=models.SET_NULL, null=True, blank=True, related_name='hired_employee')
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
    emergency_contact_name = models.CharField(max_length=100, blank=True, null=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True, null=True)
    bank_account_number = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} ({self.job_title})"

    class Meta:
        verbose_name = 'Employee'


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
    project = models.ForeignKey('projects.Project', on_delete=models.SET_NULL, null=True, blank=True, related_name='hrm_time_entries')
    project_name = models.CharField(max_length=255, blank=True, help_text="Snapshot")
    description = models.TextField()
    hours = models.DecimalField(max_digits=5, decimal_places=2)
    entry_date = models.DateField()
    is_billable = models.BooleanField(default=True)
    is_billed = models.BooleanField(default=False)
    approved = models.BooleanField(default=False)
    analytic_account = models.ForeignKey('accounting.AnalyticAccount', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name = 'Time Entry'
        ordering = ['-entry_date']

    def __str__(self):
        return f"{self.employee} â€” {self.hours}h on {self.entry_date}"


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


class EmployeeContract(TenantAwareModel):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='contracts')
    # Link to hr_recruitment.JobPosition by string to avoid circular dependency
    job_position = models.ForeignKey('hr_recruitment.JobPosition', on_delete=models.SET_NULL, null=True, blank=True)
    payroll_structure = models.ForeignKey('hr_payroll.PayrollStructure', on_delete=models.SET_NULL, null=True, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    wage = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    contract_type = models.CharField(max_length=50, default='full_time', choices=[
        ('full_time', 'Full-time'),
        ('part_time', 'Part-time'),
        ('contractor', 'Contractor')
    ])
    status = models.CharField(max_length=20, default='draft', choices=[
        ('draft', 'New'),
        ('open', 'Running'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled')
    ])

    class Meta:
        verbose_name = 'Employee Contract'

    def __str__(self):
        return f"{self.employee} - {self.contract_type}"


class EmployeeSkill(TenantAwareModel):
    employee = models.ForeignKey('Employee', on_delete=models.CASCADE, related_name='employee_skills')
    skill_name = models.CharField(max_length=100)
    skill_type = models.CharField(max_length=50, blank=True)
    level = models.CharField(max_length=20, choices=[('beginner','Beginner'),('intermediate','Intermediate'),('advanced','Advanced'),('expert','Expert')], default='beginner')
    progress = models.IntegerField(default=0, help_text="0-100% proficiency")

class ReferralCampaign(TenantAwareModel):
    title = models.CharField(max_length=255)
    reward_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
