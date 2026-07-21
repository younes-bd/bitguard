from django.contrib import admin
from apps.pos.domain.models import PosConfig, PosSession, PosOrder, PosPayment

admin.site.register(PosConfig)
admin.site.register(PosSession)
admin.site.register(PosOrder)
admin.site.register(PosPayment)
