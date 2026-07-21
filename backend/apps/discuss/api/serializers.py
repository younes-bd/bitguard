from rest_framework import serializers
from apps.discuss.domain.models import Channel, Message, LiveChatChannel

class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

class LiveChatChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiveChatChannel
        fields = '__all__'

