from rest_framework import viewsets, permissions, filters
from .models import Post, Category, Comment
from .serializers import PostSerializer, CategorySerializer, CommentSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.filter(status='published').order_by('-publish_date')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'content', 'tags__name']

    def get_queryset(self):
        # Admin can see all, others only published
        user = self.request.user
        if user.is_staff:
            return Post.objects.all().order_by('-publish_date')
        return Post.objects.filter(status='published').order_by('-publish_date')

    def get_object(self):
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        lookup_value = self.kwargs[lookup_url_kwarg]

        # Try lookup by ID if numeric
        if lookup_value.isdigit():
            try:
                return self.get_queryset().get(id=lookup_value)
            except Post.DoesNotExist:
                pass

        # Fallback to slug lookup
        try:
            return self.get_queryset().get(slug=lookup_value)
        except Post.DoesNotExist:
            from django.http import Http404
            raise Http404

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=False, methods=['get'])
    def tag(self, request):
        tag_slug = request.query_params.get('tag')
        if not tag_slug:
            return Response([])
        return Response(self.serializer_class(
            self.get_queryset().filter(tags__slug=tag_slug), many=True
        ).data)

    @action(detail=False, methods=['get'])
    def category(self, request):
        cat_slug = request.query_params.get('category')
        if not cat_slug:
            return Response([])
        return Response(self.serializer_class(
            self.get_queryset().filter(category__slug=cat_slug), many=True
        ).data)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
