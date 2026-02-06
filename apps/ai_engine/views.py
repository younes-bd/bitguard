from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import AnalysisResult
from .serializers import AnalysisResultSerializer

def analysis(request):
    return render(request, 'ai_engine/analysis.html', {})

def reports(request):
    return render(request, 'ai_engine/reports.html', {})

@api_view(['GET'])
def api(request):
    data = {}
    data['analysis_results'] = AnalysisResultSerializer(
        AnalysisResult.objects.all(), many=True
    ).data
    return Response(data)