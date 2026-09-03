from apps.core.validators import validate_document_file, validate_image_file

from django.utils import timezone
from django.db import models
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.conf import settings
from apps.core.domain.models import TenantAwareModel


User = get_user_model()


class Announcement(TenantAwareModel):
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='announcements/', blank=True, null=True, validators=[validate_image_file])
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Signup(TenantAwareModel):
    email = models.EmailField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email


class WebsiteInquiry(TenantAwareModel):
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_resolved = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Website Inquiry"
        verbose_name_plural = "Website Inquiries"

    def __str__(self):
        return f"{self.subject} - {self.full_name}"


class Website(TenantAwareModel):
    name = models.CharField(max_length=200)
    domain = models.CharField(max_length=255, blank=True, help_text="e.g. https://www.example.com")
    language = models.CharField(max_length=10, default='en')
    theme_color = models.CharField(max_length=50, blank=True, default='#3b82f6')
    favicon = models.ForeignKey('website.MediaAsset', on_delete=models.SET_NULL, null=True, blank=True, related_name='+')
    logo = models.ForeignKey('website.MediaAsset', on_delete=models.SET_NULL, null=True, blank=True, related_name='+')
    google_analytics_key = models.CharField(max_length=100, blank=True)
    plausible_domain = models.CharField(max_length=255, blank=True, help_text="e.g. example.com")
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class WebsiteMenu(TenantAwareModel):
    name = models.CharField(max_length=100)
    url = models.CharField(max_length=255, default='/')
    website = models.ForeignKey(Website, on_delete=models.CASCADE, related_name='menus')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    sequence = models.IntegerField(default=10)
    is_mega_menu = models.BooleanField(default=False)

    class Meta:
        ordering = ['sequence']

    def __str__(self):
        return f"{self.name} ({self.website.name})"

class WebsiteRedirect(TenantAwareModel):
    website = models.ForeignKey(Website, on_delete=models.CASCADE, related_name='redirects')
    url_from = models.CharField(max_length=255, help_text="e.g. /old-page")
    url_to = models.CharField(max_length=255, help_text="e.g. /new-page")
    type = models.CharField(max_length=10, choices=[('301', '301 Moved Permanently'), ('302', '302 Found')], default='301')
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.url_from} -> {self.url_to}"

class LandingPage(TenantAwareModel):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    campaign_slug = models.CharField(max_length=100, blank=True)
    builder_json = models.JSONField(default=dict, blank=True)
    seo_metadata = models.JSONField(default=dict, blank=True)
    is_published = models.BooleanField(default=False)


class MediaAsset(TenantAwareModel):
    file = models.FileField(upload_to='cms_media/%Y/%m/%d/', validators=[validate_document_file])
    filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50) # e.g. image/png, application/pdf
    file_size = models.PositiveIntegerField(help_text="File size in bytes")
    dimensions = models.CharField(max_length=50, blank=True, help_text="e.g. 1920x1080")
    alt_text = models.CharField(max_length=255, blank=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.filename

class ServicePage(TenantAwareModel):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=100) # FontAwesome class
    hero_bg = models.CharField(max_length=200) # CSS gradient
    hero_image = models.CharField(max_length=255) # Path to image
    content = models.TextField() # HTML content
    features = models.JSONField(default=list)
    content_data = models.JSONField(default=dict, blank=True)
    linked_service = models.ForeignKey('product.Product', on_delete=models.SET_NULL, null=True, blank=True, related_name='marketing_pages')
    status = models.CharField(max_length=20, choices=[('draft', 'Draft'), ('published', 'Published'), ('archived', 'Archived')], default='draft')
    published_at = models.DateTimeField(null=True, blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='authored_service_pages')
    version = models.IntegerField(default=1)

    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    og_image = models.ForeignKey(MediaAsset, on_delete=models.SET_NULL, null=True, blank=True, related_name='+')

    def __str__(self):
        return self.title

class Page(TenantAwareModel):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    website = models.ForeignKey(Website, on_delete=models.CASCADE, related_name='pages', null=True, blank=True)
    content = models.JSONField(default=list, help_text="List of content blocks")
    seo_title = models.CharField(max_length=200, blank=True)
    seo_description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=[('draft', 'Draft'), ('published', 'Published'), ('archived', 'Archived')], default='draft')
    published_at = models.DateTimeField(null=True, blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='authored_pages')
    version = models.IntegerField(default=1)
    
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    og_image = models.ForeignKey(MediaAsset, on_delete=models.SET_NULL, null=True, blank=True, related_name='+')

    def __str__(self):
        return self.title
