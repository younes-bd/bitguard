from django.db import models
from django.conf import settings
from apps.core.models import UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel, TenantAwareModel


class Project(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel):
    """
    Dedicated Project Management model — separate from ERP InternalProject.
    Represents a client-facing or internal service engagement.
    """
    STATUS_CHOICES = [
        ('backlog', 'Backlog'),
        ('planning', 'Planning'),
        ('active', 'Active'),
        ('on_hold', 'On Hold'),
        ('review', 'In Review'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    TYPE_CHOICES = [
        ('client', 'Client Project'),
        ('internal', 'Internal'),
        ('security', 'Security Assessment'),
        ('infrastructure', 'Infrastructure'),
        ('rd', 'R&D'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    project_type = models.CharField(max_length=30, choices=TYPE_CHOICES, default='client')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')

    # Relationships
    client = models.ForeignKey(
        'crm.Client', on_delete=models.SET_NULL, null=True, blank=True, related_name='pm_projects'
    )
    contract = models.ForeignKey(
        'contracts.ServiceContract', on_delete=models.SET_NULL, null=True, blank=True, related_name='pm_projects'
    )
    manager = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='pm_managed_projects'
    )
    team_members = models.ManyToManyField(
        settings.AUTH_USER_MODEL, blank=True, related_name='pm_assigned_projects'
    )

    # Timeline
    start_date = models.DateField(null=True, blank=True)
    deadline = models.DateField(null=True, blank=True)
    completed_date = models.DateField(null=True, blank=True)

    # Budget (links to ERP for invoicing)
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    # Progress (computed from tasks, but can be overridden)
    progress_override = models.IntegerField(null=True, blank=True, help_text='0–100. Auto-computed from tasks if null.')

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Project'

    def __str__(self):
        return self.name

    @property
    def progress(self):
        if self.progress_override is not None:
            return self.progress_override
        total = self.tasks.count()
        if not total:
            return 0
        done = self.tasks.filter(status='done').count()
        return round(done / total * 100)


class Task(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel):
    """
    Kanban card — belongs to a Project and sits in a stage column.
    """
    STAGE_CHOICES = [
        ('backlog', 'Backlog'),
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('review', 'In Review'),
        ('done', 'Done'),
    ]
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STAGE_CHOICES, default='todo')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tasks'
    )
    due_date = models.DateField(null=True, blank=True)
    estimated_hours = models.DecimalField(max_digits=6, decimal_places=1, null=True, blank=True)
    order = models.PositiveIntegerField(default=0, help_text='Sort order within the column')
    tags = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return self.title


class Milestone(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel):
    """
    Key delivery checkpoint in a project.
    Can trigger invoice generation via ERP.
    """
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='milestones')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    due_date = models.DateField()
    is_completed = models.BooleanField(default=False)
    completed_date = models.DateField(null=True, blank=True)
    # When milestone completes, optionally create an ERP invoice
    invoice_on_completion = models.BooleanField(default=False)
    invoice_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    class Meta:
        ordering = ['due_date']

    def __str__(self):
        return f'{self.project.name} — {self.name}'


class TimeLog(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel):
    """
    Time tracking entry — logged against a task.
    Feeds into ERP billing for time-and-materials projects.
    """
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='time_logs')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='time_logs')
    date = models.DateField()
    hours = models.DecimalField(max_digits=5, decimal_places=2)
    description = models.CharField(max_length=500, blank=True)
    is_billable = models.BooleanField(default=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f'{self.user} — {self.hours}h on {self.task.title}'
