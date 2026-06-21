from django.contrib import admin
from .domain import models

# Auto-generated Admin for purchase

@admin.register(models.Vendor)
class VendorAdmin(admin.ModelAdmin):
    pass

@admin.register(models.PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    pass

@admin.register(models.PurchaseOrderLine)
class PurchaseOrderLineAdmin(admin.ModelAdmin):
    pass

@admin.register(models.RFQ)
class RFQAdmin(admin.ModelAdmin):
    pass

@admin.register(models.VendorPricelist)
class VendorPricelistAdmin(admin.ModelAdmin):
    pass

