import pytest
from rest_framework.test import APIClient
from tests.factories import TenantFactory, UserFactory

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def tenant():
    return TenantFactory()

@pytest.fixture
def admin_user():
    user = UserFactory(is_staff=True, is_superuser=True)
    return user

@pytest.fixture
def standard_user():
    return UserFactory(is_staff=False)

@pytest.fixture
def auth_client(api_client, standard_user):
    api_client.force_authenticate(user=standard_user)
    return api_client

@pytest.fixture
def admin_client(api_client, admin_user):
    api_client.force_authenticate(user=admin_user)
    return api_client
