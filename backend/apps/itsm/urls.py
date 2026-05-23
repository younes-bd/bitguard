from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ChangeRequestViewSet, ChangeTaskViewSet, ProblemViewSet,
    ServiceItemViewSet, ServiceRequestViewSet
)

router = DefaultRouter()
router.register(r'changes', ChangeRequestViewSet)
router.register(r'problems', ProblemViewSet)
router.register(r'tasks', ChangeTaskViewSet)
router.register(r'service-items', ServiceItemViewSet)
router.register(r'service-requests', ServiceRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
