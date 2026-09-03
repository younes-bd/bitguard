from rest_framework import viewsets
from apps.core.api.mixins import TenantScopedMixin
from apps.hr_appraisal.domain.models import Appraisal, PerformanceAppraisal, PerformanceReview
from apps.hr_appraisal.api.serializers import AppraisalSerializer, PerformanceAppraisalSerializer, PerformanceReviewSerializer

class AppraisalViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = Appraisal.objects.all()
    serializer_class = AppraisalSerializer

class PerformanceAppraisalViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = PerformanceAppraisal.objects.all()
    serializer_class = PerformanceAppraisalSerializer

class PerformanceReviewViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = PerformanceReview.objects.all()
    serializer_class = PerformanceReviewSerializer

