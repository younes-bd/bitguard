from django.contrib import admin
from .models import (
    Tenant, Bundle, Subscription, Workspace, 
    SystemMonitor, CloudIntegration, HealthMetric, RemoteSession
)

@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'mode', 'is_active', 'created_at')
    search_fields = ('name', 'slug')
    list_filter = ('mode', 'created_at')

@admin.register(Bundle)
class BundleAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('tenant', 'bundle', 'status', 'current_period_end')
    list_filter = ('status',)

@admin.register(Workspace)
class WorkspaceAdmin(admin.ModelAdmin):
    list_display = ('name', 'tenant', 'client', 'created_at')
    search_fields = ('name', 'tenant__name', 'client__name')
    list_filter = ('created_at',)

@admin.register(SystemMonitor)
class SystemMonitorAdmin(admin.ModelAdmin):
    list_display = ('system_name', 'status', 'health_score', 'last_checked')
    list_filter = ('status',)

@admin.register(CloudIntegration)
class CloudIntegrationAdmin(admin.ModelAdmin):
    list_display = ('name', 'provider', 'status', 'last_sync')
    list_filter = ('provider', 'status')

@admin.register(RemoteSession)
class RemoteSessionAdmin(admin.ModelAdmin):
    list_display = ('session_code', 'technician', 'status', 'client_ip', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('session_code', 'technician__username')

@admin.register(HealthMetric)
class HealthMetricAdmin(admin.ModelAdmin):
    list_display = ('name', 'score', 'trend', 'updated_at')
    list_filter = ('trend',)
