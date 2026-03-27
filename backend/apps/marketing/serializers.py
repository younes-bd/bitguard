from rest_framework import serializers
from .models import Campaign, CampaignInteraction

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
