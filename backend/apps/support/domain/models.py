from django.db import models
from django.conf import settings
from apps.core.models import BaseModel, TenantAwareModel

class Ticket(TenantAwareModel):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    # tenant field is inherited from TenantAwareModel (BaseModel)
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    due_date = models.DateTimeField(null=True, blank=True, help_text="SLA based resolution deadline")
    
    # Optional links to Core entities
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='submitted_tickets')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets')
    
    # Knowledge Base Integration
    related_articles = models.ManyToManyField('KnowledgeArticle', blank=True, related_name='linked_tickets')
    is_converted_to_kb = models.BooleanField(default=False)
    
    # Link to ITSM Problem
    # problem = models.ForeignKey('itsm.Problem', on_delete=models.SET_NULL, null=True, blank=True, related_name='incidents')

    def __str__(self):
        return f"[{self.status.upper()}] {self.title}"

class TicketMessage(BaseModel):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    body = models.TextField()

    def __str__(self):
        return f"Message on {self.ticket.title} by {self.sender}"

class KnowledgeArticle(TenantAwareModel):
    # tenant field is inherited
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    content = models.TextField()
    views = models.IntegerField(default=0)

    def __str__(self):
        return self.title
