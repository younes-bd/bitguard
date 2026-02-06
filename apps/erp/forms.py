from django import forms
from .models import Expense, VendorBill, Asset, Vendor, VendorContract, RiskRegister, ComplianceItem, Policy, EmployeeProfile, Invoice, InvoiceItem, Service, TimeLog, Integration, Task

class ExpenseForm(forms.ModelForm):
    class Meta:
        model = Expense
        fields = ['description', 'category', 'amount', 'date', 'project', 'receipt', 'status']
        widgets = {
            'description': forms.TextInput(attrs={'class': 'form-input w-full', 'placeholder': 'Expense description'}),
            'category': forms.Select(attrs={'class': 'form-input w-full'}),
            'amount': forms.NumberInput(attrs={'class': 'form-input w-full', 'step': '0.01'}),
            'date': forms.DateInput(attrs={'class': 'form-input w-full', 'type': 'date'}),
            'project': forms.Select(attrs={'class': 'form-input w-full'}),
            'receipt': forms.FileInput(attrs={'class': 'form-input w-full'}),
            'status': forms.Select(attrs={'class': 'form-input w-full'}),
        }

class VendorBillForm(forms.ModelForm):
    class Meta:
        model = VendorBill
        fields = ['vendor', 'bill_number', 'amount', 'issue_date', 'due_date', 'attachment', 'status', 'notes']
        widgets = {
            'vendor': forms.Select(attrs={'class': 'form-input w-full'}),
            'bill_number': forms.TextInput(attrs={'class': 'form-input w-full'}),
            'amount': forms.NumberInput(attrs={'class': 'form-input w-full', 'step': '0.01'}),
            'issue_date': forms.DateInput(attrs={'class': 'form-input w-full', 'type': 'date'}),
            'due_date': forms.DateInput(attrs={'class': 'form-input w-full', 'type': 'date'}),
            'attachment': forms.FileInput(attrs={'class': 'form-input w-full'}),
            'status': forms.Select(attrs={'class': 'form-input w-full'}),
            'notes': forms.Textarea(attrs={'class': 'form-input w-full', 'rows': 3}),
        }

class AssetForm(forms.ModelForm):
    class Meta:
        model = Asset
        fields = ['name', 'asset_tag', 'asset_type', 'serial_number', 'status', 'assigned_to_user', 'assigned_to_client', 'purchase_date', 'warranty_expiry', 'notes']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-input w-full', 'placeholder': 'Asset Name (e.g. MacBook Pro)'}),
            'asset_tag': forms.TextInput(attrs={'class': 'form-input w-full', 'placeholder': 'TAG-001'}),
            'asset_type': forms.Select(attrs={'class': 'form-input w-full'}),
            'serial_number': forms.TextInput(attrs={'class': 'form-input w-full'}),
            'status': forms.Select(attrs={'class': 'form-input w-full'}),
            'assigned_to_user': forms.Select(attrs={'class': 'form-input w-full'}),
            'assigned_to_client': forms.Select(attrs={'class': 'form-input w-full'}),
            'purchase_date': forms.DateInput(attrs={'class': 'form-input w-full', 'type': 'date'}),
            'warranty_expiry': forms.DateInput(attrs={'class': 'form-input w-full', 'type': 'date'}),
            'notes': forms.Textarea(attrs={'class': 'form-input w-full', 'rows': 3}),
        }

class VendorForm(forms.ModelForm):
    class Meta:
        model = Vendor
        fields = ['name', 'contact_name', 'email', 'phone', 'website', 'service_provided']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-input w-full', 'placeholder': 'Vendor Company Name'}),
            'contact_name': forms.TextInput(attrs={'class': 'form-input w-full', 'placeholder': 'Primary Contact Person'}),
            'email': forms.EmailInput(attrs={'class': 'form-input w-full', 'placeholder': 'contact@vendor.com'}),
            'phone': forms.TextInput(attrs={'class': 'form-input w-full', 'placeholder': '+1 (555) ...'}),
            'website': forms.URLInput(attrs={'class': 'form-input w-full', 'placeholder': 'https://...'}),
            'service_provided': forms.TextInput(attrs={'class': 'form-input w-full', 'placeholder': 'e.g. Cloud Hosting, Office Supplies'}),
        }


