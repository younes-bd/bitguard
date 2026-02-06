from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from apps.tenants.models import Tenant

class TenantMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # 1. Check Header
        tenant_slug = request.headers.get('X-Tenant-ID')
        
        # 2. Check Subdomain (simplified)
        if not tenant_slug:
            host = request.get_host().split(':')[0]
            parts = host.split('.')
            if len(parts) > 2: # e.g. tenant.bitguard.com
                tenant_slug = parts[0]

        if tenant_slug:
            try:
                request.tenant = Tenant.objects.get(slug=tenant_slug, is_active=True)
            except Tenant.DoesNotExist:
                # If specifically requested but not found -> Public context (None)
                request.tenant = None
                # previously returned 404, now allows global API access
        else:
            # No tenant context (Public/Platform admin or Fallback)
            request.tenant = None

        return self.get_response(request)
