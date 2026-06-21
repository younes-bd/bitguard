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
    # Links to projects.Project
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
        return f"{self.employee} — {self.hours}h on {self.entry_date}"


class PayrollPeriod(TenantAwareModel):
    name = models.CharField(max_length=100) # e.g. "April 2024"
    start_date = models.DateField()
    end_date = models.DateField()
    is_closed = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name

class SalaryComponent(TenantAwareModel):
    COMPONENT_TYPES = [
        ('earning', 'Earning'),
        ('deduction', 'Deduction'),
    ]
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=COMPONENT_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    is_taxable = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.name} ({self.type})"

class PaySlip(TenantAwareModel):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='payslips')
    period = models.ForeignKey(PayrollPeriod, on_delete=models.CASCADE, related_name='payslips')
    basic_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_earnings = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    net_pay = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=50, choices=[
        ('draft', 'Draft'),
        ('approved', 'Approved'),
        ('paid', 'Paid'),
    ], default='draft')
    analytic_account = models.ForeignKey('accounting.AnalyticAccount', on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        unique_together = ('tenant', 'employee', 'period')
        
    def __str__(self):
        return f"Payslip for {self.employee.employee_id} - {self.period.name}"

class PaySlipLine(TenantAwareModel):
    payslip = models.ForeignKey(PaySlip, on_delete=models.CASCADE, related_name='lines')
    salary_component = models.ForeignKey(SalaryComponent, on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.salary_component.name}: {self.amount}"

class PayrollStructure(TenantAwareModel):
    name = models.CharField(max_length=100)
    base_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    components = models.ManyToManyField(SalaryComponent, blank=True)

    def __str__(self):
        return self.name

class PayrollRun(TenantAwareModel):
    period = models.ForeignKey(PayrollPeriod, on_delete=models.CASCADE)
    date_generated = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, default='draft', choices=[
        ('draft', 'Draft'),
        ('approved', 'Approved'),
        ('paid', 'Paid')
    ])
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return f"Run for {self.period}"

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

# ─── ODOO-STYLE ENTERPRISE HRM MODELS (PHASE 2) ───

class JobPosition(TenantAwareModel):
    name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='job_positions')
    description = models.TextField(blank=True)
    expected_employees = models.IntegerField(default=1)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Job Position'

    def __str__(self):
        return self.name

class EmployeeContract(TenantAwareModel):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='contracts')
    job_position = models.ForeignKey(JobPosition, on_delete=models.SET_NULL, null=True, blank=True)
    payroll_structure = models.ForeignKey(PayrollStructure, on_delete=models.SET_NULL, null=True, blank=True)
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

class Attendance(TenantAwareModel):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='attendances')
    check_in = models.DateTimeField()
    check_out = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Attendance'

    def __str__(self):
        return f"{self.employee} ({self.check_in.date()})"

class Appraisal(TenantAwareModel):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='appraisals')
    manager = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='conducted_appraisals')
    date = models.DateField()
    score = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    feedback = models.TextField(blank=True)
    status = models.CharField(max_length=20, default='planned', choices=[
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('done', 'Done')
    ])

    class Meta:
        verbose_name = 'Appraisal'

    def __str__(self):
        return f"Appraisal {self.employee} ({self.date})"

class JobApplication(TenantAwareModel):
    job_position = models.ForeignKey(JobPosition, on_delete=models.CASCADE, related_name='applications')
    applicant_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    resume = models.FileField(upload_to='resumes/%Y/%m/', null=True, blank=True)
    status = models.CharField(max_length=20, default='new', choices=[
        ('new', 'New'),
        ('interview', 'Interview'),
        ('offer', 'Offer'),
        ('hired', 'Hired'),
        ('rejected', 'Rejected')
    ])

    class Meta:
        verbose_name = 'Job Application'

    def __str__(self):
        return f"{self.applicant_name} for {self.job_position}"
