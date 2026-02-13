from apps.access.models import UserRole

def has_permission(user, perm_code, tenant):
    """
    Checks if a user has a specific permission within a tenant context.
    """
    if not user.is_authenticated or not tenant:
        return False
    
    # Superuser override
    if user.is_superuser:
        return True

    # 1. Check Bundle Entitlement
    # Permission code format: "product.action" (e.g., "crm.view_leads")
    try:
        product_scope = perm_code.split('.')[0]
    except IndexError:
        product_scope = perm_code

    # Check if product is enabled in bundle
    bundle = tenant.bundle
    
    if product_scope not in bundle.products:
        if not bundle.features.get(perm_code, False):
            return False

    # 2. Check Role Assignment
    return UserRole.objects.filter(
        user=user,
        role__tenant=tenant,
        role__permissions__code=perm_code
    ).exists()
