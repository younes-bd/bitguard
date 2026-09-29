from apps.accounting.domain.models import Currency
print('Total Currencies:', Currency.objects.count())
for c in Currency.objects.all()[:5]:
    print('Currency:', c.name, 'Tenant:', getattr(c, 'tenant_id', None))
