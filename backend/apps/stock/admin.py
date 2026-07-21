from django.contrib import admin
from .domain import models

# Auto-generated Admin for inventory

@admin.register(models.Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    pass

@admin.register(models.InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    pass

@admin.register(models.GoodsReceipt)
class GoodsReceiptAdmin(admin.ModelAdmin):
    pass

@admin.register(models.GoodsReceiptLine)
class GoodsReceiptLineAdmin(admin.ModelAdmin):
    pass

@admin.register(models.StockMove)
class StockMoveAdmin(admin.ModelAdmin):
    pass

@admin.register(models.StockAdjustment)
class StockAdjustmentAdmin(admin.ModelAdmin):
    pass

@admin.register(models.ReorderRule)
class ReorderRuleAdmin(admin.ModelAdmin):
    pass

