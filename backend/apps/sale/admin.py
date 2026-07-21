from django.contrib import admin
from .domain.models import SaleOrder, SaleOrderLine

admin.site.register(SaleOrder)
admin.site.register(SaleOrderLine)
