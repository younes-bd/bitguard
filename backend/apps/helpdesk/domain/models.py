from django.db import models
from django.conf import settings
from django.utils import timezone
from apps.core.domain.models import BaseModel, TenantAwareModel

class HelpdeskTeam(TenantAwareModel):
    name = models.CharField(max_length=100)
    leader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='led_helpdesk_teams')
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name='helpdesk_teams')
    alias_email = models.EmailField(blank=True)
    use_sla = models.BooleanField(default=True)

class HelpdeskStage(TenantAwareModel):
    name = models.CharField(max_length=100)
    sequence = models.IntegerField(default=10)
    team = models.ForeignKey(HelpdeskTeam, on_delete=models.CASCADE, related_name='stages', null=True, blank=True)
    is_closed = models.BooleanField(default=False)
    fold = models.BooleanField(default=False)
    color = models.CharField(max_length=7, default='#3b82f6')
    
class HelpdeskTag(TenantAwareModel):
    name = models.CharField(max_length=50)
    color = models.CharField(max_length=7, default='#6b7280')

class SlaPolicy(TenantAwareModel):
    name = models.CharField(max_length=100)
    team = models.ForeignKey(HelpdeskTeam, on_delete=models.CASCADE, related_name='sla_policies')
    priority = models.CharField(max_length=20, choices=[('low','Low'),('medium','Medium'),('high','High'),('urgent','Urgent')], default='medium')
    ticket_type = models.CharField(max_length=50, blank=True)
    target_type = models.CharField(max_length=20, choices=[('response','First Response'),('resolution','Resolution')], default='resolution')
    target_hours = models.FloatField()

class Ticket(TenantAwareModel):
    service_contract = models.ForeignKey('subscriptions.ServiceContract', on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets')
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

    TICKET_TYPE_CHOICES = [
        ('incident', 'Incident'),
        ('problem', 'Problem'),
        ('change_request', 'Change Request'),
        ('service_request', 'Service Request'),
        ('question', 'Question'),
    ]

    RISK_CHOICES = [
        ('low', 'Low Risk'),
        ('medium', 'Medium Risk'),
        ('high', 'High Risk'),
    ]

    # tenant field is inherited from TenantAwareModel (BaseModel)
    title = models.CharField(max_length=255)
    ticket_number = models.CharField(max_length=20, blank=True)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open', db_index=True)
    ticket_type = models.CharField(max_length=20, choices=TICKET_TYPE_CHOICES, default='incident')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    risk_level = models.CharField(max_length=20, choices=RISK_CHOICES, default='low')
    due_date = models.DateTimeField(null=True, blank=True, help_text="SLA based resolution deadline")
    
    # Optional links to Core entities
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='submitted_tickets')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets')
    team = models.ForeignKey(HelpdeskTeam, on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets')
    stage = models.ForeignKey(HelpdeskStage, on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets')
    tags = models.ManyToManyField(HelpdeskTag, blank=True, related_name='tickets')
    sla_policy = models.ForeignKey(SlaPolicy, on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets')
    sla_deadline = models.DateTimeField(null=True, blank=True)
    sla_breached = models.BooleanField(default=False)
    first_response_at = models.DateTimeField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    # Knowledge Base Integration
    related_articles = models.ManyToManyField('KnowledgeArticle', blank=True, related_name='linked_tickets')
    is_converted_to_kb = models.BooleanField(default=False)
    
    # Link to ITSM Problem or Parent Change Request
    parent_ticket = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='sub_tickets')

    def __str__(self):
        return f"[{self.status.upper()}] [{self.get_ticket_type_display()}] {self.title}"

    @classmethod
    def escalate_sla_breaches(cls):
        from django.utils import timezone
        now = timezone.now()
        breached = cls.objects.filter(status__in=["open", "in_progress"], sla_breached=False, sla_deadline__lt=now)
        for t in breached:
            t.sla_breached = True
            if t.priority == "low": t.priority = "medium"
            elif t.priority == "medium": t.priority = "high"
            elif t.priority == "high": t.priority = "critical"
            t.save(update_fields=["sla_breached", "priority"])
            from apps.helpdesk.domain.models import TicketMessage
            TicketMessage.objects.create(ticket=t, body=f"System: SLA breached. Priority escalated to {t.get_priority_display()}.")

class TicketMessage(BaseModel):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    body = models.TextField()

    def __str__(self):
        return f"Message on {self.ticket.title} by {self.sender}"

class KnowledgeArticle(TenantAwareModel):
    # tenant field is inherited
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, null=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=[('draft','Draft'),('published','Published')], default='draft')
    category = models.CharField(max_length=100)
    content = models.TextField()
    views = models.IntegerField(default=0)

    def __str__(self):
        return self.title

class SLATier(BaseModel):
    """
    Defines an SLA tier (e.g. Basic, Standard, Premium, Critical).
    Reusable across multiple contracts.
    """
    COVERAGE_CHOICES = [
        ('business_hours', 'Business Hours (8x5)'),
        ('extended', 'Extended (12x5)'),
        ('always_on', '24x7'),
    ]
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    first_response_hours = models.IntegerField(help_text="Max hours to first response")
    resolution_hours = models.IntegerField(help_text="Max hours to resolution")
    uptime_percent = models.DecimalField(
        max_digits=5, decimal_places=2, default=99.9,
        help_text="Guaranteed uptime (e.g. 99.9)"
    )
    coverage = models.CharField(max_length=20, choices=COVERAGE_CHOICES, default='business_hours')

    def __str__(self):
        return f"{self.name} ({self.first_response_hours}h response / {self.resolution_hours}h resolution)"

class SLABreach(BaseModel):
    """
    Charter §25: SLA breaches must be logged and trigger notifications.
    Automatically created when a support ticket exceeds SLA tier thresholds.
    """
    BREACH_TYPE_CHOICES = [
        ('first_response', 'First Response Exceeded'),
        ('resolution', 'Resolution Time Exceeded'),
        ('uptime', 'Uptime SLA Violated'),
    ]
    contract = models.ForeignKey('subscriptions.ServiceContract', on_delete=models.CASCADE, related_name='sla_breaches')
    ticket_id = models.UUIDField(null=True, blank=True, help_text="UUID of the Support Ticket")
    breach_type = models.CharField(max_length=20, choices=BREACH_TYPE_CHOICES)
    breached_at = models.DateTimeField(default=timezone.now)
    acknowledged = models.BooleanField(default=False)
    resolution_note = models.TextField(blank=True)

    class Meta:
        verbose_name = 'SLA Breach'

    def __str__(self):
        return f"SLA Breach ({self.breach_type}) on {self.contract}"
