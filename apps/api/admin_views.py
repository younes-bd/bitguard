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

class AdminModelView(APIView):
    """
    Generic CRUD for any model.
    """
    permission_classes = [IsAdminUser]

    def get_model(self, app_label, model_name):
        try:
            return apps.get_model(app_label, model_name)
        except LookupError:
            return None

    def get(self, request, app_label, model_name):
        model = self.get_model(app_label, model_name)
        if not model:
            return Response({'error': 'Model not found'}, status=404)

        # Pagination logic could be added here
        # For now, return top 100
        objects = model.objects.all()[:100]
        
        # Serialize simply using values()
        # We need to handle non-serializable fields (like relations or datetimes)
        # .values() handles most, but relations are just IDs. That's fine for "Review".
        data = list(objects.values())
        
        # Add 'id' if not present (usually generic views need specific ID)
        # .values() includes 'id' or pk_field usually.
        
        return Response({
            'model': model.__name__,
            'count': model.objects.count(),
            'data': data,
            # Start metadata about fields for the table headers
            'fields': [f.name for f in model._meta.fields] 
        })

    def delete(self, request, app_label, model_name, pk):
        model = self.get_model(app_label, model_name)
        if not model:
            return Response({'error': 'Model not found'}, status=404)
            
        obj = get_object_or_404(model, pk=pk)
        obj.delete()
        return Response({'status': 'deleted'})
