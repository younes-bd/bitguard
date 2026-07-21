from django.contrib import admin
from apps.mrp.domain.models import WorkCenter, BillOfMaterial, ManufacturingOrder

admin.site.register(WorkCenter)
admin.site.register(BillOfMaterial)
admin.site.register(ManufacturingOrder)
