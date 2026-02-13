from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Profile, LoginActivity, Device, OTP, Address, Connection, SharedResource

User = get_user_model()

class ConnectionSerializer(serializers.ModelSerializer):
    """
    Serializer for connections. Expands user details.
    """
    class Meta:
        model = Connection
        fields = ('id', 'from_user', 'to_user', 'status', 'created_at')
        read_only_fields = ('from_user', 'created_at')

    def to_representation(self, instance):
        """
        Expand user info depending on who is viewing.
        If I am from_user, show to_user info.
        """
        rep = super().to_representation(instance)
        request = self.context.get('request')
        if request and request.user == instance.from_user:
            other_user = instance.to_user
        else:
            other_user = instance.from_user # Assuming if I am to_user, I see from_user
        
        # Simple expansion
        rep['user_details'] = {
            'id': other_user.id,
            'username': other_user.username,
            'email': other_user.email,
            'photo': other_user.profile.photo.url if other_user.profile.photo else None
            # Add more specific logic if needed
        }
        return rep

class SharedResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedResource
        fields = ('id', 'owner', 'shared_with', 'resource_type', 'resource_id', 'resource_name', 'permission', 'created_at')
        read_only_fields = ('owner', 'created_at')
        
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['shared_with_email'] = instance.shared_with.email
        rep['owner_email'] = instance.owner.email
        return rep

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ('id', 'type', 'street_address', 'city', 'state', 'postal_code', 'country', 'is_default')

class UserSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(source='profile.photo', read_only=True)
    permissions = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'is_verified', 'photo', 'addresses', 'is_staff', 'is_superuser', 'permissions')
        read_only_fields = ('is_verified', 'is_staff', 'is_superuser')

    def get_permissions(self, obj):
        if obj.is_superuser:
            return [] # Superuser has all, but frontend checks is_superuser flag first. 
                      # We could return all valid strings if we wanted to be explicit, 
                      # but avoiding the DB hit is better if frontend handles is_superuser.
        
        # Get all permissions (group + direct)
        # Format: "app_label.codename"
        perms = obj.get_all_permissions()
        # Return just the codename to match frontend menu.js config (e.g. 'view_product')
        return [p.split('.')[-1] for p in perms]

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    addresses = AddressSerializer(many=True, read_only=True, source='user.addresses')
    subscriptions = serializers.SerializerMethodField()
    
    class Meta:
        model = Profile
        # Note: Deprecating old address fields in favor of 'addresses'
        fields = ('username', 'bio', 'date_of_birth', 'gender', 'addresses', 'social_link', 'account_type', 'two_factor_auth', 'history_enabled', 'ads_enabled', 'subscriptions', 'password_last_changed')
        read_only_fields = ('account_type',)

    def get_subscriptions(self, obj):
        try:
            # Return list of active/trial subscriptions
            subs = obj.user.subscriptions.all()
            return [{
                "productId": sub.plan.slug, # Mapping plan slug to productId (e.g. 'soc')
                "plan": sub.plan.name,
                "status": sub.status,
                "expires_at": sub.current_period_end,
                "is_active": sub.is_valid
            } for sub in subs]
        except Exception:
            return []

class LoginActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginActivity
        fields = '__all__'
        read_only_fields = ('user', 'ip_address', 'user_agent', 'status', 'timestamp')

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'
        read_only_fields = ('user', 'fingerprint', 'last_login')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        # Create empty profile
        Profile.objects.create(user=user)
        return user

class OTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTP
        fields = ('code', 'type', 'expires_at')
        read_only_fields = ('code', 'expires_at')

class VerifyOTPSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=6)
    type = serializers.ChoiceField(choices=[('email', 'Email'), ('2fa', '2FA')])

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is not correct")
        return value
