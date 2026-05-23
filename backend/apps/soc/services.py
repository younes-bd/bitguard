"""
SOC Service Layer — Extended for Security Platform (Customer-facing SIEM/MDR/ITAM).
Charter §8: All business logic lives in services.
Charter §11: Remote sessions and security transitions are fully audited.
"""
from django.db import transaction
from django.utils import timezone
import secrets
from apps.core.services.base import BaseService
from apps.core.services.audit import AuditService
from .models import (
    Alert, Incident, ThreatIntelligence, LogAnalysis,
    Workspace, ManagedEndpoint, CloudApp, SystemMonitor,
    NetworkEvent, CloudIntegration, RemoteSession,
)


# ─── Internal SOC Services ───────────────────────────────────

class AlertService(BaseService):
    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(Alert.objects.all(), request)

    @classmethod
    @transaction.atomic
    def create_alert(cls, request, data: dict) -> Alert:
        tenant = cls.get_tenant_context(request)
        alert = Alert(tenant=tenant, **data)
        alert.full_clean()
        alert.save()
        AuditService.log_action(request, action="SOC_ALERT_CREATED",
            resource=f"soc.Alert:{alert.pk}",
            payload={"title": alert.title, "severity": alert.severity})
        return alert

    @classmethod
    @transaction.atomic
    def resolve_alert(cls, request, alert: Alert) -> Alert:
        cls.validate_ownership(alert, request)
        alert.is_resolved = True
        alert.save(update_fields=['is_resolved'])
        AuditService.log_action(request, action="SOC_ALERT_RESOLVED",
            resource=f"soc.Alert:{alert.pk}", payload={"title": alert.title})
        return alert


class IncidentService(BaseService):
    VALID_STATUS_TRANSITIONS = {
        'open': ['investigating', 'closed'],
        'investigating': ['mitigated', 'closed'],
        'mitigated': ['closed'],
        'closed': [],
    }

    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(Incident.objects.all(), request)

    @classmethod
    @transaction.atomic
    def create_incident(cls, request, data: dict) -> Incident:
        tenant = cls.get_tenant_context(request)
        incident = Incident(tenant=tenant, **data)
        incident.full_clean()
        incident.save()
        AuditService.log_action(request, action="SOC_INCIDENT_CREATED",
            resource=f"soc.Incident:{incident.pk}",
            payload={"title": incident.title, "status": incident.status})
        return incident

    @classmethod
    @transaction.atomic
    def transition_incident(cls, request, incident: Incident, new_status: str) -> Incident:
        cls.validate_ownership(incident, request)
        current = incident.status
        allowed = cls.VALID_STATUS_TRANSITIONS.get(current, [])
        if new_status not in allowed:
            from django.core.exceptions import ValidationError
            raise ValidationError(f"Invalid transition '{current}' → '{new_status}'. Allowed: {allowed}")
        old_status = incident.status
        incident.status = new_status
        incident.save(update_fields=['status'])
        AuditService.log_action(request, action="SOC_INCIDENT_TRANSITIONED",
            resource=f"soc.Incident:{incident.pk}",
            payload={"old": old_status, "new": new_status})
        return incident

    @classmethod
    def assess_impact(cls, request, incident: Incident) -> dict:
        """
        Analyzes the potential impact of an incident based on linked alerts and endpoints.
        """
        cls.validate_ownership(incident, request)
        alerts = incident.alerts.all()
        affected_endpoints = ManagedEndpoint.objects.filter(monitors__is_anomalous=True, workspace__tenant=incident.tenant)
        
        severity_map = {'critical': 10, 'high': 7, 'medium': 4, 'low': 1}
        total_risk = sum(severity_map.get(a.severity, 0) for a in alerts)
        
        impact_level = "Low"
        if total_risk > 20: impact_level = "Critical"
        elif total_risk > 10: impact_level = "High"
        elif total_risk > 5: impact_level = "Medium"
        
        return {
            "impact_level": impact_level,
            "total_risk_score": total_risk,
            "alerts_count": alerts.count(),
            "affected_endpoints_count": affected_endpoints.count()
        }

    @classmethod
    @transaction.atomic
    def declare_breach(cls, request, incident: Incident):
        """
        Charter §11: Declares a formal security breach, triggering compliance notifications.
        """
        cls.validate_ownership(incident, request)
        
        # In a real system, this would trigger email/SMS to DPO and Management
        AuditService.log_action(
            request,
            action="SOC_BREACH_DECLARED",
            resource=f"soc.Incident:{incident.pk}",
            payload={"formal_declaration": True, "declared_at": timezone.now().isoformat()}
        )
        
        # Force isolate all endpoints in the same workspace if critical?
        # For now, just log the high-level compliance event.
        return True

    @classmethod
    def generate_soc_report(cls, request, incident: Incident) -> str:
        """
        Generates a standardized SOC report for the incident.
        """
        cls.validate_ownership(incident, request)
        impact = cls.assess_impact(request, incident)
        
        report = f"""
        BITGUARD SOC INCIDENT REPORT
        ============================
        ID: {incident.pk}
        Title: {incident.title}
        Status: {incident.status}
        Impact Level: {impact['impact_level']}
        
        Description:
        {incident.description}
        
        Timeline:
        - Created: {incident.created_at}
        - Last Modified: {incident.updated_at}
        
        Mitigation Steps:
        [STUB] Automated mitigation was applied to affected endpoints.
        """
        
        AuditService.log_action(
            request,
            action="SOC_REPORT_GENERATED",
            resource=f"soc.Incident:{incident.pk}",
            payload={"report_length": len(report)}
        )
        return report


