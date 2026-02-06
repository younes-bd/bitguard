from django.urls import path
from . import views

urlpatterns = [
    path('workflows/', views.workflows, name='automation_workflows'),
    path('workflow_detail/', views.workflow_detail, name='automation_workflow_detail'),
    path('api/', views.api, name='{name}_api'),
]