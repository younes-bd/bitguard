from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DepartmentViewSet, EmployeeViewSet, LeaveRequestViewSet, CertificationViewSet, TimeEntryViewSet, HrmDashboardView,
    PayrollPeriodViewSet, OnboardingInstanceViewSet, OnboardingTaskViewSet,
    JobPositionViewSet, JobApplicationViewSet
)

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'leave-requests', LeaveRequestViewSet, basename='leave-request')
router.register(r'certifications', CertificationViewSet, basename='certification')
router.register(r'time-entries', TimeEntryViewSet, basename='time-entry')
router.register(r'payroll-periods', PayrollPeriodViewSet, basename='payroll-period')
from .views import PayslipBatchViewSet, PayslipViewSet, SalaryRuleViewSet
router.register(r'payslip-batches', PayslipBatchViewSet, basename='payslip-batch')
router.register(r'payslips', PayslipViewSet, basename='payslip')
router.register(r'salary-rules', SalaryRuleViewSet, basename='salary-rule')
router.register(r'onboarding', OnboardingInstanceViewSet, basename='onboarding')
router.register(r'onboarding-tasks', OnboardingTaskViewSet, basename='onboarding-task')
router.register(r'job-positions', JobPositionViewSet, basename='job-position')
router.register(r'job-applications', JobApplicationViewSet, basename='job-application')

from .views import EmployeeContractViewSet, LeaveAllocationViewSet, AttendanceViewSet, AppraisalViewSet, PayrollStructureViewSet, ExpenseReportViewSet
router.register(r'contracts', EmployeeContractViewSet, basename='contract')
router.register(r'leave-allocations', LeaveAllocationViewSet, basename='leave-allocation')
router.register(r'attendance', AttendanceViewSet, basename='attendance')
router.register(r'appraisals', AppraisalViewSet, basename='appraisal')
router.register(r'payroll-structures', PayrollStructureViewSet, basename='payroll-structure')

router.register(r'expense-reports', ExpenseReportViewSet, basename='expense-report')

from .views import JobApplicantViewSet, PerformanceAppraisalViewSet, ReferralCampaignViewSet, PerformanceReviewViewSet, EmployeeSkillViewSet
router.register(r'frontend-applicants', JobApplicantViewSet, basename='frontend-applicant')
router.register(r'frontend-appraisals', PerformanceAppraisalViewSet, basename='frontend-appraisal')
router.register(r'frontend-referrals', ReferralCampaignViewSet, basename='frontend-referral')
router.register(r'performance-reviews', PerformanceReviewViewSet, basename='performance-review')
router.register(r'employee-skills', EmployeeSkillViewSet, basename='employee-skill')

urlpatterns = [
    path('dashboard/', HrmDashboardView.as_view(), name='hrm-dashboard'),
    path('', include(router.urls))
]
