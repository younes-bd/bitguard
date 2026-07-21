from django.contrib import admin
from .domain.models import Signup, Announcement, WebsiteInquiry, LandingPage


admin.site.register(Signup)
admin.site.register(Announcement)

@admin.register(WebsiteInquiry)
class WebsiteInquiryAdmin(admin.ModelAdmin):
    list_display = ('subject', 'full_name', 'email', 'created_at', 'is_resolved')
    list_filter = ('is_resolved', 'created_at')
    search_fields = ('subject', 'full_name', 'email', 'message')

@admin.register(LandingPage)
class LandingPageAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_published', 'created_at')
    prepopulated_fields = {'slug': ('title',)}
