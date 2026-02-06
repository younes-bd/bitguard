from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.db.models import Q
from django.urls import reverse_lazy
from django.contrib import messages
from .models import Post, Category, Comment
from .forms import PostCreateForm, PostUpdateForm, CommentForm
from taggit.models import Tag

# --- Public Views ---

class BlogListView(ListView):
    model = Post
    template_name = 'blog/blog_list.html'
    context_object_name = 'posts'
    paginate_by = 6

    def get_queryset(self):
        return Post.objects.filter(status='published').order_by('-publish_date')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.all()
        return context

class BlogDetailView(DetailView):
    model = Post
    template_name = 'blog/blog_detail.html'
    context_object_name = 'post'

    def get_queryset(self):
        return Post.objects.filter(status='published')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['comment_form'] = CommentForm()
        context['related_posts'] = Post.objects.filter(category=self.object.category).exclude(id=self.object.id)[:3]
        return context

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.post = self.object
            comment.author = request.user
            comment.save()
            messages.success(request, 'Your comment has been posted!')
            return redirect('blog:post_detail', slug=self.object.slug)
        context = self.get_context_data(object=self.object)
        context['comment_form'] = form
        return self.render_to_response(context)


class CategoryPostView(ListView):
    model = Post
    template_name = 'blog/blog_category.html'
    context_object_name = 'posts'
    paginate_by = 6

    def get_queryset(self):
        self.category = get_object_or_404(Category, slug=self.kwargs['slug'])
        return Post.objects.filter(category=self.category, status='published').order_by('-publish_date')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['category'] = self.category
        context['categories'] = Category.objects.all()
        return context


class TagPostView(ListView):
    model = Post
    template_name = 'blog/blog_tag.html'
    context_object_name = 'posts'
    paginate_by = 6

    def get_queryset(self):
        self.tag = get_object_or_404(Tag, slug=self.kwargs['slug'])
        return Post.objects.filter(tags__in=[self.tag], status='published').order_by('-publish_date')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['tag'] = self.tag
        return context


class SearchPostView(ListView):
    model = Post
    template_name = 'blog/blog_search.html'
    context_object_name = 'posts'
    paginate_by = 6

    def get_queryset(self):
        query = self.request.GET.get('q')
        if query:
            return Post.objects.filter(
                Q(title__icontains=query) | Q(content__icontains=query),
                status='published'
            ).distinct()
        return Post.objects.none()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['query'] = self.request.GET.get('q')
        return context


# --- Dashboard Views ---

class DashboardView(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
    template_name = 'blog/dashboard/dashboard.html'

    def test_func(self):
        return self.request.user.is_staff

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['posts'] = Post.objects.all()
        context['categories'] = Category.objects.all()
        return context

class PostCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = Post
    form_class = PostCreateForm
    template_name = 'blog/dashboard/post_form.html'
    success_url = reverse_lazy('blog:dashboard')

    def test_func(self):
        return self.request.user.is_staff

    def form_valid(self, form):
        form.instance.author = self.request.user
        messages.success(self.request, "Post created successfully!")
        return super().form_valid(form)

class PostUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Post
    form_class = PostUpdateForm
    template_name = 'blog/dashboard/post_form.html'
    success_url = reverse_lazy('blog:dashboard')

    def test_func(self):
        return self.request.user.is_staff

    def form_valid(self, form):
        messages.success(self.request, "Post updated successfully!")
        return super().form_valid(form)

class PostDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Post
    template_name = 'blog/dashboard/post_confirm_delete.html'
    success_url = reverse_lazy('blog:dashboard')

    def test_func(self):
        return self.request.user.is_staff

    def delete(self, request, *args, **kwargs):
        messages.success(self.request, "Post deleted successfully!")
        return super().delete(request, *args, **kwargs)
