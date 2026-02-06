from django.urls import path, include
from . import admin_views



urlpatterns = [
    path('store/', include('apps.store.api_urls')),
    path('erp/', include('apps.erp.api_urls')),
    path('crm/', include('apps.crm.api_urls')),
    path('security/', include('apps.security.api_urls')),

    path('blog/', include('apps.blog.api_urls')),
    path('ai/', include('apps.ai_engine.api_urls')),
    path('automation/', include('apps.automation.api_urls')),
    path('accounts/', include('apps.accounts.urls')),
    path('home/', include('apps.home.api_urls')),
    path('core/', include('apps.core.urls')),
    path('access/', include('apps.access.urls')),
    path('tenants/', include('apps.tenants.urls')),
    path('notifications/', include('apps.notifications.urls')),
        
    # Generic Admin API
    path('admin/metadata/', admin_views.AdminMetadataView.as_view(), name='admin_metadata'),
    path('admin/<str:app_label>/<str:model_name>/', admin_views.AdminModelView.as_view(), name='admin_model_list'),
    path('admin/<str:app_label>/<str:model_name>/<int:pk>/', admin_views.AdminModelView.as_view(), name='admin_model_detail'),
]