class VendorContractForm(forms.ModelForm):
    class Meta:
        model = VendorContract
        fields = ['vendor', 'name', 'start_date', 'end_date', 'value', 'document', 'auto_renew']
        widgets = {
            'vendor': forms.Select(attrs={'class': 'form-input w-full'}),
            'name': forms.TextInput(attrs={'class': 'form-input w-full', 'placeholder': 'Contract Title (e.g. Annual MSA)'}),
            'start_date': forms.DateInput(attrs={'class': 'form-input w-full', 'type': 'date'}),
            'end_date': forms.DateInput(attrs={'class': 'form-input w-full', 'type': 'date'}),
            'value': forms.NumberInput(attrs={'class': 'form-input w-full', 'step': '0.01'}),
            'document': forms.FileInput(attrs={'class': 'form-input w-full'}),
            'auto_renew': forms.CheckboxInput(attrs={'class': 'form-checkbox'}),
        }

class RiskForm(forms.ModelForm):
    class Meta:
        model = RiskRegister
        fields = ['summary', 'description', 'probability', 'impact', 'mitigation_plan', 'owner', 'status']
        widgets = {
            'summary': forms.TextInput(attrs={'class': 'form-input w-full'}),
            'description': forms.Textarea(attrs={'class': 'form-input w-full', 'rows': 3}),
            'probability': forms.Select(attrs={'class': 'form-input w-full'}),
            'impact': forms.Select(attrs={'class': 'form-input w-full'}),
            'mitigation_plan': forms.Textarea(attrs={'class': 'form-input w-full', 'rows': 3}),
            'owner': forms.Select(attrs={'class': 'form-input w-full'}),
            'status': forms.Select(attrs={'class': 'form-input w-full'}),
        }

class ComplianceItemForm(forms.ModelForm):
    class Meta:
        model = ComplianceItem
        fields = ['framework', 'control_id', 'description', 'status', 'evidence_link', 'last_audit_date', 'next_audit_date']
        widgets = {
            'framework': forms.TextInput(attrs={'class': 'form-input w-full'}),
            'control_id': forms.TextInput(attrs={'class': 'form-input w-full'}),
            'description': forms.Textarea(attrs={'class': 'form-input w-full', 'rows': 3}),
            'status': forms.Select(attrs={'class': 'form-input w-full'}),
            'evidence_link': forms.URLInput(attrs={'class': 'form-input w-full'}),
            'last_audit_date': forms.DateInput(attrs={'class': 'form-input w-full', 'type': 'date'}),
            'next_audit_date': forms.DateInput(attrs={'class': 'form-input w-full', 'type': 'date'}),
        }

class TimeLogForm(forms.ModelForm):
    class Meta:
        model = TimeLog
        fields = ['task', 'hours', 'date', 'notes']
        widgets = {
            'task': forms.Select(attrs={'class': 'form-input w-full'}),
            'hours': forms.NumberInput(attrs={'class': 'form-input w-full', 'step': '0.25'}),
            'date': forms.DateInput(attrs={'class': 'form-input w-full', 'type': 'date'}),
            'notes': forms.Textarea(attrs={'class': 'form-input w-full', 'rows': 2}),
        }

class PolicyForm(forms.ModelForm):
    class Meta:
        model = Policy
        fields = ['title', 'version', 'status', 'owner', 'content', 'document', 'last_review_date', 'next_review_date']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-input w-full'}),
            'version': forms.TextInput(attrs={'class': 'form-input w-full'}),
            'status': forms.Select(attrs={'class': 'form-input w-full'}),
            'owner': forms.Select(attrs={'class': 'form-input w-full'}),
            'content': forms.Textarea(attrs={'class': 'form-input w-full', 'rows': 10}), # Markdown content
            'document': forms.FileInput(attrs={'class': 'form-input w-full'}),
            'last_review_date': forms.DateInput(attrs={'class': 'form-input w-full', 'type': 'date'}),
            'next_review_date': forms.DateInput(attrs={'class': 'form-input w-full', 'type': 'date'}),
        }

