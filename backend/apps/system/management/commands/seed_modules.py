from django.core.management.base import BaseCommand
from apps.system.domain.models import InstalledModule
from apps.tenants.domain.models import Tenant

FRONTEND_MODULES = [
    {
        'technical_name': 'calendar',
        'name': 'Calendar',
        'application': False,
        'depends': ['system'],
        'is_installed': True,
        'icon': 'Calendar',
    },
    {
        'technical_name': 'knowledge',
        'name': 'Knowledge',
        'application': False,
        'depends': ['system'],
        'is_installed': True,
        'icon': 'BookOpen',
    },
    {
        'technical_name': 'whatsapp',
        'name': 'WhatsApp',
        'application': False,
        'depends': ['discuss'],
        'is_installed': True,
        'icon': 'PhoneCall',
    },
    {
        'technical_name': 'livechat',
        'name': 'Live Chat',
        'application': False,
        'depends': ['discuss'],
        'is_installed': True,
        'icon': 'MessageCircle',
    },
    {
        'technical_name': 'timesheets',
        'name': 'Timesheets',
        'application': False,
        'depends': ['projects'],
        'is_installed': True,
        'icon': 'Clock',
    },
    {
        'technical_name': 'sms',
        'name': 'SMS Marketing',
        'application': False,
        'depends': ['marketing'],
        'is_installed': True,
        'icon': 'Smartphone',
    },
    {
        'technical_name': 'mass_mailing',
        'name': 'Email Marketing',
        'application': False,
        'depends': ['marketing'],
        'is_installed': True,
        'icon': 'Mail',
    }
]

class Command(BaseCommand):
    help = 'Seeds frontend-only modules in the registry for all tenants'

    def handle(self, *args, **kwargs):
        tenants = Tenant.objects.all()
        created_count = 0
        updated_count = 0

        for tenant in tenants:
            for mod_data in FRONTEND_MODULES:
                obj, created = InstalledModule.objects.update_or_create(
                    tenant=tenant,
                    technical_name=mod_data['technical_name'],
                    defaults={
                        'name': mod_data['name'],
                        'application': mod_data['application'],
                        'depends': mod_data['depends'],
                        'is_installed': mod_data['is_installed'],
                        'icon': mod_data['icon'],
                        'installable': True
                    }
                )
                if created:
                    created_count += 1
                else:
                    updated_count += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {created_count} new modules and updated {updated_count} existing ones across {tenants.count()} tenants.'))
