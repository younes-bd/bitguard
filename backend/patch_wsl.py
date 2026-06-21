import sys

with open('/home/youness/website13/backend/apps/core/services/base.py', 'r') as f:
    content = f.read()

new_base = content.replace(
    """    def get_tenant_context(request):
        \"\"\"
        Retrieves the tenant from the request, ensuring it exists for restricted actions.
        \"\"\"
        tenant = getattr(request, 'tenant', None)
        return tenant""",
    """    def get_tenant_context(request):
        tenant = getattr(request, 'tenant', None)
        if not tenant and request and hasattr(request, 'user') and request.user.is_authenticated:
            if hasattr(request.user, 'employee_profile') and request.user.employee_profile.tenant:
                tenant = request.user.employee_profile.tenant
            elif hasattr(request.user, 'tenant') and request.user.tenant:
                tenant = request.user.tenant
        return tenant"""
)

with open('/home/youness/website13/backend/apps/core/services/base.py', 'w') as f:
    f.write(new_base)

print('Patched base.py in WSL')
