from django.http import HttpResponseForbidden
from django.core.cache import cache
import logging

logger = logging.getLogger(__name__)

class IPBlacklistMiddleware:
    """
    Tier-1 Security Middleware.
    Blocks incoming requests from known malicious IP addresses.
    Future implementation: Query a 'SecurityPolicy' or 'BlacklistedIP' database model,
    or read from Redis cache for ultra-fast validation.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        client_ip = self.get_client_ip(request)
        
        # BASIC IMPLEMENTATION: Hardcoded blacklisted IPs (for demonstration)
        # In Phase 6/7, this should query the database or Redis cache.
        blacklisted_ips = [
            '192.168.1.100', # Example malicious IP
            '10.0.0.99',     # Example malicious IP
        ]
        
        if client_ip in blacklisted_ips:
            logger.warning(f"SECURITY: Blocked request from blacklisted IP: {client_ip}")
            return HttpResponseForbidden("Your IP address has been blacklisted due to security violations.")

        return self.get_response(request)

    def get_client_ip(self, request):
        """Extract the real IP address, accounting for load balancers/proxies."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR')
