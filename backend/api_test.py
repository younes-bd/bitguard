#!/usr/bin/env python3
import subprocess
import json

# Step 1: Login
login_data = json.dumps({"email": "admin@bitguard.tech", "password": "admin"})
result = subprocess.run(
    ["curl", "-s", "-X", "POST",
     "http://localhost:8000/api/auth/login/",
     "-H", "Content-Type: application/json",
     "-d", login_data],
    capture_output=True, text=True
)

resp = json.loads(result.stdout)
token = resp['data']['access_token']
print("Login SUCCESS, token starts with:", token[:30])

# Step 2: Get categories with X-Tenant-ID: bitguard.tech (simulating the frontend)
result2 = subprocess.run(
    ["curl", "-s",
     "http://localhost:8000/api/itsm/service-categories/",
     "-H", f"Authorization: Bearer {token}",
     "-H", "X-Tenant-ID: bitguard.tech"],
    capture_output=True, text=True
)
data = json.loads(result2.stdout)
print(f"\nCategories (with X-Tenant-ID: bitguard.tech): {len(data)} found")
for c in data:
    print(f"  - {c['name']}")

# Step 3: Get service items with X-Tenant-ID: bitguard.tech
result3 = subprocess.run(
    ["curl", "-s",
     "http://localhost:8000/api/itsm/service-items/",
     "-H", f"Authorization: Bearer {token}",
     "-H", "X-Tenant-ID: bitguard.tech"],
    capture_output=True, text=True
)
items_data = json.loads(result3.stdout)
items = items_data if isinstance(items_data, list) else items_data.get('results', [])
print(f"\nService Items (with X-Tenant-ID: bitguard.tech): {len(items)} found")
for i in items[:5]:
    print(f"  - {i['name']}")
if len(items) > 5:
    print(f"  ... and {len(items)-5} more")
