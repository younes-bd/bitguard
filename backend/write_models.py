import os

BASE_DIR = "apps"

attendance_models = """from django.db import models
from apps.core.domain.models import TenantAwareModel
from apps.hr.domain.models import Employee

class Attendance(TenantAwareModel):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='attendances')
    check_in = models.DateTimeField()
    check_out = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Attendance'

    def __str__(self):
        return f"{self.employee} ({self.check_in.date()})"
"""

holidays_models = """from django.db import models
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
        return f"{self.employee} — {self.leave_type} ({self.start_date} → {self.end_date})"

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
"""

recruitment_models = """from django.db import models
from apps.core.domain.models import TenantAwareModel
from apps.hr.domain.models import Employee, Department

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

class JobApplicant(TenantAwareModel):
    name = models.CharField(max_length=255)
    job_title = models.CharField(max_length=255)
    status = models.CharField(max_length=50, default='applied')
"""

payroll_models = """from django.db import models
from apps.core.domain.models import TenantAwareModel
from apps.hr.domain.models import Employee

class PayrollPeriod(TenantAwareModel):
    name = models.CharField(max_length=100) # e.g. "April 2024"
    start_date = models.DateField()
    end_date = models.DateField()
    is_closed = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name

class PayrollStructure(TenantAwareModel):
    name = models.CharField(max_length=100)
    structure_type = models.CharField(max_length=20, choices=[('employee','Employee'),('worker','Worker')], default='employee')

    def __str__(self):
        return self.name

class SalaryRule(TenantAwareModel):
    structure = models.ForeignKey(PayrollStructure, on_delete=models.CASCADE, related_name='rules')
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    category = models.CharField(max_length=20, choices=[('basic','Basic'),('allowance','Allowance'),('deduction','Deduction'),('gross','Gross'),('net','Net')], default='basic')
    condition_type = models.CharField(max_length=20, choices=[('none','Always'),('range','Range')], default='none')
    amount_type = models.CharField(max_length=20, choices=[('fixed','Fixed'),('percent','Percentage of'),('code','Python Code')], default='fixed')
    amount = models.DecimalField(max_digits=12, decimal_places=4, default=0)
    sequence = models.IntegerField(default=10)

    def __str__(self):
        return f"{self.name} ({self.code})"

class PayslipBatch(TenantAwareModel):
    name = models.CharField(max_length=100)
    date_start = models.DateField()
    date_end = models.DateField()
    state = models.CharField(max_length=20, choices=[('draft','Draft'),('verify','Verify'),('close','Done')], default='draft')

    def __str__(self):
        return self.name

class Payslip(TenantAwareModel):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='payslips')
    batch = models.ForeignKey(PayslipBatch, on_delete=models.SET_NULL, null=True, blank=True)
    structure = models.ForeignKey(PayrollStructure, on_delete=models.SET_NULL, null=True)
    date_from = models.DateField()
    date_to = models.DateField()
    state = models.CharField(max_length=20, choices=[('draft','Draft'),('verify','To Pay'),('done','Paid'),('cancel','Cancelled')], default='draft')
    basic_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    gross_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    net_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return f"Payslip for {self.employee.employee_id} ({self.date_from} - {self.date_to})"

class PayslipLine(TenantAwareModel):
    payslip = models.ForeignKey(Payslip, on_delete=models.CASCADE, related_name='lines')
    rule = models.ForeignKey(SalaryRule, on_delete=models.SET_NULL, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.rule.name}: {self.amount}"
"""

appraisal_models = """from django.db import models
from django.conf import settings
from apps.core.domain.models import TenantAwareModel
from apps.hr.domain.models import Employee

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

class PerformanceAppraisal(TenantAwareModel):
    review_period = models.CharField(max_length=100)
    score = models.IntegerField(default=0)

class PerformanceReview(TenantAwareModel):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    review_period = models.CharField(max_length=20, help_text="e.g. Q1-2026")
    overall_rating = models.IntegerField(choices=[(1,'Poor'),(2,'Below Average'),(3,'Average'),(4,'Good'),(5,'Excellent')], null=True)
    goals = models.JSONField(default=list)  # [{ title, target, achieved, score }]
    feedback = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=[('draft','Draft'),('in_review','In Review'),('completed','Completed')], default='draft')
    due_date = models.DateField(null=True, blank=True)
"""

expense_models = """from django.db import models
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
"""

data = {
    'hr_attendance': attendance_models,
    'hr_holidays': holidays_models,
    'hr_recruitment': recruitment_models,
    'hr_payroll': payroll_models,
    'hr_appraisal': appraisal_models,
    'hr_expense': expense_models,
}

for app_name, content in data.items():
    file_path = os.path.join(BASE_DIR, app_name, 'models.py')
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Written models to {app_name}")
