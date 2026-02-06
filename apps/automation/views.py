from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import *
from .serializers import *

def workflows(request):
    return render(request, 'automation/workflows.html', {})

def workflow_detail(request):
    return render(request, 'automation/workflow_detail.html', {})

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Workflow
from .serializers import WorkflowSerializer

@api_view(['GET'])
def api(request):
    data = {}
    data['workflows'] = WorkflowSerializer(
        Workflow.objects.all(), many=True
    ).data
    return Response(data)