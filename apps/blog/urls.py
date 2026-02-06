from django.urls import path
from . import views

app_name = 'blog'

urlpatterns = [
    # Public URLs
    path('', views.BlogListView.as_view(), name='post_list'),
    path('post/<slug:slug>/', views.BlogDetailView.as_view(), name='post_detail'),
    path('category/<slug:slug>/', views.CategoryPostView.as_view(), name='category_post'),
    path('tag/<slug:slug>/', views.TagPostView.as_view(), name='tag_post'),
    path('search/', views.SearchPostView.as_view(), name='search'),

    # Dashboard URLs
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    path('dashboard/create/', views.PostCreateView.as_view(), name='post_create'),
    path('dashboard/update/<slug:slug>/', views.PostUpdateView.as_view(), name='post_update'),
    path('dashboard/delete/<slug:slug>/', views.PostDeleteView.as_view(), name='post_delete'),
]
