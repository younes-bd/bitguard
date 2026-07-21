from django.db import models
from django.conf import settings
from apps.core.domain.models import BaseModel, TenantAwareModel


class Project(TenantAwareModel):
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


class Sprint(TenantAwareModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='sprints')
    name = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    goal = models.TextField(blank=True)
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class TaskStage(TenantAwareModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='stages')
    name = models.CharField(max_length=100)
    sequence = models.IntegerField(default=10)
    is_completed = models.BooleanField(default=False)

    class Meta:
        ordering = ['sequence']

    def __str__(self):
        return self.name

class ProjectTag(TenantAwareModel):
    name = models.CharField(max_length=50)
    color = models.CharField(max_length=7, default='#000000')

    def __str__(self):
        return self.name

class TaskTag(TenantAwareModel):
    name = models.CharField(max_length=50)
    color = models.CharField(max_length=7, default='#6b7280')
    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name='task_tags', null=True, blank=True)

    def __str__(self):
        return self.name

class Task(TenantAwareModel):
    """
    Kanban card — belongs to a Project and sits in a stage column.
    """
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    stage = models.ForeignKey(TaskStage, on_delete=models.SET_NULL, null=True, blank=True)
    sprint = models.ForeignKey(Sprint, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, default='todo') # kept for backward compat / high level
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tasks'
    )
    due_date = models.DateField(null=True, blank=True)
    deadline = models.DateField(null=True, blank=True)
    estimated_hours = models.DecimalField(max_digits=6, decimal_places=1, null=True, blank=True)
    order = models.PositiveIntegerField(default=0, help_text='Sort order within the column')
    tags = models.ManyToManyField(TaskTag, blank=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return self.title

    @property
    def actual_hours(self):
        return sum(log.hours for log in self.time_logs.all())

class TaskComment(TenantAwareModel):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class TaskAttachment(TenantAwareModel):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='task_attachments/%Y/%m/')
    filename = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

class ProjectRisk(TenantAwareModel):
    IMPACT_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('severe', 'Severe'),
    ]
    PROBABILITY_CHOICES = [
        ('unlikely', 'Unlikely'),
        ('possible', 'Possible'),
        ('likely', 'Likely'),
        ('certain', 'Certain'),
    ]
    STATUS_CHOICES = [
        ('identified', 'Identified'),
        ('mitigating', 'Mitigating'),
        ('resolved', 'Resolved'),
    ]
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='risks', null=True)
    summary = models.CharField(max_length=255)
    description = models.TextField()
    impact = models.CharField(max_length=20, choices=IMPACT_CHOICES, default='medium')
    probability = models.CharField(max_length=20, choices=PROBABILITY_CHOICES, default='possible')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='identified')
    mitigation_plan = models.TextField(blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.summary

class Milestone(TenantAwareModel):
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

class TimeLog(TenantAwareModel):
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
    billed = models.BooleanField(default=False)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f'{self.user} — {self.hours}h on {self.task.title}'

class Timesheet(TenantAwareModel):
    """
    Timesheet model for broader tracking, possibly linked to hrm.
    """
    employee = models.ForeignKey('hrm.Employee', on_delete=models.CASCADE, null=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='timesheets')
    task = models.ForeignKey(Task, on_delete=models.SET_NULL, null=True, blank=True)
    date = models.DateField()
    hours = models.DecimalField(max_digits=5, decimal_places=2)
    description = models.TextField(blank=True)
    is_billable = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.employee} - {self.hours}h'




# --- TIMESHEETS (Frontend Visual Matching) ---
class TaskTimesheet(TenantAwareModel):
    description = models.CharField(max_length=255)
    hours_logged = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.description

