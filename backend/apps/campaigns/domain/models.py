from django.db import models
from apps.base.domain.models import TenantAwareModel

class MailingList(TenantAwareModel):
    name = models.CharField(max_length=255)
    is_public = models.BooleanField(default=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class MailingContact(TenantAwareModel):
    email = models.EmailField()
    name = models.CharField(max_length=255, blank=True)
    lists = models.ManyToManyField(MailingList, related_name='contacts')
    opt_out = models.BooleanField(default=False)

    def __str__(self):
        return self.email

class Campaign(TenantAwareModel):
    STATE_CHOICES = [
        ('draft', 'Draft'),
        ('scheduled', 'Scheduled'),
        ('sending', 'Sending'),
        ('sent', 'Sent'),
    ]

    name = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    state = models.CharField(max_length=20, choices=STATE_CHOICES, default='draft')
    mailing_list = models.ForeignKey(MailingList, on_delete=models.SET_NULL, null=True, related_name='campaigns')
    body_html = models.TextField(blank=True)
    schedule_date = models.DateTimeField(null=True, blank=True)
    sent_date = models.DateTimeField(null=True, blank=True)
    sent_count = models.IntegerField(default=0)

    def __str__(self):
        return self.name
