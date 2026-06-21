from django.urls import path, include

urlpatterns = [
    # Commerce
    path('store/', include('apps.store.api.urls')),
    path('billing/', include('apps.billing.api.urls')),
    path('accounting/', include('apps.accounting.api.urls')),  # ← FIXED: was missing!
    path('sale/', include('apps.sale.api.urls')),

    # Customer & Sales
    path('crm/', include('apps.crm.api.urls')),
    path('contracts/', include('apps.contracts.api.urls')),
    path('support/', include('apps.support.api.urls')),

    # Security Platform
    path('security/', include('apps.soc.api.urls')),

    # Operations
    path('hrm/', include('apps.hrm.api.urls')),
    path('purchase/', include('apps.purchase.api.urls')),
    path('inventory/', include('apps.inventory.api.urls')),
    path('projects/', include('apps.projects.api.urls')),
    path('assets/', include('apps.assets.api.urls')),      # Generic Asset Management
    path('approvals/', include('apps.approvals.api.urls')),
    path('edms/', include('apps.edms.api.urls')),
    path('services/', include('apps.services.api.urls')),

    # Platform Infrastructure
    path('auth/', include('apps.auth.api.urls')),
    path('core/', include('apps.core.api.urls')),
    path('iam/', include('apps.users.api.urls')),
    path('tenants/', include('apps.tenants.api.urls')),
    path('notifications/', include('apps.notifications.api.urls')),
    path('audit/', include('apps.audit.api.urls')),
    path('sysadmin/', include('apps.sysadmin.api.urls')),

    # Intelligence, Reports & Marketing
    path('dashboard/', include('apps.dashboard.api.urls')),
    path('reporting/', include('apps.reporting.api.urls')),
    path('marketing/', include('apps.marketing.api.urls')),
    path('cms/', include('apps.cms.api.urls')),
    path('home/', include('apps.website.api.urls')),
    path('portal/', include('apps.portal.api.urls')),

    # Integrations
    path('blog/', include('apps.blog.api.urls')),
    path('ai/', include('integrations.ai_engine.urls')),
]

