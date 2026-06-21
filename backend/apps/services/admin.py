from django.contrib import admin
from .domain import models

# Auto-generated Admin for services

@admin.register(models.ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    pass

@admin.register(models.ServiceItem)
class ServiceItemAdmin(admin.ModelAdmin):
    pass

@admin.register(models.ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    pass

