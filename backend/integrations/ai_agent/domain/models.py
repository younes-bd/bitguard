from django.db import models
from apps.core.domain.models import TenantAwareModel

class AgentProfile(TenantAwareModel):
    """
    The Roster Profile for the AI Agent.
    """
    name = models.CharField(max_length=100, help_text="e.g. 'Customer Support Agent'")
    role = models.CharField(max_length=100, help_text="e.g. 'helpdesk', 'sales'")
    is_active = models.BooleanField(default=False)
    system_prompt = models.TextField(help_text="The core instructions for the AI to follow.")
    
    # Simple list of tool names this agent is allowed to execute
    allowed_tools = models.JSONField(default=list, help_text="e.g. ['read_ticket', 'escalate']")

    class Meta:
        db_table = 'ai_agent_profile'
        verbose_name = 'AI Agent Profile'
        verbose_name_plural = 'AI Agent Profiles'

    def __str__(self):
        return f"{self.name} ({'Active' if self.is_active else 'Inactive'})"

class AgentRunLog(TenantAwareModel):
    """
    The Audit trail of what the Agent did on each run.
    """
    TRIGGERED_BY_CHOICES = [
        ('user',     'User'),
        ('webhook',  'Webhook'),
        ('schedule', 'Schedule'),
    ]
    STATUS_CHOICES = [
        ('pending',   'Pending'),
        ('running',   'Running'),
        ('success',   'Success'),
        ('failed',    'Failed'),
        ('escalated', 'Escalated'),
    ]

    agent = models.ForeignKey(AgentProfile, on_delete=models.CASCADE, related_name='run_logs')
    triggered_by_model = models.CharField(max_length=100, blank=True)
    triggered_by_id    = models.CharField(max_length=50, blank=True)

    # Input / Output
    user_input   = models.TextField(blank=True, help_text="The original prompt that triggered the run.")
    thoughts     = models.TextField(blank=True, help_text="The step-by-step ReAct reasoning chain.")
    actions_taken = models.JSONField(default=list, help_text="Tool calls made during the run.")
    final_output = models.TextField(blank=True, help_text="The agent's final answer to the user.")

    # Meta
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default='success')
    triggered_by = models.CharField(max_length=20, choices=TRIGGERED_BY_CHOICES, default='user')
    tokens_used  = models.IntegerField(default=0, help_text="Total tokens consumed in this run.")
    duration_ms  = models.IntegerField(default=0, help_text="Total execution time in milliseconds.")
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ai_agent_run_log'
        verbose_name = 'Agent Run Log'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.agent.name} Run at {self.created_at} [{self.status}]"
