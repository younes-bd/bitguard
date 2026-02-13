from django.urls import path, include
from . import admin_views



urlpatterns = [
    path('store/', include('apps.store.urls')),
    path('erp/', include('apps.erp.urls')),
    path('crm/', include('apps.crm.urls')),
    path('security/', include('apps.security.urls')),

    path('blog/', include('apps.blog.urls')),
    path('ai/', include('apps.ai_engine.urls')),
    path('automation/', include('apps.automation.urls')),
    path('accounts/', include('apps.accounts.urls')),
    path('home/', include('apps.home.urls')),
    path('core/', include('apps.core.urls')),
    path('access/', include('apps.access.urls')),
    path('tenants/', include('apps.tenants.urls')),
    path('notifications/', include('apps.notifications.urls')),
        
    # Generic Admin API
    path('admin/metadata/', admin_views.AdminMetadataView.as_view(), name='admin_metadata'),
    path('admin/<str:app_label>/<str:model_name>/', admin_views.AdminModelView.as_view(), name='admin_model_list'),
    path('admin/<str:app_label>/<str:model_name>/<int:pk>/', admin_views.AdminModelView.as_view(), name='admin_model_detail'),
]
