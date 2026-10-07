from django.contrib import admin
from .domain.models import SalesOrder, SalesOrderLine

admin.site.register(SalesOrder)
admin.site.register(SalesOrderLine)
