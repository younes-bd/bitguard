from rest_framework import viewsets, permissions
from .models import Post, Category, Comment
from .serializers import PostSerializer, CategorySerializer, CommentSerializer

class PostViewSet(viewsets.ReadOnlyModelViewSet):
    # Only show published posts to public
    queryset = Post.objects.filter(status='published').order_by('-publish_date')
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('created_at')
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
