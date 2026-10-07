from rest_framework import viewsets
from apps.base.api.mixins import TenantScopedMixin
from apps.expenses.domain.models import ExpenseReport
from apps.expenses.api.serializers import ExpenseReportSerializer

class ExpenseReportViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = ExpenseReport.objects.all()
    serializer_class = ExpenseReportSerializer

