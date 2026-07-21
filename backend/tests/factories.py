import factory
from django.utils import timezone
from faker import Faker

fake = Faker()

class TenantFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'tenants.Tenant'

    name = factory.Faker('company')
    domain = factory.LazyAttribute(lambda o: f"{o.name.replace(' ', '').lower()}.bitguard.tech")
    is_active = True
    created_at = factory.LazyFunction(timezone.now)

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'users.User'

    username = factory.Faker('user_name')
    email = factory.Faker('email')
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    is_active = True

    @factory.post_generation
    def password(self, create, extracted, **kwargs):
        password = extracted if extracted else "TestPass123!"
        self.set_password(password)

class ClientFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'crm.Client'

    tenant = factory.SubFactory(TenantFactory)
    name = factory.Faker('company')
    status = 'active'
    industry = factory.Faker('word')

class DealFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'crm.Deal'

    tenant = factory.SubFactory(TenantFactory)
    client = factory.SubFactory(ClientFactory)
    title = factory.Faker('sentence', nb_words=4)
    amount = factory.Faker('pydecimal', left_digits=5, right_digits=2, positive=True)
    stage = 'prospect'
