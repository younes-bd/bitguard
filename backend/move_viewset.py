import os

# 1. Add CurrencyViewSet to core/api/views.py
core_path = "apps/core/api/views.py"
with open(core_path, "r") as f:
    core_content = f.read()

new_viewset = """
class CurrencyViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    from apps.core.api.serializers import CurrencySerializer
    serializer_class = CurrencySerializer
    pagination_class = None
    def get_queryset(self): 
        from apps.core.domain.models import Currency
        tenant = getattr(self.request, 'tenant', None)
        return Currency.all_objects.filter(Q(tenant=tenant) | Q(tenant__isnull=True), is_deleted=False)
"""

if "class CurrencyViewSet" not in core_content:
    with open(core_path, "a") as f:
        f.write("\n" + new_viewset + "\n")

# 2. Remove CurrencyViewSet from accounting/api/views.py
acc_path = "apps/accounting/api/views.py"
with open(acc_path, "r") as f:
    acc_lines = f.readlines()

new_acc = []
skip = False
for line in acc_lines:
    if line.startswith("class CurrencyViewSet"):
        skip = True
    if skip and line.startswith("class ExchangeRateViewSet"):
        skip = False
    if not skip:
        new_acc.append(line)

with open(acc_path, "w") as f:
    f.writelines(new_acc)
