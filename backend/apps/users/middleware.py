from django.utils import timezone
from .services import DeviceService
from datetime import timedelta

class DeviceTrackingMiddleware:
    """
    Middleware to track device usage for authenticated users on every request.
    Updates 'last_login' (last seen) timestamp for the device.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            # We want to track the device.
            # To avoid database writes on EVERY request (static files, polling),
            # we could add some throttling logic here if needed.
            # For now, we utilize the service which checks existence.
            device = DeviceService.track_device(request.user, request)
            
            # Optimization: Only update last_login if it was more than 5 minutes ago?
            # The service currently does:
            # if not created: device.last_login = now; save()
            # This means every request writes to DB.
            # We should probably optimize this in the SERVICE, not just middleware.
            pass

        response = self.get_response(request)
        return response
