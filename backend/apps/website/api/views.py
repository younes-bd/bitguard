from rest_framework import viewsets, permissions, status, views
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from django.conf import settings
from django.db.models import Q
from django.shortcuts import get_object_or_404
from ..domain.models import (
    Announcement, Signup, WebsiteInquiry, LandingPage, Page, ServicePage, MediaAsset,
    Website, WebsiteMenu, WebsiteRedirect
)
from ..api.serializers import (
    AnnouncementSerializer, 
    SignupSerializer, 
    WebsiteInquirySerializer, 
    LandingPageSerializer,
    PageSerializer,
    ServicePageSerializer,
    MediaAssetSerializer,
    WebsiteSerializer,
    WebsiteMenuSerializer,
    WebsiteRedirectSerializer
)

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

class LandingPageViewSet(viewsets.ModelViewSet):
    """
    Landing Page Builder API.
    """
    queryset = LandingPage.objects.all()
    serializer_class = LandingPageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class PageViewSet(viewsets.ModelViewSet):
    """
    Standard website pages API.
    """
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ServicePageViewSet(viewsets.ModelViewSet):
    """
    Service specific marketing pages API.
    """
    queryset = ServicePage.objects.all()
    serializer_class = ServicePageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class MediaAssetViewSet(viewsets.ModelViewSet):
    """
    Media Assets API.
    """
    queryset = MediaAsset.objects.all()
    serializer_class = MediaAssetSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class WebsiteViewSet(viewsets.ModelViewSet):
    """
    Multi-Website management API.
    """
    queryset = Website.objects.all()
    serializer_class = WebsiteSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class WebsiteMenuViewSet(viewsets.ModelViewSet):
    """
    Website Menus API.
    """
    queryset = WebsiteMenu.objects.all()
    serializer_class = WebsiteMenuSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class WebsiteRedirectViewSet(viewsets.ModelViewSet):
    """
    Website Redirects API.
    """
    queryset = WebsiteRedirect.objects.all()
    serializer_class = WebsiteRedirectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
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
            ticket_type='helpdesk'
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

        from apps.soc.models import RemoteSession
        
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
        from apps.soc.models import RemoteSession

        new_code = ''.join(random.choices(string.digits, k=6))
        
        RemoteSession.objects.create(
            session_code=new_code,
            technician=request.user,
            status='active'
        )
        
        return Response({"code": new_code}, status=status.HTTP_201_CREATED)



class GlobalSearchView(views.APIView):
    """
    Public global search endpoint for the website.
    Searches ServicePage and Page models.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query or len(query) < 2:
            return Response({"results": []})

        from apps.website.domain.models import ServicePage, Page

        results = []

        # Search Service Pages
        services = ServicePage.objects.filter(
            Q(title__icontains=query) | 
            Q(description__icontains=query) |
            Q(content__icontains=query)
        )[:5]

        for s in services:
            results.append({
                "type": "Service",
                "title": s.title,
                "description": s.description[:100] + "..." if len(s.description) > 100 else s.description,
                "url": f"/solutions/{s.slug}"
            })

        # Search Content Pages
        pages = Page.objects.filter(
            Q(title__icontains=query) | 
            Q(seo_description__icontains=query)
        ).filter(is_published=True)[:5]

        for p in pages:
            results.append({
                "type": "Page",
                "title": p.title,
                "description": p.seo_description[:100] + "..." if len(p.seo_description) > 100 else p.seo_description,
                "url": f"/{p.slug}"
            })

        # Future: Could add blog post search here if Blog app is connected

        return Response({"results": results})
