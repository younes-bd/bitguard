from django.contrib import admin
from .models import User, Role, SecurityPolicy, ApiKey

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active', 'is_locked')
    list_filter = ('is_staff', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(SecurityPolicy)
class SecurityPolicyAdmin(admin.ModelAdmin):
    list_display = ('password_complexity', 'mfa_required', 'session_timeout')
    list_filter = ('mfa_required', 'password_complexity')

@admin.register(ApiKey)
class ApiKeyAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'created_at', 'last_used')
    list_filter = ('created_at',)
    search_fields = ('name', 'user__email')
