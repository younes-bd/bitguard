from django.contrib import admin
from .domain.models import Page, ServicePage, MediaAsset

@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'status', 'published_at', 'author')
    list_filter = ('status', 'author')
    search_fields = ('title', 'slug')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(ServicePage)
class ServicePageAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'status', 'linked_service')
    list_filter = ('status',)
    search_fields = ('title', 'slug')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = ('filename', 'file_type', 'file_size', 'uploaded_by', 'created_at')
    list_filter = ('file_type',)
    search_fields = ('filename', 'alt_text')
