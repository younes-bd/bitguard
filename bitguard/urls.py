from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [

    path('api/', include('apps.api.urls')),
    path('admin/', admin.site.urls),
    path('login/', auth_views.LoginView.as_view(template_name='accounts/login.html'), name='login'),

    path('security/', include('apps.security.urls')),
    path('', include('apps.home.urls')),
    path('accounts/', include('apps.accounts.urls')),
    path('store/', include('apps.store.urls')),
    path('crm/', include('apps.crm.urls')),
    #path('platform/', include('apps.platform.urls')),
    path('blog/', include('apps.blog.urls')),
    path('ai/', include('apps.ai_engine.urls')),
    path('automation/', include('apps.automation.urls')),
    path('erp/', include('apps.erp.urls')),

    #path('api/auth/', include('apps.accounts.auth_urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
