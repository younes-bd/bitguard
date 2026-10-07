from django.contrib import admin
from .domain.models import User, Role, PersonalAccessToken

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active', 'is_locked')
    list_filter = ('is_staff', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)


@admin.register(PersonalAccessToken)
class PersonalAccessTokenAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'created_at', 'last_used')
    list_filter = ('created_at',)
    search_fields = ('name', 'user__email')
