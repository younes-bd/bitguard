from django.utils import timezone
from .models import Project, Task, TimeLog

class ProjectService:
    @staticmethod
    def initialize_project(client, name, user):
        """Scaffolds a holistic organizational envelope mapping to billing modules and timesheeting."""
        project = Project.objects.create(
            client=client,
            name=name,
            manager=user,
            status='planning'
        )
        return project
        
    @staticmethod
    def compute_progress(project):
        """Dynamic metric calculus parsing terminal nodes over the current structural volume."""
        tasks = project.tasks.all()
        if not tasks.exists():
            return 0
        completed = tasks.filter(status='done').count()
        progress = int((completed / tasks.count()) * 100)
        
        project.progress = progress
        project.save(update_fields=['progress'])
        return progress
