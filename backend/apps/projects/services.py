from django.db import transaction
from django.utils import timezone
from apps.core.services.base import BaseService
from apps.core.services.audit import AuditService
from .models import Project, Task, Milestone

class ProjectService(BaseService):
    """
    Dedicated Project Management service layer.
    Charter §16: Projects are delivery obligations.
    """

    @classmethod
    @transaction.atomic
    def initialize_project(cls, request, client, name, manager=None) -> Project:
        """
        Scaffolds a holistic project envelope.
        """
        tenant = cls.get_tenant_context(request)
        project = Project.objects.create(
            tenant=tenant,
            client=client,
            name=name,
            manager=manager or request.user,
            status='planning'
        )
        
        AuditService.log_action(
            request,
            action="PM_PROJECT_INITIALIZED",
            resource=f"projects.Project:{project.pk}",
            payload={"name": name, "client_id": str(client.id) if client else None}
        )
        return project

    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(Project.objects.all(), request)

    @classmethod
    @transaction.atomic
    def update_task_status(cls, request, task: Task, new_status: str) -> Task:
        """
        Updates task status with validation and audit.
        """
        cls.validate_ownership(task, request)
        old_status = task.status
        task.status = new_status
        task.save(update_fields=['status'])
        
        # Trigger progress re-computation
        cls.compute_progress(task.project)
        
        AuditService.log_action(
            request,
            action="PM_TASK_STATUS_UPDATED",
            resource=f"projects.Task:{task.pk}",
            payload={"old": old_status, "new": new_status}
        )
        return task

    @classmethod
    @transaction.atomic
    def assign_resource(cls, request, project: Project, user) -> Project:
        """
        Assigns a user to the project team.
        """
        cls.validate_ownership(project, request)
        project.team_members.add(user)
        
        AuditService.log_action(
            request,
            action="PM_RESOURCE_ASSIGNED",
            resource=f"projects.Project:{project.pk}",
            payload={"user_id": str(user.id), "username": user.username}
        )
        return project

    @classmethod
    def track_sla(cls, request, project: Project) -> dict:
        """
        Checks if the project or its milestones are exceeding deadlines.
        """
        cls.validate_ownership(project, request)
        from django.utils import timezone
        today = timezone.now().date()
        
        is_overdue = project.deadline and project.deadline < today and project.status != 'completed'
        overdue_milestones = project.milestones.filter(due_date__lt=today, is_completed=False)
        
        return {
            "project_overdue": is_overdue,
            "overdue_milestones_count": overdue_milestones.count(),
            "deadline": project.deadline
        }

    @staticmethod
    def compute_progress(project):
        """Dynamic metric calculus parsing terminal nodes over the current structural volume."""
        tasks = project.tasks.all()
        if not tasks.exists():
            return 0
        completed = tasks.filter(status='done').count()
        progress = int((completed / tasks.count()) * 100)
        
        project.progress_override = progress
        project.save(update_fields=['progress_override'])
        return progress
