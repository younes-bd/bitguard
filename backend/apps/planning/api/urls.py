from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.planning.api.views import ShiftViewSet, PlanningRoleViewSet, ShiftTemplateViewSet

app_name = 'planning'

router = DefaultRouter()
router.register(r'roles', PlanningRoleViewSet, basename='planning-role')
router.register(r'templates', ShiftTemplateViewSet, basename='shift-template')
router.register(r'shifts', ShiftViewSet, basename='shift')

urlpatterns = [
    path('', include(router.urls)),
]
