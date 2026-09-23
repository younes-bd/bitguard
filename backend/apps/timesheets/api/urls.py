from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.employees.api.views import TimeEntryViewSet

router = DefaultRouter()
router.register(r'time-entries', TimeEntryViewSet, basename='time-entry')

urlpatterns = [
    path('', include(router.urls)),
]
