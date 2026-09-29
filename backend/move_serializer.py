import os

# 1. Add CurrencySerializer to core/api/serializers.py
core_path = "apps/core/api/serializers.py"
with open(core_path, "r") as f:
    core_content = f.read()

new_serializer = """
class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        from apps.core.domain.models import Currency
        model = Currency
        fields = ['id', 'code', 'name', 'symbol', 'is_base']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
"""

if "class CurrencySerializer" not in core_content:
    with open(core_path, "a") as f:
        f.write("\n" + new_serializer + "\n")

# 2. Remove CurrencySerializer from accounting/api/serializers.py
acc_path = "apps/accounting/api/serializers.py"
with open(acc_path, "r") as f:
    acc_lines = f.readlines()

new_acc = []
skip = False
for line in acc_lines:
    if line.startswith("class CurrencySerializer"):
        skip = True
    if skip and line.startswith("class ExchangeRateSerializer"):
        skip = False
    if not skip:
        new_acc.append(line)

with open(acc_path, "w") as f:
    f.writelines(new_acc)
