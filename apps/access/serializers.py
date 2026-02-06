from rest_framework import serializers
from .models import Permission, Role, UserRole

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'

class RoleSerializer(serializers.ModelSerializer):
    permissions = serializers.SlugRelatedField(
        many=True, 
        slug_field='code', 
        queryset=Permission.objects.all()
    )

    class Meta:
        model = Role
        fields = ['id', 'name', 'permissions', 'tenant']
        read_only_fields = ['tenant']
