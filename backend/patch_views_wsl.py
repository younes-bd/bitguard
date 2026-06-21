import sys

with open('/home/youness/website13/backend/apps/itsm/api/views.py', 'r') as f:
    content = f.read()

new_content = content.replace(
    """    def get_queryset(self):
        qs = super().get_queryset()
        tenant = ITSMService.get_tenant_context(self.request)
        return qs.filter(tenant=tenant, is_active=True)""",
    """    def get_queryset(self):
        qs = super().get_queryset()
        return qs"""
)

new_content = new_content.replace(
    """    def get_queryset(self):
        qs = super().get_queryset()
        tenant = ITSMService.get_tenant_context(self.request)
        qs = qs.filter(tenant=tenant)""",
    """    def get_queryset(self):
        qs = super().get_queryset()"""
)

new_content = new_content.replace(
    """    def get_queryset(self):
        qs = super().get_queryset()
        tenant = ITSMService.get_tenant_context(self.request)
        return qs.filter(tenant=tenant)""",
    """    def get_queryset(self):
        qs = super().get_queryset()
        return qs"""
)

with open('/home/youness/website13/backend/apps/itsm/api/views.py', 'w') as f:
    f.write(new_content)

print('Patched views.py in WSL')
