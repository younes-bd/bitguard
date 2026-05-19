from django.contrib import admin
from .models import Client, Contact, Lead, Deal, Activity

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'client_type', 'status', 'email', 'phone')
    search_fields = ('name', 'email', 'phone')
    list_filter = ('client_type', 'status')

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'client', 'email', 'is_primary')
    search_fields = ('first_name', 'last_name', 'email')
    list_filter = ('is_primary', 'role')

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'value', 'score')
    search_fields = ('title', 'description')
    list_filter = ('status',)

@admin.register(Deal)
class DealAdmin(admin.ModelAdmin):
    list_display = ('title', 'client', 'amount', 'stage', 'expected_close_date')
    search_fields = ('title',)
    list_filter = ('stage',)

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('activity_type', 'client', 'deal', 'lead')
    search_fields = ('description',)
    list_filter = ('activity_type',)
