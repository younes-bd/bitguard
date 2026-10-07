from apps.base.domain.models import SystemParameter
from rest_framework.exceptions import ValidationError

class SystemParametersService:
    """
    Tier-1 ERP Service for global system configurations.
    """
    @staticmethod
    def get_param(tenant, key, default=None):
        try:
            param = SystemParameter.objects.get(tenant=tenant, key=key)
            return param.value
        except SystemParameter.DoesNotExist:
            return default
            
    @staticmethod
    def set_param(tenant, key, value, description="", is_system=False):
        param, created = SystemParameter.objects.update_or_create(
            tenant=tenant, key=key,
            defaults={'value': value, 'description': description, 'is_system': is_system}
        )
        return param

    @staticmethod
    def delete_param(instance):
        if instance.is_system:
            raise ValidationError("Cannot delete a system-required parameter.")
        instance.delete()
