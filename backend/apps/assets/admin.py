from django.contrib import admin
from .domain import models

# Auto-generated Admin for assets

@admin.register(models.Asset)
class AssetAdmin(admin.ModelAdmin):
    pass

@admin.register(models.AssetAssignment)
class AssetAssignmentAdmin(admin.ModelAdmin):
    pass

@admin.register(models.MaintenanceRecord)
class MaintenanceRecordAdmin(admin.ModelAdmin):
    pass

@admin.register(models.SoftwareLicense)
class SoftwareLicenseAdmin(admin.ModelAdmin):
    pass

