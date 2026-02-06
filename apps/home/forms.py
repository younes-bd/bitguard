from django import forms
from .models import Signup, WebsiteInquiry



class EmailSignupForm(forms.ModelForm):
    email = forms.EmailField(widget=forms.TextInput(attrs={
        "type": "email",
        "name": "email",
        "id": "email",
        "placeholder": "Type your email address",
    }), label="")

    class Meta:
        model = Signup
        fields = ('email', )


class WebsiteInquiryForm(forms.ModelForm):
    class Meta:
        model = WebsiteInquiry
        fields = ['full_name', 'email', 'subject', 'message']
        widgets = {
            'full_name': forms.TextInput(attrs={'class': 'bitguard-input tw-w-full', 'placeholder': 'John Doe'}),
            'email': forms.EmailInput(attrs={'class': 'bitguard-input tw-w-full', 'placeholder': 'john@company.com'}),
            'subject': forms.TextInput(attrs={'class': 'bitguard-input tw-w-full', 'placeholder': 'Subject'}),
            'message': forms.Textarea(attrs={'class': 'bitguard-input tw-w-full', 'rows': 4, 'placeholder': 'How can we help?'}),
        }


class JoinSessionForm(forms.Form):
    session_code = forms.CharField(
        max_length=6,
        widget=forms.TextInput(attrs={
            'class': 'bitguard-input tw-w-full tw-text-center tw-text-2xl tw-tracking-[0.5em] tw-font-mono tw-uppercase',
            'placeholder': 'XXXXXX',
            'maxlength': '6'
        })
    )

    def clean_session_code(self):
        code = self.cleaned_data.get('session_code')
        # We need to import the model here to check existence
        from apps.tenants.models import RemoteSession
        session = RemoteSession.objects.filter(session_code=code, status='active').first()
        if not session:
            raise forms.ValidationError("Invalid or expired session code.")
        return code
