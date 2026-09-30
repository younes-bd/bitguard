import os

filepath = "/mnt/c/Users/youne/Desktop/2-InfoTech/website/website13/backend/apps/core/domain/mixins.py"
with open(filepath, 'r') as f:
    content = f.read()

old_code = """        if changes:
            from apps.core.services.system_event import SystemEventService
            from apps.core.middleware.http import get_current_request
            
            request = get_current_request()
            
            SystemEventService.log_action(
                request=request,
                action=action,
                resource=f"{self._meta.app_label}.{self._meta.model_name}:{self.pk}",
                payload={"changes": changes}
            )"""

new_code = """        if changes:
            from apps.core.middleware.http import get_current_request
            from django.contrib.contenttypes.models import ContentType
            from .models import FieldHistory
            
            request = get_current_request()
            user = getattr(request, 'user', None) if request else None
            if user and not user.is_authenticated:
                user = None
                
            ct = ContentType.objects.get_for_model(self)
            
            for field, vals in changes.items():
                if isinstance(vals, dict) and 'old' in vals and 'new' in vals:
                    FieldHistory.objects.create(
                        content_type=ct,
                        object_id=str(self.pk),
                        field_name=field,
                        old_value=str(vals['old']),
                        new_value=str(vals['new']),
                        changed_by=user,
                        tenant=getattr(self, 'tenant', None)
                    )
                else:
                    FieldHistory.objects.create(
                        content_type=ct,
                        object_id=str(self.pk),
                        field_name=field,
                        old_value='',
                        new_value=str(vals),
                        changed_by=user,
                        tenant=getattr(self, 'tenant', None)
                    )"""

content = content.replace(old_code, new_code)

with open(filepath, 'w') as f:
    f.write(content)
