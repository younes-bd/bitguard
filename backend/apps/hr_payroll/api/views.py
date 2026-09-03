from rest_framework import viewsets
from apps.core.api.mixins import TenantScopedMixin
from apps.hr_payroll.domain.models import PayrollPeriod, PayrollStructure, SalaryRule, PayslipBatch, Payslip, PayslipLine
from apps.hr_payroll.api.serializers import PayrollPeriodSerializer, PayrollStructureSerializer, SalaryRuleSerializer, PayslipBatchSerializer, PayslipSerializer, PayslipLineSerializer

class PayrollPeriodViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = PayrollPeriod.objects.all()
    serializer_class = PayrollPeriodSerializer

class PayrollStructureViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = PayrollStructure.objects.all()
    serializer_class = PayrollStructureSerializer

class SalaryRuleViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = SalaryRule.objects.all()
    serializer_class = SalaryRuleSerializer

class PayslipBatchViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = PayslipBatch.objects.all()
    serializer_class = PayslipBatchSerializer

class PayslipViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = Payslip.objects.all()
    serializer_class = PayslipSerializer

class PayslipLineViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = PayslipLine.objects.all()
    serializer_class = PayslipLineSerializer

