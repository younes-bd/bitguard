from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DepartmentViewSet, EmployeeViewSet, LeaveRequestViewSet, CertificationViewSet, TimeEntryViewSet, HrmDashboardView,
    PayrollPeriodViewSet, PayrollRecordViewSet, OnboardingInstanceViewSet, OnboardingTaskViewSet
)

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'leave-requests', LeaveRequestViewSet, basename='leave-request')
router.register(r'certifications', CertificationViewSet, basename='certification')
router.register(r'time-entries', TimeEntryViewSet, basename='time-entry')
router.register(r'payroll-periods', PayrollPeriodViewSet, basename='payroll-period')
router.register(r'payroll-records', PayrollRecordViewSet, basename='payroll-record')
router.register(r'onboarding', OnboardingInstanceViewSet, basename='onboarding')
router.register(r'onboarding-tasks', OnboardingTaskViewSet, basename='onboarding-task')

urlpatterns = [
    path('dashboard/', HrmDashboardView.as_view(), name='hrm-dashboard'),
    path('', include(router.urls))
]
