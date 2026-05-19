import time
import logging
import threading

_thread_locals = threading.local()

def get_current_tenant():
    return getattr(_thread_locals, 'tenant', None)

from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse

logger = logging.getLogger(__name__)

class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        
        response = self.get_response(request)
        
        duration = time.time() - start_time
        user = getattr(request.user, 'username', 'Anonymous') if hasattr(request, 'user') and request.user.is_authenticated else 'Anonymous'
        
        tenant_obj = getattr(request, 'tenant', None)
        tenant_name = tenant_obj.name if tenant_obj else 'None'
            
        logger.info(
            f"Method: {request.method} | Path: {request.path} | "
            f"User: {user} | Tenant: {tenant_name} | "
            f"Status: {response.status_code} | Duration: {duration:.3f}s | "
            f"IP: {self.get_client_ip(request)}"
        )
        return response

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')

class TenantMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # 1. Check Header (API Priority)
        tenant_domain = request.headers.get('X-Tenant-ID')
        
        # 2. Check Subdomain (Web Priority)
        if not tenant_domain:
            host = request.get_host().split(':')[0]
            parts = host.split('.')
            if len(parts) > 2: # e.g. tenant.bitguard.com
                tenant_domain = parts[0]

        # 3. Check User Profile Default (Fallback for Internal Org)
        if not tenant_domain and request.user.is_authenticated:
            if hasattr(request.user, 'employee_profile') and request.user.employee_profile.tenant:
                request.tenant = request.user.employee_profile.tenant
                _thread_locals.tenant = request.tenant
                return self.get_response(request)

        from apps.tenants.models import Tenant

        if tenant_domain:
            try:
                request.tenant = Tenant.objects.get(domain=tenant_domain, is_active=True)
            except Tenant.DoesNotExist:
                request.tenant = None
        else:
            request.tenant = None

        _thread_locals.tenant = request.tenant

        return self.get_response(request)
