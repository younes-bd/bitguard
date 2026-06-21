import pytest
from django.urls import reverse

pytestmark = pytest.mark.django_db

class TestDashboardBFF:
    def test_metrics_unauthenticated(self, api_client):
        response = api_client.get('/api/dashboard/metrics/')
        assert response.status_code == 401

    def test_metrics_authenticated(self, admin_client):
        response = admin_client.get('/api/dashboard/metrics/')
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert "executive" in data["data"]
        assert "mrr" in data["data"]["executive"]
        assert "billing" in data["data"]
        assert "active_subscriptions" in data["data"]["billing"]

    def test_health_admin_success(self, admin_client):
        response = admin_client.get('/api/dashboard/health/')
        assert response.status_code == 200

    def test_health_standard_forbidden(self, auth_client):
        response = auth_client.get('/api/dashboard/health/')
        assert response.status_code == 403

    def test_global_search(self, admin_client):
        response = admin_client.get('/api/dashboard/search/?q=test')
        assert response.status_code == 200
        assert "data" in response.json()

