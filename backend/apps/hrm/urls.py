from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, EmployeeViewSet, LeaveRequestViewSet, CertificationViewSet, TimeEntryViewSet

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'leave-requests', LeaveRequestViewSet, basename='leave-request')
router.register(r'certifications', CertificationViewSet, basename='certification')
router.register(r'time-entries', TimeEntryViewSet, basename='time-entry')

urlpatterns = [path('', include(router.urls))]
