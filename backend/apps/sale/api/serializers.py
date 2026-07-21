from rest_framework import serializers
from ..domain.models import SaleOrder, SaleOrderLine, SalesTeam, Pricelist, QuotationTemplate

class SalesTeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesTeam
        fields = '__all__'
        read_only_fields = ('tenant',)

class PricelistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pricelist
        fields = '__all__'
        read_only_fields = ('tenant',)

class QuotationTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuotationTemplate
        fields = '__all__'
        read_only_fields = ('tenant',)


class SaleOrderLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleOrderLine
        fields = '__all__'
        read_only_fields = ('tenant',)

class SaleOrderSerializer(serializers.ModelSerializer):
    lines = SaleOrderLineSerializer(many=True, required=False)
    client_name = serializers.CharField(source='client.name', read_only=True)

    class Meta:
        model = SaleOrder
        fields = '__all__'
        read_only_fields = ('tenant', 'order_number')

    def create(self, validated_data):
        lines_data = validated_data.pop('lines', [])
        order = super().create(validated_data)
        for line_data in lines_data:
            SaleOrderLine.objects.create(order=order, tenant=order.tenant, **line_data)
        return order

    def update(self, instance, validated_data):
        lines_data = validated_data.pop('lines', None)
        instance = super().update(instance, validated_data)
        if lines_data is not None:
            instance.lines.all().delete()
            for line_data in lines_data:
                SaleOrderLine.objects.create(order=instance, tenant=instance.tenant, **line_data)
        return instance
