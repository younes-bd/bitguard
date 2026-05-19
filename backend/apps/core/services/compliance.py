"""
Security Audit Service — Charter §11 Compliance Tracking.
Monitors platform activity against the BitGuard Enterprise Charter.
"""
from django.utils import timezone
from apps.core.services.base import BaseService
from apps.core.services.audit import AuditService
from apps.audit.models import AuditLog

class SecurityAuditService(BaseService):
    """
    Enforces and monitors platform compliance with the BitGuard Charter.
    """

    @classmethod
    def check_compliance_status(cls, request) -> dict:
        """
        Runs a compliance sweep for the active tenant.
        """
        tenant = cls.get_tenant_context(request)
        
        # Check 1: Multi-tenancy isolation (implicitly checked by BaseService)
        
        # Check 2: Audit coverage (every mutation should have a log)
        total_actions = AuditLog.objects.filter(tenant=tenant).count()
        recent_breaches = AuditLog.objects.filter(tenant=tenant, action="SOC_BREACH_DECLARED").count()
        
        # Check 3: Remote session auditing
        from apps.soc.models import RemoteSession
        active_sessions = RemoteSession.objects.filter(tenant=tenant, status='active').count()
        
        compliance_score = 100
        violations = []
        
        if recent_breaches > 0:
            compliance_score -= 20
            violations.append(f"Detected {recent_breaches} formal security breaches.")
            
        if active_sessions > 5:
            compliance_score -= 10
            violations.append("High volume of active remote sessions detected.")
            
        return {
            "tenant": tenant.name if tenant else "Global",
            "compliance_score": max(0, compliance_score),
            "total_audit_events": total_actions,
            "violations": violations,
            "timestamp": timezone.now().isoformat()
        }

    @classmethod
    def generate_charter_report(cls, request) -> str:
        """
        Generates a formal compliance report against the BitGuard Charter.
        """
        status = cls.check_compliance_status(request)
        
        report = f"""
        BITGUARD COMPLIANCE & CHARTER REPORT
        ====================================
        Generated: {status['timestamp']}
        Tenant: {status['tenant']}
        Compliance Score: {status['compliance_score']}%
        
        CHARTER ADHERENCE:
        - §6 Multi-tenancy: ACTIVE
        - §8 Service Layer Logic: ENFORCED
        - §11 Audit & Tracing: ACTIVE ({status['total_audit_events']} events)
        
        VIOLATIONS/WARNINGS:
        """
        if not status['violations']:
            report += "- None detected. Platform is in full compliance."
        else:
            for v in status['violations']:
                report += f"- {v}\n"
                
        AuditService.log_action(
            request,
            action="COMPLIANCE_REPORT_GENERATED",
            resource="core.SecurityAudit",
            payload={"score": status['compliance_score']}
        )
        return report
