from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models

# ==============================================================================
# CORE USER MODEL
# ==============================================================================

class User(AbstractUser):
    """
    Custom User model for BitGuard.
    Extends Django's AbstractUser to allow future scalability.
    """
    phone_number = models.CharField(max_length=30, blank=True, help_text="Contact number for notifications/2FA")
    is_verified = models.BooleanField(default=False, help_text="Has email been verified?")

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.username


# ==============================================================================
# USER PROFILE
# ==============================================================================

class Profile(models.Model):
    """
    Extended profile information for the User.
    One-to-One relationship with User.
    """
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
    ]

    ACCOUNT_TYPE_CHOICES = [
        ('free_trial', 'Free Trial'),
        ('registered', 'Registered Premium')
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    
    # Personal Info
    bio = models.TextField(blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True)
    photo = models.ImageField(upload_to='users/%Y/%m/%d/', blank=True)
    social_link = models.URLField(blank=True)
    
    # Contact & Addressing
    address = models.CharField(max_length=255, blank=True, null=True) # Legacy/Primary
    home_address = models.TextField(blank=True, null=True)
    work_address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    
    # Preferences
    language = models.CharField(max_length=10, default='en-us')
    currency = models.CharField(max_length=10, default='USD')
    
    # Settings & Privacy
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPE_CHOICES, default='free_trial')
    two_factor_auth = models.BooleanField(default=False)
    history_enabled = models.BooleanField(default=True)
    history_enabled = models.BooleanField(default=True)
    ads_enabled = models.BooleanField(default=False)
    password_last_changed = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'Profile for {self.user.username}'



# ==============================================================================
# ADDRESS MANAGEMENT
# ==============================================================================

class Address(models.Model):
    """
    Granular address structure for Home, Work, etc.
    """
    ADDRESS_TYPES = [
        ('home', 'Home Address'),
        ('work', 'Work Address'),
        ('billing', 'Billing Address'),
        ('shipping', 'Shipping Address'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='addresses')
    type = models.CharField(max_length=20, choices=ADDRESS_TYPES, default='home')
    street_address = models.CharField(max_length=255, verbose_name="Street & Number")
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True, null=True, verbose_name="State / Province")
    postal_code = models.CharField(max_length=20, verbose_name="Zip / Postal Code")
    country = models.CharField(max_length=100)
    is_default = models.BooleanField(default=False)
    
    class Meta:
        verbose_name_plural = "Addresses"

    def __str__(self):
        return f"{self.get_type_display()} for {self.user.username}"



# ==============================================================================
# PEOPLE & SHARING
# ==============================================================================

class Connection(models.Model):
    """
    Represents a connection (friend/contact) between two users.
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('blocked', 'Blocked')
    ]

    from_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_connections')
    to_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_connections')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('from_user', 'to_user')

    def __str__(self):
        return f"{self.from_user.username} -> {self.to_user.username} ({self.status})"

class SharedResource(models.Model):
    """
    Represents a resource shared with another user.
    """
    RESOURCE_TYPES = [
        ('file', 'File'),
        ('project', 'Project'),
        ('folder', 'Folder'),
        ('other', 'Other')
    ]
    PERMISSION_CHOICES = [
        ('view', 'Can View'),
        ('edit', 'Can Edit')
    ]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='shared_by_me')
    shared_with = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='shared_with_me')
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES)
    resource_id = models.CharField(max_length=100) # ID/Reference to external item
    resource_name = models.CharField(max_length=255) # Display name
    permission = models.CharField(max_length=10, choices=PERMISSION_CHOICES, default='view')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.resource_name} shared with {self.shared_with.username}"


# ==============================================================================
# SECURITY & AUTHENTICATION
# ==============================================================================

class Device(models.Model):
    """
    Tracks devices used to log in for security monitoring.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='devices')
    fingerprint = models.CharField(max_length=255, help_text="Unique hash of device properties")
    name = models.CharField(max_length=100, default="Unknown Device")
    last_login = models.DateTimeField(auto_now=True)
    is_trusted = models.BooleanField(default=False)
    is_blocked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.user.username})"


class LoginActivity(models.Model):
    """
    Audit log of login attempts.
    """
    STATUS_CHOICES = [
        ('success', 'Success'),
        ('failed', 'Failed')
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='login_activities')
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Login Activities"
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user.username} - {self.status} - {self.timestamp}"


class OTP(models.Model):
    """
    One-Time Passwords for Email Verification and 2FA.
    """
    TYPE_CHOICES = [
        ('email', 'Email Verification'),
        ('2fa', 'Two-Factor Auth')
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='otps')
    code = models.CharField(max_length=6)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.type} code for {self.user.username}"
