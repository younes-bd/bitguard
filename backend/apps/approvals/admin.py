from django.contrib import admin
from .models import ApprovalRequest, ApprovalStep

class ApprovalStepInline(admin.TabularInline):
    model = ApprovalStep
    extra = 1

@admin.register(ApprovalRequest)
class ApprovalRequestAdmin(admin.ModelAdmin):
    list_display = ('title', 'requester', 'request_type', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'request_type', 'created_at')
    search_fields = ('title', 'requester__email', 'requester__first_name', 'requester__last_name')
    inlines = [ApprovalStepInline]
    readonly_fields = ('created_at', 'updated_at')

@admin.register(ApprovalStep)
class ApprovalStepAdmin(admin.ModelAdmin):
    list_display = ('approval_request', 'step_order', 'approver', 'status', 'decided_at')
    list_filter = ('status',)
    search_fields = ('approval_request__title', 'approver__email')
