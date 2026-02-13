from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from apps.tenants.models import Tenant

class TenantMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # 1. Check Header (API Priority)
        tenant_slug = request.headers.get('X-Tenant-ID')
        
        # 2. Check Subdomain (Web Priority)
        if not tenant_slug:
            host = request.get_host().split(':')[0]
            parts = host.split('.')
            if len(parts) > 2: # e.g. tenant.bitguard.com
                tenant_slug = parts[0]

        # 3. Check User Profile Default (Fallback for Internal Org)
        if not tenant_slug and request.user.is_authenticated:
            if hasattr(request.user, 'employee_profile') and request.user.employee_profile.tenant:
                request.tenant = request.user.employee_profile.tenant
                return self.get_response(request)

        if tenant_slug:
            try:
                request.tenant = Tenant.objects.get(slug=tenant_slug, is_active=True)
            except Tenant.DoesNotExist:
                request.tenant = None
        else:
            request.tenant = None

        return self.get_response(request)
