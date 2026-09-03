from django.db import models
from apps.core.domain.models import TenantAwareModel
from django.conf import settings

class AISettings(TenantAwareModel):
    """
    Tenant-specific API configuration for AI.
    If a tenant provides their own key, Option B (Bring Your Own Key) is active.
    """
    is_active = models.BooleanField(default=True)
    openai_api_key = models.CharField(max_length=255, blank=True, null=True, help_text="Tenant's custom OpenAI API Key")
    anthropic_api_key = models.CharField(max_length=255, blank=True, null=True, help_text="Tenant's custom Anthropic API Key")
    
    preferred_provider = models.CharField(
        max_length=50,
        choices=[('openai', 'OpenAI'), ('anthropic', 'Anthropic')],
        default='openai'
    )

    class Meta:
        verbose_name_plural = "AI Settings"

class AIUsageLog(TenantAwareModel):
    """
    Tracks AI usage for billing purposes if using the Global Key.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    provider = models.CharField(max_length=50) # 'openai', 'anthropic'
    feature = models.CharField(max_length=100) # e.g., 'crm_summarize_lead', 'helpdesk_reply'
    tokens_used = models.IntegerField(default=0)
    cost_usd = models.DecimalField(max_digits=10, decimal_places=6, default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tenant.name} - {self.feature} ({self.tokens_used} tokens)"
