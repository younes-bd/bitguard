from .models import ManagedEndpoint, SoftwareLicense

class ITAMService:
    @staticmethod
    def provision_endpoint(data):
        """Engages lifecycle onboarding for a raw hardware node inside the Asset tracking boundary."""
        endpoint = ManagedEndpoint.objects.create(
            hostname=data.get('hostname'),
            asset_tag=data.get('asset_tag'),
            status='provisioning',
            hardware_specs=data.get('specs', {})
        )
        return endpoint
        
    @staticmethod
    def assign_license(license_obj, user=None, endpoint=None):
        """Strict allocation tracking mitigating over-provisioning software limits against active capacity thresholds."""
        if license_obj.used_seats >= license_obj.total_seats:
            raise Exception("No available seats left on this license")
            
        license_obj.used_seats += 1
        license_obj.save()
        return license_obj
