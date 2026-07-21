from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from ..domain.models import Project, Task, Milestone, TimeLog, Sprint, TaskTag
from ..api.serializers import (
    ProjectListSerializer, ProjectDetailSerializer,
    TaskSerializer, MilestoneSerializer, TimeLogSerializer,
    SprintSerializer, TaskTagSerializer
)

class SprintViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SprintSerializer
    def get_queryset(self):
        return Sprint.objects.filter(tenant=self.request.user.tenant)

class TaskTagViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TaskTagSerializer
    def get_queryset(self):
        return TaskTag.objects.filter(tenant=self.request.user.tenant)


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
                deadline__lt=__import__('django.utils.timezone', fromlist=['now']).now().date()
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
        return Response({'status': project.status})

    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        project = self.get_object()
        members = project.team_members.all()
        return Response([{
            'id': m.id,
            'email': m.email,
            'username': m.username,
            'full_name': f"{m.first_name} {m.last_name}".strip() or m.username,
            'role': 'Member'
        } for m in members])

    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'User ID required'}, status=400)
        project.team_members.add(user_id)
        return Response({'status': 'Member added'})

    @action(detail=True, methods=['post'])
    def remove_member(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'User ID required'}, status=400)
        project.team_members.remove(user_id)
        return Response({'status': 'Member removed'})

    @action(detail=True, methods=['get'])
    def gantt_data(self, request, pk=None):
        project = self.get_object()
        tasks = project.tasks.all()
        return Response({'status': 'success', 'data': [{'task': t.title, 'start': t.created_at, 'end': t.due_date} for t in tasks]})

    @action(detail=True, methods=['get'])
    def burndown(self, request, pk=None):
        project = self.get_object()
        return Response({'status': 'success', 'data': []})

    @action(detail=True, methods=['get'])
    def budget_tracking(self, request, pk=None):
        project = self.get_object()
        return Response({'status': 'success', 'budget': project.budget, 'spent': 0})


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

    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        task = self.get_object()
        content = request.data.get('content')
        return Response({'status': 'comment_added', 'content': content})


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

    @action(detail=True, methods=['post'])
    def bill(self, request, pk=None):
        from apps.accounting.domain.models import Invoice, InvoiceLine
        from django.utils import timezone
        
        log = self.get_object()
        if log.billed:
            return Response({'error': 'Time log is already billed.'}, status=400)
            
        project = log.task.project
        # Find or create draft invoice for this project/client
        invoice = Invoice.objects.filter(
            tenant=log.tenant, reference=f"PROJECT-{project.id}", status='draft'
        ).first() or Invoice.objects.create(
            tenant=log.tenant, client=project.client, status='draft',
            issue_date=timezone.now().date(), reference=f"PROJECT-{project.id}",
            created_by=request.user
        )
        InvoiceLine.objects.create(
            tenant=log.tenant, invoice=invoice, description=f"[{project.name}] {log.description}",
            quantity=log.hours, unit_price=project.hourly_rate or 0,
            subtotal=(log.hours * (project.hourly_rate or 0))
        )
        log.billed = True
        log.save()
        return Response({'invoice_id': invoice.id})

from ..domain.models import TaskTimesheet
from .serializers import TaskTimesheetSerializer

class TaskTimesheetViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TaskTimesheetSerializer
    def get_queryset(self): return TaskTimesheet.objects.filter(tenant=self.request.user.tenant) if hasattr(self.request.user, 'tenant') else TaskTimesheet.objects.all()
