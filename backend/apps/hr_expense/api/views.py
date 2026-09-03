from rest_framework import viewsets
from apps.core.api.mixins import TenantScopedMixin
from apps.hr_expense.domain.models import ExpenseReport
from apps.hr_expense.api.serializers import ExpenseReportSerializer

class ExpenseReportViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = ExpenseReport.objects.all()
    serializer_class = ExpenseReportSerializer

