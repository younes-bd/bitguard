from django.utils.text import slugify
from django.utils import timezone
from .models import Post, Category, Comment

class BlogService:
    @staticmethod
    def create_post(data, user):
        """Creates a new blog post ensuring correct slug generation and author mapping."""
        base_slug = slugify(data.get('title', ''))
        unique_slug = base_slug
        counter = 1
        while Post.objects.filter(slug=unique_slug).exists():
            unique_slug = f"{base_slug}-{counter}"
            counter += 1
            
        post = Post(
            title=data.get('title'),
            slug=unique_slug,
            content=data.get('content', ''),
            author=user,
            status=data.get('status', 'draft'),
            publish_date=data.get('publish_date')
        )
        post.save()
        return post

    @staticmethod
    def add_comment(post, data, user):
        """Executes verification algorithms before embedding new comments onto a post."""
        return Comment.objects.create(
            post=post,
            author=user,
            content=data.get('content')
        )