class LogAnalysisService(BaseService):
    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(LogAnalysis.objects.all(), request)


class ThreatIntelligenceService(BaseService):
    @classmethod
    def get_queryset(cls, request):
        return ThreatIntelligence.objects.all()  # Global — not tenant-scoped


# ─── Security Platform Services (Customer-facing) ─────────────

class WorkspaceService(BaseService):
    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(Workspace.objects.filter(is_active=True), request)

    @classmethod
    @transaction.atomic
    def create_workspace(cls, request, data: dict) -> Workspace:
        tenant = cls.get_tenant_context(request)
        workspace = Workspace(tenant=tenant, created_by=request.user, **data)
        workspace.full_clean()
        workspace.save()
        AuditService.log_action(request, action="PLATFORM_WORKSPACE_CREATED",
            resource=f"soc.Workspace:{workspace.pk}",
            payload={"name": workspace.name})
        return workspace


class ManagedEndpointService(BaseService):
    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(ManagedEndpoint.objects.all(), request)

    @classmethod
    @transaction.atomic
    def create_endpoint(cls, request, data: dict) -> ManagedEndpoint:
        tenant = cls.get_tenant_context(request)
        endpoint = ManagedEndpoint(tenant=tenant, **data)
        endpoint.full_clean()
        endpoint.save()
        AuditService.log_action(request, action="PLATFORM_ENDPOINT_REGISTERED",
            resource=f"soc.ManagedEndpoint:{endpoint.pk}",
            payload={"hostname": endpoint.hostname, "ip": str(endpoint.ip_address)})
        return endpoint

    @classmethod
    @transaction.atomic
    def isolate_endpoint(cls, request, endpoint: ManagedEndpoint) -> ManagedEndpoint:
        """Isolate an endpoint (block network access) — security containment action."""
        cls.validate_ownership(endpoint, request)
        endpoint.status = 'isolated'
        endpoint.save(update_fields=['status'])
        AuditService.log_action(request, action="PLATFORM_ENDPOINT_ISOLATED",
            resource=f"soc.ManagedEndpoint:{endpoint.pk}",
            payload={"hostname": endpoint.hostname, "reason": "Manual isolation"})
        return endpoint


class CloudAppService(BaseService):
    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(CloudApp.objects.all(), request)


class SystemMonitorService(BaseService):
    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(SystemMonitor.objects.all(), request)


class NetworkEventService(BaseService):
    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(NetworkEvent.objects.all(), request)


class CloudIntegrationService(BaseService):
    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(CloudIntegration.objects.all(), request)

    @classmethod
    @transaction.atomic
    def connect_integration(cls, request, data: dict) -> CloudIntegration:
        tenant = cls.get_tenant_context(request)
        integration = CloudIntegration(tenant=tenant, **data)
        integration.full_clean()
        integration.save()
        AuditService.log_action(request, action="PLATFORM_INTEGRATION_CONNECTED",
            resource=f"soc.CloudIntegration:{integration.pk}",
            payload={"name": integration.name, "provider": integration.provider})
        return integration


class RemoteSessionService(BaseService):
    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(RemoteSession.objects.all(), request)

    @classmethod
    @transaction.atomic
    def create_session(cls, request, endpoint: ManagedEndpoint, purpose: str) -> RemoteSession:
        """
        Charter §11: All remote sessions are fully audited with one-time tokens.
        """
        tenant = cls.get_tenant_context(request)
        token = secrets.token_urlsafe(32)
        session = RemoteSession.objects.create(
            tenant=tenant,
            endpoint=endpoint,
            initiated_by=request.user,
            status='requested',
            session_token=token,
            purpose=purpose,
        )
        AuditService.log_action(request, action="PLATFORM_REMOTE_SESSION_REQUESTED",
            resource=f"soc.RemoteSession:{session.pk}",
            payload={"endpoint": endpoint.hostname, "purpose": purpose})
        return session

    @classmethod
    @transaction.atomic
    def end_session(cls, request, session: RemoteSession) -> RemoteSession:
        session.status = 'ended'
        session.ended_at = timezone.now()
        session.save(update_fields=['status', 'ended_at'])
        AuditService.log_action(request, action="PLATFORM_REMOTE_SESSION_ENDED",
            resource=f"soc.RemoteSession:{session.pk}",
            payload={"endpoint": session.endpoint.hostname})
        return session
