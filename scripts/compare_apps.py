import os

backend_apps = set(os.listdir('backend/apps'))
frontend_apps = set(os.listdir('frontend/src/apps'))

print("--- ONLY IN BACKEND ---")
for app in sorted(backend_apps - frontend_apps):
    print(app)

print("\n--- ONLY IN FRONTEND ---")
for app in sorted(frontend_apps - backend_apps):
    print(app)

print("\n--- IN BOTH ---")
for app in sorted(backend_apps & frontend_apps):
    print(app)
