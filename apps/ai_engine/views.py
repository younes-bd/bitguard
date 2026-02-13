from rest_framework import viewsets, permissions
from .models import AnalysisResult
from .serializers import AnalysisResultSerializer

class AnalysisResultViewSet(viewsets.ModelViewSet):
    queryset = AnalysisResult.objects.all().order_by('-created_at')
    serializer_class = AnalysisResultSerializer
    permission_classes = [permissions.IsAuthenticated]