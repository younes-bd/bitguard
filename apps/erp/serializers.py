from rest_framework import serializers
from .models import (
    InternalProject, Task, OperationKPI, Asset, Service, Milestone,
    EmployeeProfile, TimeLog, Vendor, VendorContract,
    Invoice, InvoiceItem, Expense, VendorBill,
    RiskRegister, ComplianceItem, Policy, Integration
)

class OperationKPISerializer(serializers.ModelSerializer):
    class Meta:
        model = OperationKPI
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.CharField(source='assigned_to.username', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)
    
    class Meta:
        model = Task
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    milestones = MilestoneSerializer(many=True, read_only=True)
    client_name = serializers.CharField(source='client.name', read_only=True)
    
    class Meta:
        model = InternalProject
        fields = '__all__'

class AssetSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.CharField(source='assigned_to_user.username', read_only=True)
    
    class Meta:
        model = Asset
        fields = '__all__'

# Workforce
class EmployeeProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = EmployeeProfile
        fields = '__all__'

class TimeLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    task_title = serializers.CharField(source='task.title', read_only=True)
    
    class Meta:
        model = TimeLog
        fields = '__all__'

# Vendors
class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = '__all__'

class VendorContractSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source='vendor.name', read_only=True)
    
    class Meta:
        model = VendorContract
        fields = '__all__'

# Financials
class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True)
    client_name = serializers.CharField(source='client.name', read_only=True)
    
    class Meta:
        model = Invoice
        fields = '__all__'
        read_only_fields = ['invoice_number'] # Auto-generated

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        # Auto-generate unique number
        import uuid
        validated_data['invoice_number'] = f"INV-{uuid.uuid4().hex[:8].upper()}"
        
        invoice = Invoice.objects.create(**validated_data)
        for item_data in items_data:
            InvoiceItem.objects.create(invoice=invoice, **item_data)
        
        # Trigger total calculation
        invoice.save()
        return invoice

class ExpenseSerializer(serializers.ModelSerializer):
    submitted_by_name = serializers.CharField(source='submitted_by.username', read_only=True)
    
    class Meta:
        model = Expense
        fields = '__all__'

class VendorBillSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source='vendor.name', read_only=True)
    
    class Meta:
        model = VendorBill
        fields = '__all__'

# Compliance & System
class RiskRegisterSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.username', read_only=True)
    
    class Meta:
        model = RiskRegister
        fields = '__all__'

class ComplianceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplianceItem
        fields = '__all__'

class PolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = Policy
        fields = '__all__'

class IntegrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Integration
        fields = '__all__'