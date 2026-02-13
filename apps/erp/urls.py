from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet, TaskViewSet, KPIViewSet, AssetViewSet,
    ServiceViewSet, MilestoneViewSet, EmployeeProfileViewSet, TimeLogViewSet,
    VendorViewSet, VendorContractViewSet, InvoiceViewSet, ExpenseViewSet,
    VendorBillViewSet, RiskViewSet, ComplianceItemViewSet, PolicyViewSet, IntegrationViewSet,
    ERPDashboardStatsView
)

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'kpis', KPIViewSet)
router.register(r'assets', AssetViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'milestones', MilestoneViewSet)
router.register(r'workforce', EmployeeProfileViewSet)
router.register(r'timelogs', TimeLogViewSet)
router.register(r'vendors', VendorViewSet)
router.register(r'vendor-contracts', VendorContractViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'expenses', ExpenseViewSet)
router.register(r'vendor-bills', VendorBillViewSet)
router.register(r'risks', RiskViewSet)
router.register(r'compliance-items', ComplianceItemViewSet)
router.register(r'policies', PolicyViewSet)
router.register(r'integrations', IntegrationViewSet)

urlpatterns = [
    path('dashboard-stats/', ERPDashboardStatsView.as_view(), name='erp-dashboard-stats'),
    path('', include(router.urls)),
]