from rest_framework import serializers
from .models import Post, Category, Comment

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'author_name', 'content', 'created_at']
        read_only_fields = ['author']

class PostSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    author_name = serializers.CharField(source='author.username', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Post
        fields = '__all__'
