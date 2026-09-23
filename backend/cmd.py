from apps.users.domain.models import Role
print("ROLES:", list(Role.objects.values()))
