from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.core.api.mixins import TenantScopedMixin
from apps.core.api.permissions import IsPlatformAdmin
from apps.automation.domain.models import AutomatedAction
from apps.automation.api.serializers import AutomatedActionSerializer

class AutomatedActionViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = AutomatedAction.objects.all()
    serializer_class = AutomatedActionSerializer
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

    def get_queryset(self):
        tenant = getattr(self.request, 'tenant', None)
        return AutomatedAction.objects.filter(tenant=tenant)

    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request, 'tenant', None))

    @action(detail=True, methods=['post'])
    def run(self, request, pk=None):
        from django.apps import apps as django_apps
        from django.utils import timezone
        action_obj = self.get_object()
        action_obj.last_run = timezone.now()
        try:
            if action_obj.code:
                exec_globals = {'__builtins__': __builtins__}
                exec_locals = {'env': getattr(request, 'tenant', None) if hasattr(request.user, 'tenant') else None, 'request': request}
                exec(compile(action_obj.code, '<automated_action>', 'exec'), exec_globals, exec_locals)
                action_obj.last_run_status = 'success'
            elif hasattr(action_obj, 'model_name') and hasattr(action_obj, 'method_name') and action_obj.model_name and action_obj.method_name:
                try:
                    app_label, model_name_str = action_obj.model_name.split('.')
                    Model = django_apps.get_model(app_label, model_name_str)
                    method = getattr(Model, action_obj.method_name, None)
                    if method:
                        method(tenant=getattr(request, 'tenant', None) if hasattr(request.user, 'tenant') else None)
                        action_obj.last_run_status = 'success'
                    else:
                        action_obj.last_run_status = 'error'
                except Exception as exec_err:
                    action_obj.last_run_status = 'error'
                    action_obj.save()
                    return Response({'status': 'error', 'message': str(exec_err)}, status=400)
            else:
                action_obj.last_run_status = 'success'  # No-op action, mark as run
            action_obj.save()
            return Response({'status': 'success', 'message': 'Action executed successfully'})
        except Exception as e:
            action_obj.last_run_status = 'error'
            action_obj.save()
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f'AutomatedAction run error: {e}')
            return Response({'status': 'error', 'message': str(e)}, status=400)



from ..domain.models import WebhookEndpoint
from .serializers import WebhookEndpointSerializer

class WebhookEndpointViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = WebhookEndpoint.objects.all()
    serializer_class = WebhookEndpointSerializer
