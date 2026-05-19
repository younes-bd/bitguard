from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChangeRequestViewSet, ChangeTaskViewSet, ProblemViewSet

router = DefaultRouter()
router.register(r'changes', ChangeRequestViewSet)
router.register(r'problems', ProblemViewSet)
router.register(r'tasks', ChangeTaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
