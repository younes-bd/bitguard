from rest_framework import viewsets
from apps.core.api.mixins import TenantScopedMixin
from apps.hr_recruitment.domain.models import JobPosition, JobApplication, JobApplicant
from apps.hr_recruitment.api.serializers import JobPositionSerializer, JobApplicationSerializer, JobApplicantSerializer

class JobPositionViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = JobPosition.objects.all()
    serializer_class = JobPositionSerializer

class JobApplicationViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer

class JobApplicantViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = JobApplicant.objects.all()
    serializer_class = JobApplicantSerializer

