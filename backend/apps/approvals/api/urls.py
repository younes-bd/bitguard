from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ApprovalRequestViewSet, ApprovalStepViewSet

router = DefaultRouter()
router.register(r'requests', ApprovalRequestViewSet, basename='approval-request')
router.register(r'steps', ApprovalStepViewSet, basename='approval-step')

urlpatterns = [
    path('', include(router.urls)),
]
