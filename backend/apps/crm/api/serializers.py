from rest_framework import serializers
from ..domain.models import Client, Contact, Lead, Deal, Activity, CrmStage, CrmSalesTeam, LostReason, CrmTag

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'

class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = '__all__'

class DealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deal
        fields = '__all__'

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'

class CrmStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrmStage
        fields = '__all__'

class CrmSalesTeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrmSalesTeam
        fields = '__all__'

class LostReasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = LostReason
        fields = '__all__'

class CrmTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrmTag
        fields = '__all__'
