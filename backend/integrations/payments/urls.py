from django.urls import path, include

urlpatterns = [
    path('', include('integrations.payments.api.urls')),
]
