from rest_framework import serializers
from apps.hr_payroll.domain.models import PayrollPeriod, PayrollStructure, SalaryRule, PayslipBatch, Payslip, PayslipLine

class PayrollPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayrollPeriod
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at', 'created_by', 'updated_by')

class PayrollStructureSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayrollStructure
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at', 'created_by', 'updated_by')

class SalaryRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalaryRule
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at', 'created_by', 'updated_by')

class PayslipBatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayslipBatch
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at', 'created_by', 'updated_by')

class PayslipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payslip
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at', 'created_by', 'updated_by')

class PayslipLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayslipLine
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at', 'created_by', 'updated_by')

