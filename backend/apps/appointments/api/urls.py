from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.appointments.api.views import AppointmentViewSet, AppointmentTypeViewSet, AppointmentResourceViewSet

app_name = 'appointments'

router = DefaultRouter()
router.register(r'types', AppointmentTypeViewSet, basename='appointment-type')
router.register(r'resources', AppointmentResourceViewSet, basename='appointment-resource')
router.register(r'appointments', AppointmentViewSet, basename='appointment')

urlpatterns = [
    path('', include(router.urls)),
]
