import uuid
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.core.models import UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel

class Role(UUIDPrimaryKeyModel, TimeStampedModel):
    """
    RBAC Roles matching core.constants
    """
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class User(AbstractUser, SoftDeleteModel):
    """
    Custom User model for BitGuard using email login.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    
    # We remove username's unique constraint if we use email login, but Django AbstractUser 
    # needs it unless explicitly overriden. We'll keep it but make email the USERNAME_FIELD.
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username'] 

    phone_number = models.CharField(max_length=30, blank=True, help_text="Contact number for notifications/2FA")
    is_verified = models.BooleanField(default=False, help_text="Has email been verified?")
    
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.PROTECT, null=True, blank=True, related_name='users')
    roles = models.ManyToManyField(Role, through='UserRole', related_name='users')

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.email

class UserRole(UUIDPrimaryKeyModel, TimeStampedModel):
    """
    Many-to-Many through model for User and Role.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'role')

class UserProfile(UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel):
    """
    Extended profile information for the User.
    """
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.PROTECT, null=True, blank=True, related_name='profiles')
    
    bio = models.TextField(blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True)
    photo = models.ImageField(upload_to='users/%Y/%m/%d/', blank=True)
    
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    language = models.CharField(max_length=10, default='en-us')
    
    def __str__(self):
        return f'Profile for {self.user.email}'

