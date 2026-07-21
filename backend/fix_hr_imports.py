import os

base_dir = r"apps/hr/api"
serializers_path = os.path.join(base_dir, "serializers.py")
views_path = os.path.join(base_dir, "views.py")

with open(serializers_path, 'r', encoding='utf-8') as f:
    ser_content = f.read()

# Fix serializers.py imports
ser_content = ser_content.replace(
    "from ..domain.models import Department, Employee, LeaveRequest, Certification, TimeEntry, PayrollPeriod, OnboardingInstance, OnboardingTask, PerformanceReview, EmployeeSkill",
    """from ..domain.models import Department, Employee, Certification, TimeEntry, OnboardingInstance, OnboardingTask, EmployeeSkill
from apps.hr_holidays.models import LeaveRequest
from apps.hr_payroll.models import PayrollPeriod
from apps.hr_appraisal.models import PerformanceReview"""
)

ser_content = ser_content.replace(
    "from ..domain.models import PayslipBatch, Payslip, PayslipLine, SalaryRule",
    "from apps.hr_payroll.models import PayslipBatch, Payslip, PayslipLine, SalaryRule"
)

ser_content = ser_content.replace(
    "from ..domain.models import JobPosition, JobApplication",
    "from apps.hr_recruitment.models import JobPosition, JobApplication"
)

ser_content = ser_content.replace(
    "from ..domain.models import EmployeeContract, LeaveAllocation, Attendance, Appraisal",
    """from ..domain.models import EmployeeContract
from apps.hr_holidays.models import LeaveAllocation
from apps.hr_attendance.models import Attendance
from apps.hr_appraisal.models import Appraisal"""
)

ser_content = ser_content.replace(
    "from ..domain.models import PayrollStructure, ExpenseReport",
    """from apps.hr_payroll.models import PayrollStructure
from apps.hr_expense.models import ExpenseReport"""
)

ser_content = ser_content.replace(
    "from ..domain.models import JobApplicant, PerformanceAppraisal, ReferralCampaign",
    """from apps.hr_recruitment.models import JobApplicant
from apps.hr_appraisal.models import PerformanceAppraisal
from ..domain.models import ReferralCampaign"""
)

with open(serializers_path, 'w', encoding='utf-8') as f:
    f.write(ser_content)


with open(views_path, 'r', encoding='utf-8') as f:
    views_content = f.read()

views_content = views_content.replace(
    """from ..domain.models import (
    Department, Employee, LeaveRequest, Certification, TimeEntry,
    PayrollPeriod, OnboardingInstance, OnboardingTask,
    JobPosition, JobApplication, PerformanceReview, EmployeeSkill
)""",
    """from ..domain.models import (
    Department, Employee, Certification, TimeEntry,
    OnboardingInstance, OnboardingTask, EmployeeSkill
)
from apps.hr_holidays.models import LeaveRequest
from apps.hr_payroll.models import PayrollPeriod
from apps.hr_recruitment.models import JobPosition, JobApplication
from apps.hr_appraisal.models import PerformanceReview"""
)

views_content = views_content.replace(
    "from ..domain.models import PayslipBatch, Payslip, PayslipLine, SalaryRule",
    "from apps.hr_payroll.models import PayslipBatch, Payslip, PayslipLine, SalaryRule"
)

views_content = views_content.replace(
    "from ..domain.models import EmployeeContract, LeaveAllocation, Attendance, Appraisal",
    """from ..domain.models import EmployeeContract
from apps.hr_holidays.models import LeaveAllocation
from apps.hr_attendance.models import Attendance
from apps.hr_appraisal.models import Appraisal"""
)

views_content = views_content.replace(
    "from ..domain.models import PayrollStructure, ExpenseReport",
    """from apps.hr_payroll.models import PayrollStructure
from apps.hr_expense.models import ExpenseReport"""
)

views_content = views_content.replace(
    "from ..domain.models import JobApplicant, PerformanceAppraisal, ReferralCampaign",
    """from apps.hr_recruitment.models import JobApplicant
from apps.hr_appraisal.models import PerformanceAppraisal
from ..domain.models import ReferralCampaign"""
)

with open(views_path, 'w', encoding='utf-8') as f:
    f.write(views_content)

print("Fixed imports in views.py and serializers.py")
