from django.contrib import admin
from .domain.models import ChangeRequest, ChangeTask, ServiceCategory, ServiceItem, ServiceRequest, Problem

class ChangeTaskInline(admin.TabularInline):
    model = ChangeTask
    extra = 1

@admin.register(ChangeRequest)
class ChangeRequestAdmin(admin.ModelAdmin):
    list_display = ('title', 'requester', 'status', 'priority', 'risk_level', 'scheduled_date')
    list_filter = ('status', 'priority', 'risk_level')
    search_fields = ('title', 'description', 'requester__email')
    inlines = [ChangeTaskInline]
    readonly_fields = ('created_at', 'updated_at')

@admin.register(ChangeTask)
class ChangeTaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'change_request', 'assignee', 'status')
    list_filter = ('status',)
    search_fields = ('title', 'assignee__email', 'change_request__title')

@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'sort_order', 'is_active', 'parent')
    list_editable = ('sort_order', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    list_filter = ('is_active',)

@admin.register(ServiceItem)
class ServiceItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'base_price', 'pricing_type', 'visibility', 'is_featured', 'is_active')
    list_editable = ('is_active', 'is_featured', 'base_price')
    list_filter = ('category', 'is_active', 'pricing_type', 'visibility', 'billing_cycle', 'approval_required')
    search_fields = ('name', 'description', 'sku', 'tags')
    actions = ['activate_services', 'deactivate_services', 'mark_as_featured']

    def activate_services(self, request, queryset):
        queryset.update(is_active=True)
    activate_services.short_description = "Activate selected services"

    def deactivate_services(self, request, queryset):
        queryset.update(is_active=False)
    deactivate_services.short_description = "Deactivate selected services"

    def mark_as_featured(self, request, queryset):
        queryset.update(is_featured=True)
    mark_as_featured.short_description = "Mark selected services as featured"

@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    list_display = ('service_item', 'requester', 'status', 'urgency', 'created_at')
    list_filter = ('status', 'urgency', 'impact')
    search_fields = ('service_item__name', 'requester__email', 'department_code')

@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'priority', 'assigned_to')
    list_filter = ('status', 'priority')
    search_fields = ('title', 'description')
