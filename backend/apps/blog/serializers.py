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
    tags = serializers.ListField(child=serializers.CharField(), required=False)

    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ['author']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['tags'] = [t.name for t in instance.tags.all()]
        return data

    def to_internal_value(self, data):
        # Handle featured_image if it's a string (URL) rather than a file
        if 'featured_image' in data and isinstance(data['featured_image'], str):
            if data['featured_image'].startswith('http'):
                pass
            elif not data['featured_image']:
                data['featured_image'] = None
        
        # Handle empty category
        if 'category' in data and data['category'] == '':
            data['category'] = None
            
        return super().to_internal_value(data)

    def create(self, validated_data):
        tags = validated_data.pop('tags', None)
        # Remove featured_image if it's a string URL (ImageField doesn't like it)
        if 'featured_image' in validated_data and isinstance(validated_data['featured_image'], str):
            validated_data.pop('featured_image')
            
        instance = super().create(validated_data)
        if tags:
            instance.tags.set(*tags)
        return instance

    def update(self, instance, validated_data):
        tags = validated_data.pop('tags', None)
        # Remove featured_image if it's a string URL
        if 'featured_image' in validated_data and isinstance(validated_data['featured_image'], str):
            validated_data.pop('featured_image')
            
        instance = super().update(instance, validated_data)
        if tags is not None: # even empty list should clear tags
            instance.tags.set(*tags)
        return instance
