from apps.core.api.mixins import TenantScopedMixin
from rest_framework import viewsets, permissions
from ..domain.models import Course, Content, Forum, CourseCertification, Review
from .serializers import (
    CourseSerializer, 
    ContentSerializer, 
    ForumSerializer, 
    CourseCertificationSerializer, 
    ReviewSerializer
)

class CourseViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class ContentViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    permission_classes = [permissions.IsAuthenticated]

class ForumViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = Forum.objects.all()
    serializer_class = ForumSerializer
    permission_classes = [permissions.IsAuthenticated]

class CourseCertificationViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = CourseCertification.objects.all()
    serializer_class = CourseCertificationSerializer
    permission_classes = [permissions.IsAuthenticated]

class ReviewViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
