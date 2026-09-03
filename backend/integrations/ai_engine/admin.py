from django.contrib import admin
from .models import AISettings, AIUsageLog

admin.site.register(AISettings)
admin.site.register(AIUsageLog)
