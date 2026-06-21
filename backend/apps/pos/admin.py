from django.contrib import admin
from . import models

# Auto-generated Admin for pos

@admin.register(models.POSConfig)
class POSConfigAdmin(admin.ModelAdmin):
    pass

@admin.register(models.POSSession)
class POSSessionAdmin(admin.ModelAdmin):
    pass

@admin.register(models.POSOrder)
class POSOrderAdmin(admin.ModelAdmin):
    pass

@admin.register(models.POSOrderLine)
class POSOrderLineAdmin(admin.ModelAdmin):
    pass

@admin.register(models.POSPayment)
class POSPaymentAdmin(admin.ModelAdmin):
    pass

