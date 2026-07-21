from django.db import models
from django.conf import settings
from apps.core.domain.models import TenantAwareModel

# --- E-LEARNING ---
class Course(TenantAwareModel):
    website = models.ForeignKey('website.Website', on_delete=models.CASCADE, null=True, blank=True, related_name='elearning_courses')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_published = models.BooleanField(default=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='%(app_label)s_%(class)s_created')
    
    def __str__(self):
        return self.title

class Content(TenantAwareModel):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='contents')
    title = models.CharField(max_length=255)
    content_type = models.CharField(max_length=50, choices=[('video', 'Video'), ('document', 'Document'), ('quiz', 'Quiz')], default='document')
    body = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"

class Forum(TenantAwareModel):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='forums')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.title

class CourseCertification(TenantAwareModel):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='certifications')
    title = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.title

class Review(TenantAwareModel):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(default=5)
    comment = models.TextField(blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return f"Review for {self.course.title} by {self.user}"


class CourseGroup(TenantAwareModel):
    name = models.CharField(max_length=100)
    website = models.ForeignKey('website.Website', on_delete=models.CASCADE, null=True, blank=True)
    description = models.TextField(blank=True)


