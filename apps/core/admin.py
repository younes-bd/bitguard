from django.contrib import admin
from apps.access.models import Role, Permission, UserRole

# Core admin is now just a convenient place to register other models if not done in their own apps,
# but ideally they should move. For now, we keep them here or move them.
# Let's move them to their respective admin.py files in the next step, 
# but for now just remove Notification.


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'tenant')
    list_filter = ('tenant',)

@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ('code', 'product')
    list_filter = ('product',)

@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'assigned_at')
