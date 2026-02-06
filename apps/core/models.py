from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

# Core app now serves as a utility belt and middleware container.
# All business logic models have been moved to domain-specific apps:
# - Identity -> apps.accounts
# - Identity Access (RBAC) -> apps.access
# - Tenancy -> apps.tenants
# - Notifications -> apps.notifications
