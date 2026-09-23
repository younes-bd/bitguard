from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import UserViewSet, RoleViewSet, RolePermissionViewSet, SecurityPolicyViewSet, RecordRuleViewSet
router = DefaultRouter()
router.register(r'roles', RoleViewSet, basename='role')
router.register(r'role-permissions', RolePermissionViewSet, basename='role-permission')
router.register(r'security-policy', SecurityPolicyViewSet, basename='security-policy')
router.register(r'record-rules', RecordRuleViewSet, basename='record-rule')
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
]
