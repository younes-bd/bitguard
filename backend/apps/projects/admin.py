from django.contrib import admin
from .domain import models

# Auto-generated Admin for projects

@admin.register(models.Project)
class ProjectAdmin(admin.ModelAdmin):
    pass

@admin.register(models.Sprint)
class SprintAdmin(admin.ModelAdmin):
    pass

@admin.register(models.TaskStage)
class TaskStageAdmin(admin.ModelAdmin):
    pass

@admin.register(models.ProjectTag)
class ProjectTagAdmin(admin.ModelAdmin):
    pass

@admin.register(models.Task)
class TaskAdmin(admin.ModelAdmin):
    pass

@admin.register(models.TaskComment)
class TaskCommentAdmin(admin.ModelAdmin):
    pass

@admin.register(models.TaskAttachment)
class TaskAttachmentAdmin(admin.ModelAdmin):
    pass

@admin.register(models.ProjectRisk)
class ProjectRiskAdmin(admin.ModelAdmin):
    pass

@admin.register(models.Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    pass

@admin.register(models.TimeLog)
class TimeLogAdmin(admin.ModelAdmin):
    pass

@admin.register(models.Timesheet)
class TimesheetAdmin(admin.ModelAdmin):
    pass

