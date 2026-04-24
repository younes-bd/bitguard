from django.contrib import admin
from .models import ChangeRequest, ChangeTask

class ChangeTaskInline(admin.TabularInline):
    model = ChangeTask
    extra = 1

@admin.register(ChangeRequest)
class ChangeRequestAdmin(admin.ModelAdmin):
    list_display = ('title', 'requester', 'status', 'priority', 'risk_level', 'scheduled_date')
    list_filter = ('status', 'priority', 'risk_level')
    search_fields = ('title', 'description', 'requester__email')
    inlines = [ChangeTaskInline]
    readonly_fields = ('created_at', 'updated_at')

@admin.register(ChangeTask)
class ChangeTaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'change_request', 'assignee', 'status')
    list_filter = ('status',)
    search_fields = ('title', 'assignee__email', 'change_request__title')
