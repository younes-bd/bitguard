from rest_framework import serializers
from apps.sign.domain.models import SignatureRequest
from apps.subscriptions.domain.models import ServiceContract
from apps.helpdesk.domain.models import SLATier, SLABreach
from apps.sales.domain.models import SalesOrder

class SLATierSerializer(serializers.ModelSerializer):
    class Meta:
        model = SLATier
        fields = '__all__'

class ServiceContractSerializer(serializers.ModelSerializer):
    sla_tier_name = serializers.CharField(source='sla_tier.name', read_only=True)
    
    class Meta:
        model = ServiceContract
        fields = '__all__'

class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesOrder
        fields = '__all__'

class SLABreachSerializer(serializers.ModelSerializer):
    contract_title = serializers.CharField(source='contract.client.name', read_only=True)
    
    class Meta:
        model = SLABreach
        fields = '__all__'

class SignatureRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SignatureRequest
        fields = '__all__'

from apps.sales.domain.models import SalesOrderLine
class QuoteLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesOrderLine
        fields = '__all__'
