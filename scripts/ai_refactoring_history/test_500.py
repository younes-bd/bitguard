from django.test import Client
from apps.users.domain.models import User
c = Client()
u = User.objects.first()
if not u:
    print("No user")
else:
    c.force_login(u)
    res = c.get("/api/v1/system/settings/")
    print(f"Status: {res.status_code}")
    if res.status_code == 500:
        print(res.content.decode("utf-8"))
