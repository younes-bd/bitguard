
from django.utils import timezone
from django.db import models
from django.contrib.auth import get_user_model
from django.urls import reverse


User = get_user_model()


class Announcement(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='announcements/', blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Signup(models.Model):
    email = models.EmailField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email


class WebsiteInquiry(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Website Inquiry"
        verbose_name_plural = "Website Inquiries"

    def __str__(self):
        return f"{self.subject} - {self.full_name}"


class ServicePage(models.Model):
    """
    Marketing/Content page for a Service.
    Links to the master 'erp.Service' for pricing and logic.
    """
    linked_service = models.OneToOneField('erp.Service', on_delete=models.SET_NULL, null=True, blank=True, related_name='page')
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=100) # FontAwesome class
    hero_bg = models.CharField(max_length=200) # CSS gradient
    hero_image = models.CharField(max_length=255) # Path to image
    content = models.TextField() # HTML content
    features = models.JSONField(default=list)

    def __str__(self):
        return self.title
