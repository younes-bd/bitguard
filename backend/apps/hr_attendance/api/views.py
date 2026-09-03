from rest_framework import viewsets
from apps.core.api.mixins import TenantScopedMixin
from apps.hr_attendance.domain.models import Attendance
from apps.hr_attendance.api.serializers import AttendanceSerializer

class AttendanceViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

