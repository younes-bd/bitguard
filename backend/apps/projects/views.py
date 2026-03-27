from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import Project, Task, Milestone, TimeLog
from .serializers import (
    ProjectListSerializer, ProjectDetailSerializer,
    TaskSerializer, MilestoneSerializer, TimeLogSerializer
)


class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = getattr(self.request, 'tenant', None)
        qs = Project.objects.all().select_related('client', 'manager').prefetch_related('tasks', 'milestones')
        if tenant:
            qs = qs.filter(tenant=tenant)
        status = self.request.query_params.get('status')
        if status:
            qs = qs.filter(status=status)
        return qs

    def get_serializer_class(self):
        if self.action in ('retrieve', 'update', 'partial_update'):
            return ProjectDetailSerializer
        return ProjectListSerializer

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Summary stats for the PM dashboard KPIs."""
        tenant = getattr(request, 'tenant', None)
        qs = Project.objects.all()
        if tenant:
            qs = qs.filter(tenant=tenant)

        return Response({
            'total': qs.count(),
            'active': qs.filter(status='active').count(),
            'completed': qs.filter(status='completed').count(),
            'on_hold': qs.filter(status='on_hold').count(),
            'overdue': qs.filter(
                status__in=['planning', 'active'],
                deadline__lt=__import__('django.utils.timezone', fromlist=['timezone']).timezone.now().date()
            ).count(),
        })

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        project = self.get_object()
        new_status = request.data.get('status')
        if new_status not in dict(Project.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=400)
        project.status = new_status
        project.save(update_fields=['status'])
        return Response({'status': new_status})


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Task.objects.select_related('assignee', 'project').prefetch_related('time_logs')
        project_id = self.request.query_params.get('project')
        if project_id:
            qs = qs.filter(project_id=project_id)
        status = self.request.query_params.get('status')
        if status:
            qs = qs.filter(status=status)
        return qs

    @action(detail=True, methods=['patch'])
    def move(self, request, pk=None):
        """Move a task to a different Kanban column."""
        task = self.get_object()
        new_status = request.data.get('status')
        new_order = request.data.get('order', task.order)
        if new_status not in dict(Task.STAGE_CHOICES):
            return Response({'error': 'Invalid stage'}, status=400)
        task.status = new_status
        task.order = new_order
        task.save(update_fields=['status', 'order'])
        return Response(TaskSerializer(task).data)


class MilestoneViewSet(viewsets.ModelViewSet):
    serializer_class = MilestoneSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Milestone.objects.select_related('project')
        project_id = self.request.query_params.get('project')
        if project_id:
            qs = qs.filter(project_id=project_id)
        return qs

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        from django.utils import timezone
        milestone = self.get_object()
        milestone.is_completed = True
        milestone.completed_date = timezone.now().date()
        milestone.save(update_fields=['is_completed', 'completed_date'])
        return Response({'completed': True})


class TimeLogViewSet(viewsets.ModelViewSet):
    serializer_class = TimeLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = TimeLog.objects.select_related('user', 'task')
        task_id = self.request.query_params.get('task')
        if task_id:
            qs = qs.filter(task_id=task_id)
        project_id = self.request.query_params.get('project')
        if project_id:
            qs = qs.filter(task__project_id=project_id)
        return qs
