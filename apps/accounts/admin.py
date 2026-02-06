# apps/accounts/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Profile, LoginActivity, Device, OTP

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User
    # extend the default UserAdmin with extra fields
    fieldsets = UserAdmin.fieldsets + (
        ('Extra', {'fields': ('phone_number', 'is_verified')}),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_verified')
    list_filter = ('is_staff', 'is_superuser', 'is_verified', 'is_active', 'groups')
    search_fields = ('username', 'email', 'first_name', 'last_name')


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'date_of_birth', 'social_link')
    search_fields = ('user__username', 'user__email')

@admin.register(LoginActivity)
class LoginActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'ip_address', 'timestamp')
    list_filter = ('status', 'timestamp')
    search_fields = ('user__username', 'ip_address')
    readonly_fields = ('user', 'ip_address', 'user_agent', 'status', 'timestamp')

    def has_add_permission(self, request):
        return False

@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'last_login', 'is_trusted', 'is_blocked')
    list_filter = ('is_trusted', 'is_blocked', 'last_login')
    search_fields = ('user__username', 'name', 'fingerprint')

@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'created_at', 'expires_at', 'is_used')
    list_filter = ('type', 'is_used', 'created_at')
    search_fields = ('user__username', 'code')
    readonly_fields = ('code',)

from .models import Address
@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'city', 'country', 'is_default')
    list_filter = ('type', 'is_default', 'country')
    search_fields = ('user__username', 'city', 'street_address', 'postal_code')
