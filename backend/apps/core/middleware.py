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

        # 3. Check User Memberships Default (Fallback for Internal Org)
        if not tenant_domain and request.user.is_authenticated:
            from apps.users.models import TenantMembership
            membership = TenantMembership.objects.filter(user=request.user, is_active=True).first()
            if membership:
                request.tenant = membership.tenant
                _thread_locals.tenant = request.tenant
                print("TENANT RESOLVED FROM MEMBERSHIP:", request.tenant)
                return self.get_response(request)

        from apps.tenants.models import Tenant
        import uuid

        if tenant_domain:
            # Map legacy or default frontend tenant IDs to the seeded internal tenant domain
            if tenant_domain in ['0aff5946-c015-4cc6-9d06-416cdf204651', 'bitguard.tech', 'cfc72aac-52e3-44fb-847c-5041cbd1bda2']:
                tenant_domain = 'cfc72aac-52e3-44fb-847c-5041cbd1bda2'
                
            try:
                # Try to resolve by UUID first, or by domain if the UUID is stored in the domain field
                from django.db.models import Q
                try:
                    uuid_obj = uuid.UUID(tenant_domain)
                    request.tenant = Tenant.objects.get(Q(id=uuid_obj) | Q(domain=tenant_domain), is_active=True)
                except ValueError:
                    # Fallback to resolving by domain if it's not a UUID
                    request.tenant = Tenant.objects.get(domain=tenant_domain, is_active=True)
                    
                print("TENANT RESOLVED FROM DOMAIN/ID:", request.tenant)
                
                # Check User Access for requested Tenant
                if request.user.is_authenticated and not request.user.is_superuser:
                    from apps.users.models import TenantMembership
                    has_access = TenantMembership.objects.filter(user=request.user, tenant=request.tenant, is_active=True).exists()
                    
                    if not has_access and hasattr(request.user, 'employee_profile'):
                        if request.user.employee_profile.tenant_id == request.tenant.id:
                            has_access = True
                            
                    # For BitGuard Internal testing/demo
                    if str(request.tenant.id) in ['cfc72aac-52e3-44fb-847c-5041cbd1bda2', '0aff5946-c015-4cc6-9d06-416cdf204651']:
                        has_access = True
                        
                    if not has_access:
                        request.tenant = None
                        print("TENANT ACCESS DENIED FOR USER")
            except Tenant.DoesNotExist:
                request.tenant = None
                print("TENANT NOT FOUND FOR DOMAIN:", tenant_domain)
        else:
            request.tenant = None
            print("NO TENANT DOMAIN, FALLBACK TO NONE")

        _thread_locals.tenant = request.tenant

        return self.get_response(request)
