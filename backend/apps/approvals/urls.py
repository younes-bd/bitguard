from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ApprovalRequestViewSet, ApprovalStepViewSet

router = DefaultRouter()
router.register(r'requests', ApprovalRequestViewSet)
router.register(r'steps', ApprovalStepViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
