from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CourseViewSet,
    ContentViewSet,
    ForumViewSet,
    CourseCertificationViewSet,
    ReviewViewSet
)

app_name = 'elearning'

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'contents', ContentViewSet)
router.register(r'forums', ForumViewSet)
router.register(r'certifications', CourseCertificationViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
