"""
Comprehensive ERP multi-tenant mixin verification.
Tests that:
  1. Superuser can see ALL records across all tenants via the API
  2. Regular tenant users are restricted to their own tenant's records
  3. The ScheduledActionViewSet specifically works end-to-end
"""
from django.core.management.base import BaseCommand
from django.test import RequestFactory
from django.contrib.auth.models import AnonymousUser
from rest_framework.request import Request
from rest_framework_simplejwt.tokens import RefreshToken
from apps.core.api.mixins import TenantScopedMixin


class Command(BaseCommand):
    help = 'Verify TenantScopedMixin and ScheduledActionViewSet are ERP-aligned'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.MIGRATE_HEADING('\n' + '='*60))
        self.stdout.write(self.style.MIGRATE_HEADING('  ERP TENANT SCOPING VERIFICATION'))
        self.stdout.write(self.style.MIGRATE_HEADING('='*60 + '\n'))

        from apps.users.domain.models import User
        from apps.core.domain.models import ScheduledAction
        from apps.system.api.views import ScheduledActionViewSet

        # ─── 1. Check mixin code ────────────────────────────────────────
        self.stdout.write(self.style.MIGRATE_LABEL('[ STEP 1 ] Verifying TenantScopedMixin logic...'))
        import inspect
        src = inspect.getsource(TenantScopedMixin.get_queryset)
        if 'is_superuser' in src:
            self.stdout.write(self.style.SUCCESS('  ✓ Mixin contains superuser bypass logic'))
        else:
            self.stdout.write(self.style.ERROR('  ✗ Mixin is MISSING superuser bypass!'))

        if 'qs.none()' in src:
            self.stdout.write(self.style.SUCCESS('  ✓ Mixin still enforces qs.none() for unauthenticated/no-tenant users'))
        else:
            self.stdout.write(self.style.WARNING('  ! qs.none() fallback not found (review mixin)'))

        # ─── 2. Check ScheduledActionViewSet uses the mixin ────────────
        self.stdout.write(self.style.MIGRATE_LABEL('\n[ STEP 2 ] Checking ScheduledActionViewSet inheritance...'))
        bases = [cls.__name__ for cls in ScheduledActionViewSet.__mro__]
        if 'TenantScopedMixin' in bases:
            self.stdout.write(self.style.SUCCESS('  ✓ ScheduledActionViewSet correctly inherits TenantScopedMixin'))
        else:
            self.stdout.write(self.style.ERROR('  ✗ ScheduledActionViewSet does NOT use TenantScopedMixin!'))

        # ─── 3. Live DB counts ─────────────────────────────────────────
        self.stdout.write(self.style.MIGRATE_LABEL('\n[ STEP 3 ] Checking live DB record counts...'))
        total_actions = ScheduledAction.objects.count()
        self.stdout.write(f'  Total ScheduledAction records in DB: {total_actions}')

        from apps.tenants.domain.models import Tenant
        tenant_count = Tenant.objects.count()
        self.stdout.write(f'  Total Tenants in DB: {tenant_count}')

        for t in Tenant.objects.all():
            count = ScheduledAction.objects.filter(tenant=t).count()
            self.stdout.write(f'    Tenant [{t.name}]: {count} scheduled actions')

        unscoped = ScheduledAction.objects.filter(tenant__isnull=True).count()
        if unscoped:
            self.stdout.write(self.style.WARNING(f'  ! {unscoped} ScheduledAction record(s) have no tenant assigned'))

        # ─── 4. Simulate superuser GET via DRF request ─────────────────
        self.stdout.write(self.style.MIGRATE_LABEL('\n[ STEP 4 ] Simulating superuser API request to GET /scheduled-actions/...'))
        superuser = User.objects.filter(is_superuser=True).first()
        if not superuser:
            self.stdout.write(self.style.ERROR('  ✗ No superuser found in DB!'))
            return

        self.stdout.write(f'  Using superuser: {superuser.email}')

        factory = RequestFactory()
        raw_request = factory.get('/api/v1/system/scheduled-actions/')
        raw_request.user = superuser
        raw_request.tenant = None  # Simulate no tenant on request (typical for superusers)

        drf_request = Request(raw_request)
        drf_request.user = superuser

        viewset = ScheduledActionViewSet()
        viewset.request = drf_request
        viewset.format_kwarg = None
        viewset.kwargs = {}
        viewset.action = 'list'

        qs = viewset.get_queryset()
        count = qs.count()

        if count == total_actions:
            self.stdout.write(self.style.SUCCESS(
                f'  ✓ Superuser sees ALL {count}/{total_actions} records (tenant isolation bypassed correctly)'
            ))
        else:
            self.stdout.write(self.style.ERROR(
                f'  ✗ Superuser sees only {count}/{total_actions} records — mixin is still broken!'
            ))

        # ─── 5. Simulate a regular tenant user ─────────────────────────
        self.stdout.write(self.style.MIGRATE_LABEL('\n[ STEP 5 ] Simulating regular (non-superuser) tenant user...'))
        regular_user = User.objects.filter(is_superuser=False, is_active=True).first()
        if regular_user:
            self.stdout.write(f'  Using regular user: {regular_user.email}')
            tenant = getattr(regular_user, 'tenant', None)
            self.stdout.write(f'  User tenant: {tenant}')

            raw_request2 = factory.get('/api/v1/system/scheduled-actions/')
            raw_request2.user = regular_user
            raw_request2.tenant = tenant

            drf_request2 = Request(raw_request2)
            drf_request2.user = regular_user

            viewset2 = ScheduledActionViewSet()
            viewset2.request = drf_request2
            viewset2.format_kwarg = None
            viewset2.kwargs = {}
            viewset2.action = 'list'

            qs2 = viewset2.get_queryset()
            count2 = qs2.count()
            expected = ScheduledAction.objects.filter(tenant=tenant).count() if tenant else 0

            if tenant and count2 == expected:
                self.stdout.write(self.style.SUCCESS(
                    f'  ✓ Regular user sees ONLY {count2}/{total_actions} records (their own tenant)'
                ))
            elif not tenant:
                self.stdout.write(self.style.WARNING(
                    f'  ! Regular user has no tenant assigned — sees {count2} records (qs.none() fallback)'
                ))
            else:
                self.stdout.write(self.style.ERROR(
                    f'  ✗ Regular user sees {count2} but expected {expected}'
                ))
        else:
            self.stdout.write(self.style.WARNING('  ! No non-superuser found to test with'))

        # ─── 6. Check broader affected ViewSets ────────────────────────
        self.stdout.write(self.style.MIGRATE_LABEL('\n[ STEP 6 ] Spot-checking other ViewSets that use TenantScopedMixin...'))
        spot_checks = [
            ('apps.accounting.api.views', 'InvoiceViewSet'),
            ('apps.system.api.views', 'SystemSettingViewSet'),
            ('apps.system.api.views', 'AuditTrailViewSet'),
            ('apps.system.api.views', 'LanguageViewSet'),
            ('apps.system.api.views', 'WebhookEndpointViewSet'),
        ]
        for module_path, class_name in spot_checks:
            try:
                import importlib
                mod = importlib.import_module(module_path)
                cls = getattr(mod, class_name)
                bases = [c.__name__ for c in cls.__mro__]
                if 'TenantScopedMixin' in bases:
                    self.stdout.write(self.style.SUCCESS(f'  ✓ {class_name} → uses TenantScopedMixin (will benefit from fix)'))
                else:
                    self.stdout.write(self.style.WARNING(f'  ! {class_name} → does NOT use TenantScopedMixin (manual scoping)'))
            except Exception as e:
                self.stdout.write(self.style.WARNING(f'  ! {class_name} → could not import: {e}'))

        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS('  VERIFICATION COMPLETE'))
        self.stdout.write('='*60 + '\n')
