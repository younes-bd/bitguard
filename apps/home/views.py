from rest_framework import viewsets, permissions, status, views
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from django.conf import settings
from django.db.models import Q
from django.shortcuts import get_object_or_404
from .models import Announcement, Signup, WebsiteInquiry, ServicePage
from .serializers import AnnouncementSerializer, SignupSerializer, WebsiteInquirySerializer, ServicePageSerializer

# --- Content ViewSets ---

class AnnouncementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public announcements for the homepage/news section.
    """
    queryset = Announcement.objects.all().order_by('-date')
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.AllowAny]

class SignupViewSet(viewsets.ModelViewSet):
    """
    Email newsletter signup.
    """
    queryset = Signup.objects.all().order_by('-timestamp')
    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]

class WebsiteInquiryViewSet(viewsets.ModelViewSet):
    """
    Contact form submissions.
    """
    queryset = WebsiteInquiry.objects.all().order_by('-created_at')
    serializer_class = WebsiteInquirySerializer
    permission_classes = [permissions.AllowAny]

class ServicePageViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Content pages for services.
    """
    queryset = ServicePage.objects.all().order_by('title')
    serializer_class = ServicePageSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

# --- Interactive API Views ---

class SupportTicketView(views.APIView):
    """
    Public or Authenticated support ticket submission.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # We expect: full_name, email, subject, message (description)
        data = request.data
        email = data.get('email')
        full_name = data.get('full_name')
        subject = data.get('subject')
        description = data.get('message') or data.get('description')

        if not email or not subject or not description:
            return Response({"error": "Email, Subject, and Message are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Lazy import to avoid circular dependency if any
        from apps.crm.models import Client, Ticket, Contact

        # 1. Identify or Create Contact/Client
        contact = Contact.objects.filter(email=email).first()
        
        if contact:
            client = contact.client
        else:
            # Create new Client (Individual) and Contact
            # If authenticated, we might want to link user, but for now generic support form logic:
            client_name = full_name if full_name else email.split('@')[0]
            client, created = Client.objects.get_or_create(
                name=client_name,
                defaults={
                    'client_type': 'individual',
                    'status': 'lead'
                }
            )
            
            first_name = client_name.split(' ')[0]
            last_name = ' '.join(client_name.split(' ')[1:]) if ' ' in client_name else ''
            
            Contact.objects.create(
                client=client,
                email=email,
                first_name=first_name,
                last_name=last_name,
                role='Primary Contact',
                is_primary=True
            )

        # 2. Create Ticket
        ticket = Ticket.objects.create(
            client=client,
            summary=subject,
            description=description,
            status='open',
            priority='medium',
            ticket_type='support'
        )

        return Response({
            "status": "success",
            "message": "Ticket created successfully",
            "ticket_id": ticket.id
        }, status=status.HTTP_201_CREATED)

class RemoteSessionView(views.APIView):
    """
    Manage Remote Sessions (Join/Generate).
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        Join a session with a code.
        """
        code = request.data.get('session_code')
        if not code:
            return Response({"error": "Session code required"}, status=status.HTTP_400_BAD_REQUEST)

        from apps.tenants.models import RemoteSession
        
        try:
            session = RemoteSession.objects.get(session_code=code)
            # If needed to check status:
            # if session.status != 'active': ...
            
            session.status = 'connected'
            session.connected_at = timezone.now()
            session.client_ip = request.META.get('REMOTE_ADDR')
            session.save()
            
            return Response({
                "status": "connected",
                "session_id": session.id,
                "technician": session.technician.username if session.technician else "Unknown"
            })
        except RemoteSession.DoesNotExist:
            return Response({"error": "Invalid session code"}, status=status.HTTP_404_NOT_FOUND)

class GenerateSessionView(views.APIView):
    """
    Technician generates a code.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if not request.user.is_staff:
            return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)

        import random
        import string
        from apps.tenants.models import RemoteSession

        new_code = ''.join(random.choices(string.digits, k=6))
        
        RemoteSession.objects.create(
            session_code=new_code,
            technician=request.user,
            status='active'
        )
        
        return Response({"code": new_code}, status=status.HTTP_201_CREATED)

class ClientDashboardView(views.APIView):
    """
    Aggregated data for the logged-in client (Tickets, Invoices, Projects).
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from apps.crm.models import Ticket, Contact, Project
        from apps.erp.models import Invoice
        # We need serializers for these, ideally imported. 
        # For now we'll return raw data or use simple inline serialization if serializers aren't available globally.
        # Assuming we can grab them, or just return values.
        # Let's try to identify the client first.
        
        contact = Contact.objects.filter(email=request.user.email).first()
        if not contact:
            return Response({"error": "No client profile found for this user."}, status=status.HTTP_404_NOT_FOUND)
        
        client = contact.client
        
        # Helper to serialize simple lists
        tickets = Ticket.objects.filter(client=client).order_by('-created_at').values(
            'id', 'summary', 'status', 'created_at', 'priority'
        )
        invoices = Invoice.objects.filter(client=client).order_by('-issued_date').values(
            'id', 'invoice_number', 'total', 'status', 'issued_date', 'due_date'
        )
        projects = Project.objects.filter(client=client).order_by('-end_date').values(
            'id', 'name', 'status', 'progress', 'end_date'
        )
        
        return Response({
            "client": {
                "name": client.name,
                "type": client.client_type,
            },
            "tickets": list(tickets),
            "invoices": list(invoices),
            "projects": list(projects)
        })
