from rest_framework import viewsets
from apps.base.api.mixins import TenantScopedMixin
from apps.recruiting.domain.models import JobPosition, JobApplication, JobApplicant
from apps.recruiting.api.serializers import JobPositionSerializer, JobApplicationSerializer, JobApplicantSerializer

class JobPositionViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = JobPosition.objects.all()
    serializer_class = JobPositionSerializer

class JobApplicationViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer

class JobApplicantViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = JobApplicant.objects.all()
    serializer_class = JobApplicantSerializer

