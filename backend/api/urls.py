from django.urls import path, include

urlpatterns = [
    # Commerce
    path('store/', include('apps.store.urls')),
    path('billing/', include('apps.billing.urls')),
    path('erp/', include('apps.erp.urls')),

    # Customer & Sales
    path('crm/', include('apps.crm.urls')),
    path('contracts/', include('apps.contracts.urls')),
    path('support/', include('apps.support.urls')),

    # Security Platform
    path('security/', include('apps.soc.urls')),

    # Operations
    path('hrm/', include('apps.hrm.urls')),
    path('scm/', include('apps.scm.urls')),
    path('projects/', include('apps.projects.urls')),
    path('itam/', include('apps.itam.urls')),      # IT Asset Management

    # Platform Infrastructure
    path('auth/', include('apps.auth.urls')),
    path('core/', include('apps.core.urls')),
    path('users/', include('apps.users.urls')),
    path('tenants/', include('apps.tenants.urls')),
    path('notifications/', include('apps.notifications.urls')),
    path('audit/', include('apps.audit.urls')),
    path('sysadmin/', include('apps.sysadmin.urls')),

    # Intelligence, Reports & Marketing
    path('dashboard/', include('apps.dashboard.urls')),
    path('reports/', include('apps.reports.urls')),
    path('marketing/', include('apps.marketing.urls')),
    path('home/', include('apps.website.urls')),

    # Integrations
    path('blog/', include('integrations.blog.urls')),
    path('ai/', include('integrations.ai_engine.urls')),
]
