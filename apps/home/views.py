from django.db.models import Count, Q
from django.contrib import messages
from django.conf import settings
from django.http import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404, redirect, reverse
from django.views.generic import View
from .forms import EmailSignupForm, WebsiteInquiryForm, JoinSessionForm
from .models import Signup, Announcement
import json
import requests


from .services_data import SERVICES

def landing(request):
    return render(request, 'home/landing.html')

def service_detail(request, service_slug):
    from .models import Service
    service = get_object_or_404(Service, slug=service_slug)
    
    context = {
        'service': service,
        'slug': service_slug
    }
    return render(request, 'home/service_detail.html', context)


def about(request):
    return render(request, 'home/about.html')

def contact(request):
    if request.method == 'POST':
        form = WebsiteInquiryForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your message has been sent successfully!')
            return redirect('contact')
    else:
        form = WebsiteInquiryForm()
    return render(request, 'home/contact.html', {'form': form})

from django import forms
class SupportForm(forms.Form):
    full_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'bitguard-input tw-w-full', 'placeholder': 'John Doe'}))
    email = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'bitguard-input tw-w-full', 'placeholder': 'john@company.com'}))
    subject = forms.CharField(widget=forms.TextInput(attrs={'class': 'bitguard-input tw-w-full', 'placeholder': 'Issue Summary'}))
    message = forms.CharField(widget=forms.Textarea(attrs={'class': 'bitguard-input tw-w-full', 'rows': 4, 'placeholder': 'Describe your issue...'}))

def support(request):
    if request.method == 'POST':
        form = SupportForm(request.POST)
        if form.is_valid():
            # Create/Get Client in CRM
            from apps.crm.models import Client, Ticket, Contact
            
            cleaned = form.cleaned_data
            email = cleaned.get('email')
            full_name = cleaned.get('full_name')
            
            # Check if Contact exists
            contact = Contact.objects.filter(email=email).first()
            
            if contact:
                client = contact.client
            else:
                # Create new Client and Contact
                client, created = Client.objects.get_or_create(
                    name=full_name, # Use full name as Client name for individuals
                    defaults={
                        'client_type': 'individual',
                        'status': 'lead'
                    }
                )
                
                Contact.objects.create(
                    client=client,
                    email=email,
                    first_name=full_name.split(' ')[0],
                    last_name=' '.join(full_name.split(' ')[1:]) if ' ' in full_name else '',
                    role='Primary Contact',
                    is_primary=True
                )
            
            # Create Ticket in CRM
            Ticket.objects.create(
                client=client,
                subject=cleaned.get('subject'),
                description=cleaned.get('message'), # Changed from message to description to match CRM Ticket model
                status='open'
            )
            
            messages.success(request, 'Your ticket has been submitted successfully! We will contact you shortly.')
            return redirect('support')
    else:
        form = SupportForm()

    return render(request, 'home/support.html', {'form': form})

def remote_session(request):
    """
    View to handle entering a session code for remote support.
    """
    if request.method == 'POST':
        form = JoinSessionForm(request.POST)
        if form.is_valid():
            session_code = form.cleaned_data.get('session_code')
            
            # Update session status
            try:
                from apps.tenants.models import RemoteSession
                from django.utils import timezone
                session = RemoteSession.objects.get(session_code=session_code)
                session.status = 'connected'
                session.connected_at = timezone.now()
                session.client_ip = request.META.get('REMOTE_ADDR')
                session.save()
                
                return render(request, 'home/session_success.html', {'session_code': session_code})
            except RemoteSession.DoesNotExist:
                # Should be caught by form clean validation, but safety check
                messages.error(request, 'Session not found.')
    else:
        form = JoinSessionForm()
    
    return render(request, 'home/session_join.html', {'form': form})

def generate_session(request):
    """
    View for technicians to generate a new session code.
    """
    if not request.user.is_staff:
        messages.error(request, "Access denied. Technician account required.")
        return redirect('support')

    code = None
    if request.method == 'POST':
        import random
        import string
        from apps.tenants.models import RemoteSession
        
        # Generate random 6-digit code
        new_code = ''.join(random.choices(string.digits, k=6))
        
        RemoteSession.objects.create(
            session_code=new_code,
            technician=request.user,
            status='active'
        )
        code = new_code
        messages.success(request, f"New Session Generated: {code}")

    return render(request, 'home/session_generate.html', {'code': code})

def team(request):
    return render(request, 'home/team.html')

def careers(request):
    return render(request, 'home/careers.html')

def managed_it(request):
    return render(request, 'managed_it.html')

def cybersecurity(request):
    return render(request, 'cybersecurity.html')

def cloud(request):
    return render(request, 'cloud.html')

def vciso(request):
    return render(request, 'vciso.html')


MAILCHIMP_API_KEY = settings.MAILCHIMP_API_KEY
MAILCHIMP_DATA_CENTER = settings.MAILCHIMP_DATA_CENTER
MAILCHIMP_EMAIL_LIST_ID = settings.MAILCHIMP_EMAIL_LIST_ID

api_url = 'https://{dc}.api.mailchimp.com/3.0'.format(dc=MAILCHIMP_DATA_CENTER)
members_endpoint = '{api_url}/lists/{list_id}/members'.format(
    api_url=api_url,
    list_id=MAILCHIMP_EMAIL_LIST_ID
)


def subscribe(email):
    data = {
        "email_address": email,
        "status": "subscribed"
    }
    r = requests.post(
        members_endpoint,
        auth=("", MAILCHIMP_API_KEY),
        data=json.dumps(data)
    )
    return r.status_code, r.json()


def email_list_signup(request):
    form = EmailSignupForm(request.POST or None)
    if request.method == "POST":
        if form.is_valid():
            email_signup_qs = Signup.objects.filter(email=form.instance.email)
            if email_signup_qs.exists():
                messages.info(request, "You are already subscribed")
            else:
                subscribe(form.instance.email)
                form.save()
                form.save()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


from django.contrib.auth.decorators import login_required
from apps.crm.models import Ticket, Client, Contact

@login_required(login_url='/login/')
def client_portal(request):
    """
    Dedicated Client Portal showing Tickets, Invoices, and Projects.
    """
    from apps.crm.models import Ticket, Contact, Project
    from apps.erp.models import Invoice

    # Identify Client via Contact
    contact = Contact.objects.filter(email=request.user.email).first()
    
    tickets = []
    invoices = []
    projects = []
    
    if contact:
        client = contact.client
        
        # 1. Tickets
        tickets = Ticket.objects.filter(client=client).order_by('-created_at')
        
        # 2. Invoices
        invoices = Invoice.objects.filter(client=client).order_by('-issued_date')
        
        # 3. Projects
        projects = Project.objects.filter(client=client).order_by('-end_date')

    context = {
        'tickets': tickets,
        'invoices': invoices,
        'projects': projects,
    }
    return render(request, 'home/client_portal.html', context)


class IndexView(View):
    form = EmailSignupForm()

    def get(self, request, *args, **kwargs):
        context = {
            'form': self.form
        }
        return render(request, 'index.html', context)

    def post(self, request, *args, **kwargs):
        email = request.POST.get("email")
        new_signup = Signup()
        new_signup.email = email
        new_signup.save()
        messages.info(request, "Successfully subscribed")
        return redirect("home")


def index(request):
    if request.method == "POST":
        email = request.POST["email"]
        new_signup = Signup()
        new_signup.email = email
        new_signup.save()

    context = {}
    return render(request, 'index.html', context)





