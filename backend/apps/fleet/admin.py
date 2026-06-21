from django.contrib import admin
from . import models

# Auto-generated Admin for fleet

@admin.register(models.Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    pass

@admin.register(models.VehicleLog)
class VehicleLogAdmin(admin.ModelAdmin):
    pass

@admin.register(models.VehicleContract)
class VehicleContractAdmin(admin.ModelAdmin):
    pass

