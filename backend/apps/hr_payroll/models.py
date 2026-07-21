from django.db import models
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
