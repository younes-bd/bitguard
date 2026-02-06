from django import forms
from .models import Post, Comment, Category

class PostCreateForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = [
            'title', 'content', 'featured_image', 'category', 'tags', 
            'status', 'is_featured', 'publish_date', 'meta_title', 'meta_description'
        ]
        widgets = {
            'content': forms.Textarea(attrs={'class': 'form-control'}),
            'publish_date': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
        }

class PostUpdateForm(PostCreateForm):
    pass

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']
        widgets = {
            'content': forms.Textarea(attrs={'rows': 3, 'placeholder': 'Write your comment...'}),
        }