class EmployeeForm(forms.ModelForm):
    class Meta:
        model = EmployeeProfile
        fields = ['job_title', 'department', 'seniority', 'location', 'phone', 'start_date', 'skills', 'is_available', 'current_load', 'internal_cost_rate']
        widgets = {
            'job_title': forms.TextInput(attrs={'class': 'form-input w-full', 'placeholder': 'e.g. Senior Product Designer'}),
            'department': forms.Select(attrs={'class': 'form-input w-full'}),
            'seniority': forms.Select(attrs={'class': 'form-input w-full'}),
            'location': forms.TextInput(attrs={'class': 'form-input w-full', 'placeholder': 'e.g. Remote, NYC'}),
            'phone': forms.TextInput(attrs={'class': 'form-input w-full'}),
            'start_date': forms.DateInput(attrs={'class': 'form-input w-full', 'type': 'date'}),
            'skills': forms.Textarea(attrs={'class': 'form-input w-full', 'rows': 2, 'placeholder': 'Python, Django, React...'}),
            'is_available': forms.CheckboxInput(attrs={'class': 'form-checkbox'}),
            'current_load': forms.NumberInput(attrs={'class': 'form-input w-full', 'min': 0, 'max': 100}),
            'internal_cost_rate': forms.NumberInput(attrs={'class': 'form-input w-full', 'step': '0.01'}),
        }


class InvoiceForm(forms.ModelForm):
    class Meta:
        model = Invoice
        fields = ['client', 'project', 'invoice_number', 'status', 'issue_date', 'due_date', 'notes']
        widgets = {
            'client': forms.Select(attrs={'class': 'form-input w-full'}),
            'project': forms.Select(attrs={'class': 'form-input w-full'}),
            'invoice_number': forms.TextInput(attrs={'class': 'form-input w-full'}),
            'status': forms.Select(attrs={'class': 'form-input w-full'}),
            'issue_date': forms.DateInput(attrs={'class': 'form-input w-full', 'type': 'date'}),
            'due_date': forms.DateInput(attrs={'class': 'form-input w-full', 'type': 'date'}),
            'notes': forms.Textarea(attrs={'class': 'form-input w-full', 'rows': 3}),
        }

class InvoiceItemForm(forms.ModelForm):
    class Meta:
        model = InvoiceItem
        fields = ['description', 'quantity', 'unit_price']
        widgets = {
            'description': forms.TextInput(attrs={'class': 'form-input w-full', 'placeholder': 'Item Description'}),
            'quantity': forms.NumberInput(attrs={'class': 'form-input w-full item-qty', 'step': '0.1'}),
            'unit_price': forms.NumberInput(attrs={'class': 'form-input w-full item-price', 'step': '0.01'}),
        }

InvoiceItemFormSet = forms.inlineformset_factory(
    Invoice, InvoiceItem, form=InvoiceItemForm,
    extra=1, can_delete=True
)

class ServiceForm(forms.ModelForm):
    class Meta:
        model = Service
        fields = ['name', 'description', 'is_active']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-input w-full', 'placeholder': 'Service Name (e.g. Cloud Migration)'}),
            'description': forms.Textarea(attrs={'class': 'form-input w-full', 'rows': 3}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-checkbox'}),
        }

class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'description', 'project', 'assigned_to', 'status', 'priority', 'due_date']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-input w-full', 'placeholder': 'Task Title'}),
            'description': forms.Textarea(attrs={'class': 'form-input w-full', 'rows': 3}),
            'project': forms.Select(attrs={'class': 'form-input w-full'}),
            'assigned_to': forms.Select(attrs={'class': 'form-input w-full'}),
            'status': forms.Select(attrs={'class': 'form-input w-full'}),
            'priority': forms.Select(attrs={'class': 'form-input w-full'}),
            'due_date': forms.DateInput(attrs={'class': 'form-input w-full', 'type': 'date'}),
        }

class IntegrationForm(forms.ModelForm):
    class Meta:
        model = Integration
        fields = ['api_key', 'webhook_url', 'is_active']
        widgets = {
            'api_key': forms.PasswordInput(attrs={'class': 'form-input w-full', 'placeholder': 'sk_live_...'}),
            'webhook_url': forms.URLInput(attrs={'class': 'form-input w-full', 'placeholder': 'https://...'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-checkbox'}),
        }
        help_texts = {
            'api_key': 'Your secret API key or access token.',
            'webhook_url': 'Endpoint where we send event payloads.',
        }
