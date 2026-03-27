from django.contrib import admin
from .models import Project, Task, Milestone, TimeLog


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'project_type', 'status', 'priority', 'client', 'manager', 'deadline', 'progress']
    list_filter = ['status', 'project_type', 'priority']
    search_fields = ['name', 'client__name']
    readonly_fields = ['progress']


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'status', 'priority', 'assignee', 'due_date']
    list_filter = ['status', 'priority']
    search_fields = ['title', 'project__name']


@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ['name', 'project', 'due_date', 'is_completed', 'invoice_on_completion']
    list_filter = ['is_completed']


@admin.register(TimeLog)
class TimeLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'task', 'date', 'hours', 'is_billable']
    list_filter = ['is_billable', 'date']
