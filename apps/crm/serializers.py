from rest_framework import serializers
from .models import Client, Ticket, Contact, Contract, Project, ActivityLog, Deal, Interaction

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'

class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = '__all__'

class ActivityLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = ActivityLog
        fields = '__all__'

class DealSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.username', read_only=True)
    client_name = serializers.CharField(source='client.name', read_only=True)
    
    class Meta:
        model = Deal
        fields = '__all__'

class InteractionSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Interaction
        fields = '__all__'

class ClientSerializer(serializers.ModelSerializer):
    contacts = ContactSerializer(many=True, read_only=True)
    contracts = ContractSerializer(many=True, read_only=True)
    deals = DealSerializer(many=True, read_only=True)
    interactions = InteractionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Client
        fields = '__all__'

class TicketSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.username', read_only=True)
    
    class Meta:
        model = Ticket
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

from .models import Quote, QuoteItem

class QuoteItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = QuoteItem
        fields = '__all__'

class QuoteSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    items = QuoteItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Quote
        fields = '__all__'
