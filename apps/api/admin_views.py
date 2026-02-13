from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.apps import apps
from django.shortcuts import get_object_or_404
from django.db import models

class AdminMetadataView(APIView):
    """
    Returns a list of all installed apps and their models.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Initialize with debug data to verify frontend-backend connection
        data = {
            "System Check": [
                {"name": "DebugModel", "verbose_name": "Connection OK", "app_label": "debug"}
            ]
        }
        for app_config in apps.get_app_configs():
            # Filter out some internal Django apps if desired, or keep all
            # He wants "like Jazzmin", so keep most.
            # Maybe skip 'django.contrib.admin' etc to avoid confusion?
            # Let's keep simpler logic: return all that have models.
            app_models = []
            for model in app_config.get_models():
                app_models.append({
                    'name': model.__name__,
                    'verbose_name': str(model._meta.verbose_name_plural.title()),
                    'app_label': app_config.label
                })
            
            if app_models:
                data[str(app_config.verbose_name)] = app_models
        
        return Response(data)

from apps.core.services.audit import AuditService

class AdminModelView(APIView):
    """
    Generic CRUD for any model with mandatory system auditing.
    Charter Compliance: Section 11 (Auditability).
    """
    permission_classes = [IsAdminUser]

    def get_model(self, app_label, model_name):
        try:
            return apps.get_model(app_label, model_name)
        except LookupError:
            return None

    def get(self, request, app_label, model_name, pk=None):
        model = self.get_model(app_label, model_name)
        if not model:
            return Response({'error': 'Model not found'}, status=404)

        if pk:
            obj = get_object_or_404(model, pk=pk)
            # Simple serialization
            data = {f.name: getattr(obj, f.name) for f in model._meta.fields}
            return Response(data)

        # Pagination logic could be added here
        queryset = model.objects.all().order_by('-pk')[:100]
        data = list(queryset.values())
        
        return Response({
            'model': model.__name__,
            'count': model.objects.count(),
            'data': data,
            'fields': [f.name for f in model._meta.fields] 
        })

    def post(self, request, app_label, model_name):
        model = self.get_model(app_label, model_name)
        if not model:
            return Response({'error': 'Model not found'}, status=404)

        from apps.core.services.control import ControlService
        if not ControlService.enforce_policy(request.user, "CREATE", f"{app_label}.{model_name}"):
            return Response({'error': 'Policy violation'}, status=403)

        obj = model.objects.create(**request.data)
        
        AuditService.log(
            request,
            action="ADMIN_CREATE",
            resource=f"{app_label}.{model_name}:{obj.pk}",
            payload=request.data
        )
        
        return Response({'status': 'created', 'id': obj.pk}, status=201)

    def patch(self, request, app_label, model_name, pk):
        model = self.get_model(app_label, model_name)
        if not model:
            return Response({'error': 'Model not found'}, status=404)

        from apps.core.services.control import ControlService
        if not ControlService.enforce_policy(request.user, "UPDATE", f"{app_label}.{model_name}:{pk}"):
            return Response({'error': 'Policy violation'}, status=403)
            
        obj = get_object_or_404(model, pk=pk)
        for attr, value in request.data.items():
            setattr(obj, attr, value)
        obj.save()

        AuditService.log(
            request,
            action="ADMIN_UPDATE",
            resource=f"{app_label}.{model_name}:{obj.pk}",
            payload=request.data
        )
        
        return Response({'status': 'updated'})

    def delete(self, request, app_label, model_name, pk):
        model = self.get_model(app_label, model_name)
        if not model:
            return Response({'error': 'Model not found'}, status=404)

        from apps.core.services.control import ControlService
        if not ControlService.enforce_policy(request.user, "DELETE", f"{app_label}.{model_name}:{pk}"):
            return Response({'error': 'Policy violation'}, status=403)
            
        obj = get_object_or_404(model, pk=pk)
        resource_ref = f"{app_label}.{model_name}:{obj.pk}"
        
        obj.delete()

        AuditService.log(
            request,
            action="ADMIN_DELETE",
            resource=resource_ref,
            payload={"deleted_pk": pk}
        )
        
        return Response({'status': 'deleted'})

class AuditLogView(APIView):
    """
    Dedicated view for reviewing system audit logs.
    Charter Compliance: Section 11 (Auditability).
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        from apps.core.models import AuditLog
        
        # Pagination and filtering
        queryset = AuditLog.objects.all().order_by('-timestamp')[:200]
        
        data = []
        for log in queryset:
            data.append({
                'id': log.id,
                'timestamp': log.timestamp,
                'user': log.user.username if log.user else 'System',
                'tenant': log.tenant.name if log.tenant else 'Global',
                'action': log.action,
                'resource': log.resource,
                'payload': log.payload,
                'ip_address': log.ip_address
            })
            
        return Response(data)

class SystemHealthView(APIView):
    """
    Command Center Health (Section 19).
    Exposes workflow states and pending obligations.
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        from apps.core.services.control import ControlService
        health_data = ControlService.get_system_health()
        return Response(health_data)
