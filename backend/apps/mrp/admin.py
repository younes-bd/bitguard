from django.contrib import admin
from . import models

# Auto-generated Admin for mrp

@admin.register(models.WorkCenter)
class WorkCenterAdmin(admin.ModelAdmin):
    pass

@admin.register(models.BillOfMaterial)
class BillOfMaterialAdmin(admin.ModelAdmin):
    pass

@admin.register(models.BOMComponent)
class BOMComponentAdmin(admin.ModelAdmin):
    pass

@admin.register(models.ManufacturingOrder)
class ManufacturingOrderAdmin(admin.ModelAdmin):
    pass

