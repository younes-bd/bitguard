from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import PostViewSet, CategoryViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
