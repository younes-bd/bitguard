import pycountry
from django.core.management.base import BaseCommand
from apps.core.domain.models import Country, State
from apps.core.domain.models import Currency

class Command(BaseCommand):
    help = 'Seeds complete ISO master data (Countries, Currencies) to Tier-1 ERP standards.'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding ISO 4217 Currencies (Global)...")
        currency_count = 0
        for c in pycountry.currencies:
            Currency.objects.get_or_create(
                code=c.alpha_3[:3],
                tenant=None,
                defaults={
                    'name': c.name[:50],
                    'symbol': getattr(c, 'alpha_3', c.alpha_3)[:5]
                }
            )
            currency_count += 1
            
        self.stdout.write("Seeding ISO 3166-1 Countries (Global)...")
        country_count = 0
        for c in pycountry.countries:
            c_name = getattr(c, 'common_name', getattr(c, 'name', ''))
            Country.objects.get_or_create(
                code=c.alpha_2[:2],
                tenant=None,
                defaults={'name': c_name[:100], 'phone_code': ''}
            )
            country_count += 1
            
        # Optional: Seed ISO 3166-2 States/Subdivisions (can be very slow, limit to US/CA for demo if preferred, or seed all)
        # Seed all states:
        self.stdout.write("Seeding ISO 3166-2 Subdivisions/States (Global)...")
        state_count = 0
        for sub in pycountry.subdivisions:
            country_code = sub.country_code[:2]
            country = Country.all_objects.filter(code=country_code, tenant=None).first()
            if country:
                code_val = sub.code.split('-')[1] if '-' in sub.code else sub.code
                State.objects.get_or_create(
                    code=code_val[:10],
                    country=country,
                    tenant=None,
                    defaults={'name': sub.name[:100]}
                )
                state_count += 1

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {country_count} Countries, {state_count} States, and {currency_count} Currencies!"))
