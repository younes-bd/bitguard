from .models import SecurityAlert, SecurityIncident, RemediationAction
from django.utils import timezone
from datetime import timedelta
from apps.core.services.audit import AuditService

class ScoringEngine:
    @staticmethod
    def calculate_score(alert):
        """
        Calculates a score (0-100) for a SecurityAlert based on severity and context.
        """
        severity_map = {
            'critical': 100,
            'high': 75,
            'medium': 40,
            'low': 10,
            'informational': 5
        }
        
        base_score = severity_map.get(alert.severity, 10)
        
        # Contextual weights (using raw_data instead of contextual_data)
        context = alert.raw_data or {}
        weights = context.get('weights', {})
        
        score = base_score
        
        if weights.get('asset_criticality'):
            score += 20
        if weights.get('repeat_events'):
            score += 15
        if weights.get('threat_intel_match'):
            score += 25
            
        return min(100, score)

class RuleEngine:
    @staticmethod
    def evaluate(alert):
        """
        Maps a SecurityAlert to a playbook action based on rules.
        """
        if alert.severity == 'critical' and alert.source == 'endpoint_security':
            return 'isolate_asset'
            
        if alert.severity == 'high' and alert.source == 'email_security':
            return 'quarantine_email'
            
        if alert.severity == 'critical' and 'brute force' in alert.title.lower():
            return 'block_ip_firewall'

        return None

class PlaybookService:
    @staticmethod
    def execute(playbook_name, alert, user=None):
        """
        Executes a playbook action.
        """
        # Placeholder for task execution (e.g. Celery)
        # from .tasks import isolate_asset_task, ...
        
        result = "No Action"
        
        if playbook_name == 'isolate_asset':
            # Logic to isolate asset
            # asset_id = ...
            result = "Asset isolation initiated"
                
        elif playbook_name == 'block_ip_firewall':
            result = "Firewall block rule created"
                
        elif playbook_name == 'quarantine_email':
             result = "Email quarantine request sent"
        
        # Log action
        # RemediationAction.objects.create(...)
                 
        return f"Task Executed: {result}"

class IncidentService:
    """
    SOC Incident Management (Section 5 & 19).
    Governs state transitions and SLA enforcement.
    """
    
    @staticmethod
    def create_incident(title, description, severity, client=None, workspace=None, request=None):
        from .models import SecurityIncident
        
        # Calculate SLA based on severity
        sla_hours = {
            'critical': 1,
            'high': 4,
            'medium': 24,
            'low': 72
        }.get(severity.lower(), 48)
        
        deadline = timezone.now() + timedelta(hours=sla_hours)
        
        incident = SecurityIncident.objects.create(
            title=title,
            description=description,
            severity=severity,
            client=client,
            workspace=workspace,
            sla_deadline=deadline,
            status='new'
        )
        
        AuditService.log(
            request,
            action="INCIDENT_CREATED",
            resource=f"security.Incident:{incident.pk}",
            payload={"severity": severity, "sla_deadline": str(deadline)}
        )
        
        return incident

    @staticmethod
    def transition_state(incident, new_status, user, request=None):
        """
        Transactional state machine for incidents.
        """
        old_status = incident.status
        valid_transitions = {
            'new': ['investigating', 'resolved'],
            'investigating': ['containment', 'resolved'],
            'containment': ['resolved'],
            'resolved': ['closed'],
            'closed': []
        }
        
        if new_status not in valid_transitions.get(old_status, []):
            raise ValueError(f"Invalid transition from {old_status} to {new_status}")
            
        incident.status = new_status
        if new_status == 'closed':
            incident.closed_at = timezone.now()
            
        incident.save()
        
        AuditService.log(
            request,
            action="INCIDENT_STATE_TRANSITION",
            resource=f"security.Incident:{incident.pk}",
            payload={"old": old_status, "new": new_status, "user": user.email}
        )
        
        # Propagate to CRM if critical
        if incident.severity == 'critical' and new_status == 'resolved':
            # Could trigger a follow-up client meeting or lifecycle update
            pass

    @staticmethod
    def check_slas():
        """
        Background task / Audit logic for SLA breaches.
        """
        from .models import SecurityIncident
        now = timezone.now()
        breached = SecurityIncident.objects.filter(
            status__in=['new', 'investigating', 'containment'],
            sla_deadline__lt=now,
            is_breached=False
        )
        
        for incident in breached:
            incident.is_breached = True
            incident.save()
            # Trigger escalation
            IncidentService.escalate(incident)

    @staticmethod
    def escalate(incident):
        incident.escalation_level += 1
        incident.save()
        AuditService.log(
            None,
            action="INCIDENT_ESCALATED",
            resource=f"security.Incident:{incident.pk}",
            payload={"level": incident.escalation_level}
        )
