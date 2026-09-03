from rest_framework import serializers
from ..domain.models import Campaign, CampaignInteraction

class CampaignInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignInteraction
        fields = ['id', 'campaign', 'lead', 'interaction_type', 'details', 'created_at']
        read_only_fields = ['id', 'created_at']

class CampaignSerializer(serializers.ModelSerializer):
    interactions_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Campaign
        fields = [
            'id', 'name', 'description', 'status', 'start_date', 'end_date', 
            'budget', 'tenant', 'created_by', 'created_at', 'updated_at',
            'interactions_count'
        ]
        read_only_fields = ['id', 'tenant', 'created_by', 'created_at', 'updated_at', 'interactions_count']

from ..domain.models import MassMailing, SocialPost, SMSCampaign, Event, Survey

class MassMailingSerializer(serializers.ModelSerializer):
    class Meta:
        model = MassMailing
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class SocialPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialPost
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class SMSCampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = SMSCampaign
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']

class SurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = Survey
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'tenant']
