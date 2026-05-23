from decimal import Decimal
from django.test import TestCase
from apps.tenants.models import Tenant
from apps.scm.models import InventoryItem, Vendor
from apps.scm.serializers import InventoryItemSerializer


class InventoryItemSerializerTestCase(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(name="Test Tenant", domain="test.com")

    def test_deserialization_mapping(self):
        """Test that frontend fields (name, unit_price) correctly map to backend fields on save."""
        data = {
            'name': 'Cyber Shield Firewall',
            'sku': 'CSF-1000',
            'quantity_on_hand': 15,
            'reorder_level': 5,
            'unit_price': '299.99',
        }
        serializer = InventoryItemSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        
        item = serializer.save(tenant=self.tenant)
        
        self.assertEqual(item.product_name, 'Cyber Shield Firewall')
        self.assertEqual(item.sku, 'CSF-1000')
        self.assertEqual(item.quantity_on_hand, 15)
        self.assertEqual(item.reorder_level, 5)
        self.assertEqual(item.unit_cost, Decimal('299.99'))

    def test_serialization_mapping(self):
        """Test that backend fields correctly serialize to frontend fields."""
        item = InventoryItem.objects.create(
            tenant=self.tenant,
            product_name='Cyber Shield Firewall',
            sku='CSF-1000',
            quantity_on_hand=15,
            reorder_level=5,
            unit_cost=Decimal('299.99')
        )
        
        serializer = InventoryItemSerializer(item)
        data = serializer.data
        
        self.assertEqual(data['name'], 'Cyber Shield Firewall')
        self.assertEqual(data['unit_price'], '299.99')
        self.assertNotIn('product_name', data)
        self.assertNotIn('unit_cost', data)
