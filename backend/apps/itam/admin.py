from django.contrib import admin
from .models import Asset, AssetAssignment, MaintenanceRecord


@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = ['name', 'asset_tag', 'asset_type', 'status', 'client', 'assigned_to', 'warranty_expires']
    list_filter = ['asset_type', 'status']
    search_fields = ['name', 'asset_tag', 'serial_number', 'make', 'model']


@admin.register(AssetAssignment)
class AssetAssignmentAdmin(admin.ModelAdmin):
    list_display = ['asset', 'assigned_to', 'assigned_at', 'returned_at']
    list_filter = ['assigned_at']


@admin.register(MaintenanceRecord)
class MaintenanceRecordAdmin(admin.ModelAdmin):
    list_display = ['asset', 'maintenance_type', 'performed_by', 'performed_at', 'cost']
    list_filter = ['maintenance_type', 'performed_at']
