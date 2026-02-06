from django.contrib import admin
from .models import (
    OperationKPI, Service, InternalProject, Milestone,
    EmployeeProfile, Task, TimeLog,
    Asset, Vendor, VendorContract,
    RiskRegister, ComplianceItem
)

@admin.register(OperationKPI)
class OperationKPIAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'value', 'status', 'updated_at')
    list_filter = ('category', 'status')


class MilestoneInline(admin.TabularInline):
    model = Milestone
    extra = 1

@admin.register(InternalProject)
class InternalProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'client', 'manager', 'status', 'budget_cost', 'created_at')
    list_filter = ('status', 'client')
    search_fields = ('name', 'client__name')
    inlines = [MilestoneInline]
    
    fieldsets = (
        ('Project Details', {
            'fields': ('name', 'client', 'manager', 'description')
        }),
        ('Planning', {
            'fields': ('status', 'start_date', 'deadline', 'budget_cost', 'revenue')
        }),
    )

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'assigned_to', 'status', 'priority', 'due_date', 'actual_hours')
    list_filter = ('status', 'priority', 'project')
    search_fields = ('title', 'description')
    autocomplete_fields = ['project', 'assigned_to']

@admin.register(EmployeeProfile)
class EmployeeProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'job_title', 'department', 'seniority', 'internal_cost_rate')
    list_filter = ('department', 'seniority')
    search_fields = ('user__username', 'user__email', 'job_title')

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'service_type', 'base_price', 'is_active')
    list_filter = ('service_type', 'is_active')
    search_fields = ('name',)

@admin.register(TimeLog)
class TimeLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'task', 'hours', 'date', 'cost_amount')
    list_filter = ('date', 'user')
    search_fields = ('task__title', 'user__username')
    readonly_fields = ('cost_amount',)

@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = ('name', 'asset_tag', 'asset_type', 'status', 'assigned_to_user')
    list_filter = ('asset_type', 'status')
    search_fields = ('name', 'asset_tag', 'serial_number')

admin.site.register(Milestone)
admin.site.register(Vendor)
admin.site.register(VendorContract)
admin.site.register(RiskRegister)
admin.site.register(ComplianceItem)