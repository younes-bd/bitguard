from django.contrib import admin
from .models import Client, Ticket, Contact, Contract, ActivityLog, Deal, Project, Interaction, Quote

class ContactInline(admin.TabularInline):
    model = Contact
    extra = 1

class InteractionInline(admin.TabularInline):
    model = Interaction
    extra = 0
    readonly_fields = ('date',)
    can_delete = False

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'client_type', 'status', 'account_manager', 'created_at')
    list_filter = ('client_type', 'status')
    search_fields = ('name', 'email', 'phone')
    inlines = [ContactInline, InteractionInline]
    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'client_type', 'status')
        }),
        ('Contact Details', {
            'fields': ('email', 'phone', 'website', 'address')
        }),
        ('Business Info', {
            'fields': ('company_name', 'account_manager')
        }),
    )

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'client', 'role', 'email', 'is_primary')
    search_fields = ('first_name', 'last_name', 'email', 'client__name')
    list_filter = ('client', 'is_primary')

@admin.register(Deal)
class DealAdmin(admin.ModelAdmin):
    list_display = ('name', 'client', 'stage', 'value', 'owner', 'expected_close_date')
    list_filter = ('stage', 'expected_close_date')
    search_fields = ('name', 'client__name')

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('summary', 'client', 'priority', 'status', 'assigned_to', 'created_at', 'sla_due_at')
    list_filter = ('status', 'priority', 'created_at')
    search_fields = ('summary', 'description', 'client__name')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'client', 'status', 'progress', 'start_date', 'end_date')
    list_filter = ('status', 'start_date')
    search_fields = ('name', 'client__name')

@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ('name', 'client', 'start_date', 'end_date', 'is_active', 'value')
    list_filter = ('is_active', 'start_date')
    search_fields = ('name', 'client__name')

@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    list_display = ('quote_number', 'client', 'status', 'total', 'valid_until', 'created_by')
    list_filter = ('status',)
    search_fields = ('client__name', 'quote_number')

@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'client', 'action', 'timestamp')
    list_filter = ('timestamp', 'action')
    search_fields = ('user__username', 'client__name', 'action', 'details')
    readonly_fields = ('timestamp',)