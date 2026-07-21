from django.contrib import admin
from apps.fleet.domain.models import Vehicle, VehicleLog, VehicleContract

admin.site.register(Vehicle)
admin.site.register(VehicleLog)
admin.site.register(VehicleContract)
