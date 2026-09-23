from rest_framework import serializers
from apps.campaigns.domain.models import Campaign, MailingList, MailingContact

class MailingListSerializer(serializers.ModelSerializer):
    contact_count = serializers.SerializerMethodField()

    class Meta:
        model = MailingList
        fields = '__all__'
        read_only_fields = ('tenant',)

    def get_contact_count(self, obj):
        return obj.contacts.count()

class MailingContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = MailingContact
        fields = '__all__'
        read_only_fields = ('tenant',)

class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = '__all__'
        read_only_fields = ('tenant', 'state', 'sent_date', 'sent_count')
