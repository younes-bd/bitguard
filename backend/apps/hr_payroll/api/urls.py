from rest_framework.routers import DefaultRouter
from apps.hr_payroll.api.views import PayrollPeriodViewSet, PayrollStructureViewSet, SalaryRuleViewSet, PayslipBatchViewSet, PayslipViewSet, PayslipLineViewSet

router = DefaultRouter()
router.register(r'payroll-periods', PayrollPeriodViewSet)
router.register(r'payroll-structures', PayrollStructureViewSet)
router.register(r'salary-rules', SalaryRuleViewSet)
router.register(r'payslip-batchs', PayslipBatchViewSet)
router.register(r'payslips', PayslipViewSet)
router.register(r'payslip-lines', PayslipLineViewSet)

urlpatterns = router.urls
