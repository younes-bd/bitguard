from apps.core.api.mixins import TenantScopedMixin
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from apps.appointments.domain.models import Appointment, AppointmentType, AppointmentResource
from apps.appointments.api.serializers import AppointmentSerializer, AppointmentTypeSerializer, AppointmentResourceSerializer

class AppointmentTypeViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = AppointmentTypeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AppointmentType.objects.filter(tenant=getattr(self.request, 'tenant', None))
        
    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request, 'tenant', None))

class AppointmentResourceViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = AppointmentResourceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AppointmentResource.objects.filter(tenant=getattr(self.request, 'tenant', None))
        
    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request, 'tenant', None))

class AppointmentViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(tenant=getattr(self.request, 'tenant', None))
        
    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request, 'tenant', None))
