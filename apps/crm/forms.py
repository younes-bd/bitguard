from django import forms
from .models import Client, Ticket, Contract

class ContractForm(forms.ModelForm):
    class Meta:
        model = Contract
        fields = ['name', 'start_date', 'end_date', 'value', 'document', 'is_active']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-input w-full', 'placeholder': 'Contract Title (e.g. Annual Service Agreement)'}),
            'start_date': forms.DateInput(attrs={'class': 'form-input w-full', 'type': 'date'}),
            'end_date': forms.DateInput(attrs={'class': 'form-input w-full', 'type': 'date'}),
            'value': forms.NumberInput(attrs={'class': 'form-input w-full', 'step': '0.01'}),
            'document': forms.FileInput(attrs={'class': 'form-input w-full'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-checkbox'}),
        }
