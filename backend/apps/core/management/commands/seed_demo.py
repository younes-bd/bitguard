"""
seed_demo.py — BitGuard Enterprise Demo Data Seeder
====================================================
Creates a realistic, self-consistent dataset for all 14 modules
so the Command Center dashboard shows meaningful KPIs.

Usage:
    python manage.py seed_demo              # idempotent, safe to re-run
    python manage.py seed_demo --flush      # wipe all demo data first
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from decimal import Decimal
import random
from datetime import timedelta, date

User = get_user_model()


class Command(BaseCommand):
    help = "Seed realistic demo data across all BitGuard modules."

    def add_arguments(self, parser):
        parser.add_argument(
            "--flush",
            action="store_true",
            help="Delete all existing demo data before seeding.",
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("\n🌱  BitGuard Demo Seed Starting…\n"))

        if options["flush"]:
            self._flush()

        tenant = self._ensure_tenant()
        admin = self._ensure_admin(tenant)

        self._seed_crm(tenant, admin)
        self._seed_support(tenant, admin)
        self._seed_billing(tenant, admin)
        self._seed_soc(tenant, admin)
        self._seed_hrm(tenant, admin)
        self._seed_scm(tenant, admin)
        self._seed_projects(tenant, admin)
        self._seed_contracts(tenant, admin)
        self._seed_itam(tenant, admin)
        self._seed_notifications(tenant, admin)

        self.stdout.write(self.style.SUCCESS("\n✅  Demo seed complete! Refresh the dashboard to see live data.\n"))

    # ─────────────────────────────────────────────────────────────────────────
    # Helpers
    # ─────────────────────────────────────────────────────────────────────────

    def _ok(self, label):
        self.stdout.write(f"   {self.style.SUCCESS('✔')}  {label}")

    def _ensure_tenant(self):
        from apps.tenants.models import Tenant
        tenant, created = Tenant.objects.get_or_create(
            domain="demo.bitguard.tech",
            defaults={"name": "BitGuard Demo Corp", "is_active": True},
        )
        if created:
            self._ok("Created tenant: BitGuard Demo Corp")
        else:
            self._ok("Tenant already exists — reusing")
        return tenant

    def _ensure_admin(self, tenant):
        user, created = User.objects.get_or_create(
            email="admin@bitguard.tech",
            defaults={
                "username": "admin",
                "is_staff": True,
                "is_superuser": True,
                "tenant": tenant,
            },
        )
        if created:
            user.set_password("admin")
            user.save()
            self._ok("Created admin user")
        else:
            # Make sure existing admin is linked to demo tenant
            if user.tenant is None:
                user.tenant = tenant
                user.save(update_fields=["tenant"])
            self._ok("Admin user already exists")
        return user

    def _flush(self):
        self.stdout.write(self.style.WARNING("  ⚠️  Flushing demo data…"))
        from apps.crm.models import Client, Deal, Contact, Lead, Activity
        from apps.support.models import Ticket, KnowledgeArticle
        from apps.billing.models import Plan, Subscription, Invoice
        from apps.soc.models import Alert, Incident
        from apps.hrm.models import Employee, LeaveRequest
        from apps.scm.models import PurchaseOrder, InventoryItem
        from apps.projects.models import Project, Task
        from apps.notifications.models import Notification

        for Model in [Activity, Deal, Lead, Contact, Client,
                      Ticket, KnowledgeArticle,
                      Subscription, Invoice, Plan,
                      Incident, Alert,
                      LeaveRequest, Employee,
                      PurchaseOrder, InventoryItem,
                      Task, Project,
                      Notification]:
            try:
                Model.objects.all().delete()
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"    Could not flush {Model.__name__}: {e}"))

    # ─────────────────────────────────────────────────────────────────────────
    # Module seeders
    # ─────────────────────────────────────────────────────────────────────────

    def _seed_crm(self, tenant, admin):
        self.stdout.write("\n  ── CRM")
        from apps.crm.models import Client, Contact, Deal, Lead, Activity

        now = timezone.now()

        company_names = [
            ("Apex Dynamics", "technology", "active"),
            ("NovaTech Solutions", "technology", "active"),
            ("Pinnacle Financial", "finance", "active"),
            ("Meridian Healthcare", "healthcare", "subscriber"),
            ("BlueRidge Consulting", "consulting", "managed_service"),
            ("Starline Retail", "retail", "active"),
            ("Coastal Manufacturing", "manufacturing", "prospect"),
            ("Summit Logistics", "logistics", "active"),
        ]

        clients = []
        for name, industry, status in company_names:
            client, _ = Client.objects.get_or_create(
                name=name, tenant=tenant,
                defaults={
                    "client_type": "business",
                    "status": status,
                    "industry": industry,
                    "email": f"info@{name.lower().replace(' ', '')}.com",
                    "assigned_to": admin,
                }
            )
            clients.append(client)

        self._ok(f"{len(clients)} clients")

        # Contacts
        first_names = ["James", "Sarah", "Michael", "Emily", "David", "Lisa", "Robert", "Anna"]
        last_names = ["Anderson", "Martinez", "Johnson", "Williams", "Brown", "Davis", "Wilson", "Taylor"]

        contacts = []
        for i, client in enumerate(clients):
            contact, _ = Contact.objects.get_or_create(
                client=client,
                first_name=first_names[i % len(first_names)],
                last_name=last_names[i % len(last_names)],
                defaults={
                    "tenant": tenant,
                    "email": f"{first_names[i % len(first_names)].lower()}@{client.name.lower().replace(' ', '')}.com",
                    "job_title": random.choice(["CTO", "CISO", "IT Director", "VP Engineering"]),
                    "is_primary": True,
                }
            )
            contacts.append(contact)
        self._ok(f"{len(contacts)} contacts")

        # Deals
        deal_data = [
            ("Managed Security Package - Apex", clients[0], 85000, "won"),
            ("Cloud Migration - NovaTech", clients[1], 42000, "negotiation"),
            ("Compliance Audit - Pinnacle", clients[2], 28000, "proposal"),
            ("MSSP Contract - Meridian", clients[3], 120000, "won"),
            ("SOC-as-a-Service - BlueRidge", clients[4], 96000, "negotiation"),
            ("Endpoint Protection - Starline", clients[5], 34000, "prospecting"),
            ("SIEM Deployment - Summit", clients[7], 55000, "proposal"),
        ]

        deals = []
        for title, client, amount, stage in deal_data:
            deal, _ = Deal.objects.get_or_create(
                title=title, tenant=tenant,
                defaults={
                    "client": client,
                    "amount": Decimal(amount),
                    "stage": stage,
                    "expected_close_date": date.today() + timedelta(days=random.randint(10, 90)),
                    "assigned_to": admin,
                    "updated_at": now - timedelta(days=random.randint(1, 25)),
                }
            )
            deals.append(deal)
        self._ok(f"{len(deals)} deals")

    def _seed_support(self, tenant, admin):
        self.stdout.write("\n  ── Support")
        from apps.support.models import Ticket, KnowledgeArticle

        now = timezone.now()

        tickets_data = [
            ("VPN connectivity dropped after patch", "critical", "open"),
            ("MFA not working for remote users", "high", "in_progress"),
            ("Ransomware alert on workstation WS-042", "critical", "in_progress"),
            ("Password reset request", "low", "resolved"),
            ("Email filtering blocking legitimate senders", "medium", "open"),
            ("SIEM not ingesting firewall logs", "high", "open"),
            ("Slow RDP performance", "medium", "in_progress"),
            ("Request for access to shared drive", "low", "resolved"),
            ("Phishing simulation results needed", "medium", "open"),
            ("SSL cert expiring in 14 days", "high", "open"),
        ]

        for title, priority, status in tickets_data:
            due = now + timedelta(hours=random.choice([4, 8, 24, 48, 72]))
            Ticket.objects.get_or_create(
                title=title, tenant=tenant,
                defaults={
                    "description": f"User reported: {title}. Requires immediate attention.",
                    "status": status,
                    "priority": priority,
                    "customer": admin,
                    "assigned_to": admin,
                    "due_date": due,
                }
            )
        self._ok(f"{len(tickets_data)} tickets")

        # Knowledge Articles
        articles = [
            ("How to Reset Your MFA Device", "Security", "Step-by-step guide for resetting MFA authenticator apps."),
            ("VPN Troubleshooting Guide", "Network", "Common VPN issues and how to resolve them."),
            ("Ransomware Response Playbook", "Incident Response", "Immediate steps to take when ransomware is detected."),
            ("Password Policy Compliance", "Security", "Requirements for strong passwords and rotation schedules."),
            ("Remote Desktop Best Practices", "Network", "Securing and optimizing RDP connections."),
        ]
        for title, category, content in articles:
            KnowledgeArticle.objects.get_or_create(
                title=title, tenant=tenant,
                defaults={"category": category, "content": content}
            )
        self._ok(f"{len(articles)} knowledge articles")

    def _seed_billing(self, tenant, admin):
        self.stdout.write("\n  ── Billing")
        from apps.billing.models import Plan, Subscription, Invoice

        now = timezone.now()

        # Plans
        plans_data = [
            ("Essential", "essential", Decimal("299.00"), Decimal("2990.00")),
            ("Professional", "professional", Decimal("799.00"), Decimal("7990.00")),
            ("Enterprise", "enterprise", Decimal("1999.00"), Decimal("19990.00")),
        ]
        plans = []
        for name, slug, monthly, yearly in plans_data:
            plan, _ = Plan.objects.get_or_create(
                slug=slug,
                defaults={
                    "tenant": tenant,
                    "name": name,
                    "price_monthly": monthly,
                    "price_yearly": yearly,
                    "stripe_price_id_monthly": f"price_demo_{slug}_monthly",
                    "stripe_price_id_yearly": f"price_demo_{slug}_yearly",
                    "included_modules": ["endpoint", "cloud", "email", "alerts"],
                    "is_active": True,
                }
            )
            plans.append(plan)
        self._ok(f"{len(plans)} plans")

        # Subscriptions
        Subscription.objects.get_or_create(
            user=admin, plan=plans[2],
            defaults={
                "tenant": tenant,
                "status": "active",
                "seat_count": 25,
                "stripe_subscription_id": "sub_demo_enterprise",
                "stripe_customer_id": "cus_demo_001",
                "current_period_end": now + timedelta(days=30),
            }
        )
        self._ok("1 active enterprise subscription")

        # Invoices
        invoices_data = [
            ("INV-2026-001", "paid", Decimal("1999.00")),
            ("INV-2026-002", "paid", Decimal("1999.00")),
            ("INV-2026-003", "paid", Decimal("1999.00")),
            ("INV-2026-004", "pending", Decimal("1999.00")),
        ]
        for inv_num, status, amount in invoices_data:
            Invoice.objects.get_or_create(
                invoice_number=inv_num,
                defaults={
                    "tenant": tenant,
                    "user": admin,
                    "status": status,
                    "amount": amount,
                    "currency": "USD",
                    "due_date": now + timedelta(days=30),
                }
            )
        self._ok(f"{len(invoices_data)} invoices")

    def _seed_soc(self, tenant, admin):
        self.stdout.write("\n  ── Security (SOC)")
        from apps.soc.models import Alert, Incident

        alerts_data = [
            ("Brute force attack detected", "critical", "External Firewall"),
            ("Unusual outbound traffic spike", "high", "IDS"),
            ("Failed sudo attempts on server", "medium", "SIEM"),
            ("Malware signature matched on endpoint", "critical", "EDR"),
            ("Unauthorized port scan detected", "high", "IDS"),
            ("SSL certificate validation failure", "low", "Web Proxy"),
        ]
        alerts = []
        for title, severity, source in alerts_data:
            alert, _ = Alert.objects.get_or_create(
                title=title, tenant=tenant,
                defaults={
                    "description": f"Automated detection: {title}",
                    "severity": severity,
                    "source": source,
                    "is_resolved": False,
                }
            )
            alerts.append(alert)
        self._ok(f"{len(alerts)} alerts")

        # Incidents
        incidents_data = [
            ("Suspected credential compromise — Finance team", "investigating"),
            ("Ransomware containment — Workstation cluster 3", "investigating"),
            ("Insider threat investigation — HR data access", "open"),
        ]
        for title, status in incidents_data:
            Incident.objects.get_or_create(
                title=title, tenant=tenant,
                defaults={
                    "description": f"IR team engaged: {title}",
                    "status": status,
                    "assigned_to": admin,
                }
            )
        self._ok(f"{len(incidents_data)} incidents")

    def _seed_hrm(self, tenant, admin):
        self.stdout.write("\n  ── HRM")
        from apps.hrm.models import Employee, LeaveRequest, Department

        departments = ["Engineering", "Security", "Sales", "Operations", "Finance"]
        employee_names = [
            ("Alice", "Chen"), ("Bob", "Kumar"), ("Carlos", "Reyes"),
            ("Diana", "Park"), ("Ethan", "Muller"), ("Fatima", "Al-Hassan"),
            ("George", "Nkosi"), ("Hannah", "Johansson"), ("Ivan", "Petrov"),
            ("Julia", "Santos"),
        ]

        employees = []
        for i, (first, last) in enumerate(employee_names):
            # Create or get user
            email = f"{first.lower()}.{last.lower()}@bitguard.tech"
            emp_user, _ = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": email.split("@")[0],
                    "first_name": first,
                    "last_name": last,
                    "tenant": tenant,
                }
            )
            # Create employee
            dept, _ = Department.objects.get_or_create(
                name=departments[i % len(departments)],
                tenant=tenant
            )
            emp, _ = Employee.objects.get_or_create(
                user=emp_user,
                tenant=tenant,
                defaults={
                    "employee_id": f"EMP-{i+1:03d}",
                    "department": dept,
                    "job_title": random.choice(["Security Analyst", "DevOps Engineer", "SOC Analyst", "Account Manager"]),
                    "status": "active",
                    "hire_date": date.today() - timedelta(days=random.randint(90, 1000)),
                }
            )
            employees.append(emp)
        self._ok(f"{len(employees)} employees")

        # Leave requests
        for i in range(3):
            LeaveRequest.objects.get_or_create(
                employee=employees[i],
                start_date=date.today() + timedelta(days=random.randint(5, 20)),
                defaults={
                    "tenant": tenant,
                    "end_date": date.today() + timedelta(days=random.randint(21, 30)),
                    "leave_type": random.choice(["annual", "sick", "personal"]),
                    "status": "pending",
                    "reason": "Planned leave",
                }
            )
        self._ok("3 pending leave requests")

    def _seed_scm(self, tenant, admin):
        self.stdout.write("\n  ── SCM / Procurement")
        from apps.scm.models import PurchaseOrder, InventoryItem, Vendor

        vendors = ["Dell Technologies", "Palo Alto Networks", "CrowdStrike", "Cisco Systems"]
        for i, vendor_name in enumerate(vendors):
            vendor_obj, _ = Vendor.objects.get_or_create(
                name=vendor_name,
                tenant=tenant,
                defaults={"status": "active"}
            )
            PurchaseOrder.objects.get_or_create(
                vendor=vendor_obj,
                tenant=tenant,
                defaults={
                    "status": random.choice(["draft", "sent", "received"]),
                    "total_cost": Decimal(str(random.randint(5000, 50000))),
                    "order_date": date.today() - timedelta(days=random.randint(1, 30)),
                }
            )
        self._ok(f"{len(vendors)} purchase orders")

        inventory_items = [
            ("CrowdStrike Falcon Licenses", 25, 5),
            ("Palo Alto Firewall Units", 8, 2),
            ("Yubikey MFA Tokens", 100, 20),
            ("Laptop Replacement Stock", 6, 3),
            ("Network Switches", 4, 2),
        ]
        for name, qty, reorder in inventory_items:
            InventoryItem.objects.get_or_create(
                product_name=name, tenant=tenant,
                defaults={
                    "quantity_on_hand": qty,
                    "reorder_level": reorder,
                    "unit_cost": Decimal(str(random.randint(50, 2000))),
                }
            )
        self._ok(f"{len(inventory_items)} inventory items")

    def _seed_projects(self, tenant, admin):
        self.stdout.write("\n  ── Projects")
        from apps.projects.models import Project, Task

        projects_data = [
            ("Zero-Trust Architecture Rollout", "active"),
            ("SOC 2 Type II Compliance", "active"),
            ("SIEM Platform Migration", "planning"),
            ("Customer Portal Launch", "active"),
            ("Annual Penetration Test", "planning"),
        ]

        projects = []
        for name, status in projects_data:
            proj, _ = Project.objects.get_or_create(
                name=name, tenant=tenant,
                defaults={
                    "status": status,
                    "description": f"Strategic initiative: {name}",
                    "start_date": date.today() - timedelta(days=random.randint(10, 60)),
                    "deadline": date.today() + timedelta(days=random.randint(30, 120)),
                    "manager": admin,
                }
            )
            projects.append(proj)
        self._ok(f"{len(projects)} projects")

        # Tasks (some overdue)
        task_names = [
            "Requirements gathering", "Vendor evaluation", "Kickoff meeting",
            "Initial deployment", "Security review", "Testing & QA",
            "Documentation", "Sign-off", "Handover",
        ]
        task_count = 0
        for project in projects[:3]:
            for i, task_name in enumerate(task_names[:4]):
                due = date.today() - timedelta(days=random.randint(1, 10)) if i < 2 else date.today() + timedelta(days=random.randint(5, 30))
                Task.objects.get_or_create(
                    title=task_name,
                    project=project,
                    defaults={
                        "tenant": tenant,
                        "status": "in_progress" if i < 2 else "todo",
                        "due_date": due,
                        "assignee": admin,
                    }
                )
                task_count += 1
        self._ok(f"{task_count} tasks")

    def _seed_contracts(self, tenant, admin):
        self.stdout.write("\n  ── Contracts")
        from apps.contracts.models import ServiceContract, SLATier

        from apps.crm.models import Client
        clients = list(Client.objects.filter(tenant=tenant)[:5])

        sla, _ = SLATier.objects.get_or_create(
            name="Premium 24x7",
            defaults={
                "first_response_hours": 1,
                "resolution_hours": 4,
                "uptime_percent": Decimal("99.99"),
                "coverage": "always_on",
            }
        )

        contracts_data = [
            ("msp", "Managed Security Services Agreement"),
            ("retainer", "Incident Response Retainer"),
            ("support", "Compliance Monitoring SLA"),
            ("project", "Annual Security Audit"),
            ("saas", "Cloud Security Monitoring"),
        ]

        for i, (ctype, notes) in enumerate(contracts_data):
            client = clients[i % len(clients)] if clients else None
            if client:
                ServiceContract.objects.get_or_create(
                    client=client, tenant=tenant, contract_type=ctype,
                    defaults={
                        "sla_tier": sla,
                        "status": "active",
                        "start_date": date.today() - timedelta(days=random.randint(30, 180)),
                        "end_date": date.today() + timedelta(days=random.randint(30, 365)),
                        "monthly_value": Decimal(str(random.randint(12000, 120000))),
                        "assigned_to": admin,
                        "notes": notes,
                    }
                )
        self._ok(f"{len(contracts_data)} active service contracts")

    def _seed_itam(self, tenant, admin):
        self.stdout.write("\n  ── IT Assets (ITAM)")
        from apps.itam.models import Asset

        assets_data = [
            ("FW-CORE-01", "Palo Alto PA-3260", "network"),
            ("SRV-SOC-01", "Dell PowerEdge R750", "server"),
            ("SRV-SOC-02", "Dell PowerEdge R750", "server"),
            ("WS-ANALYST-01", "Dell Latitude 5540", "laptop"),
            ("WS-ANALYST-02", "Dell Latitude 5540", "laptop"),
            ("SW-CORE-01", "Cisco Catalyst 9300", "network"),
            ("LAPTOP-EXEC-01", "MacBook Pro M3", "laptop"),
            ("NAS-BACKUP-01", "Synology RS3621xs+", "server"),
        ]
        for asset_tag, name, asset_type in assets_data:
            Asset.objects.get_or_create(
                asset_tag=asset_tag, tenant=tenant,
                defaults={
                    "name": name,
                    "asset_type": asset_type,
                    "status": "active",
                    "purchase_date": date.today() - timedelta(days=random.randint(90, 730)),
                    "assigned_to": admin,
                }
            )
        self._ok(f"{len(assets_data)} IT assets")

    def _seed_notifications(self, tenant, admin):
        self.stdout.write("\n  ── Notifications (Activity Feed)")
        from apps.notifications.models import Notification

        now = timezone.now()

        messages = [
            ("VPN Alert", "🔐 Critical alert: Brute force detected on VPN gateway", "soc"),
            ("Ticket Closed", "✅ Ticket #1042 resolved — MFA issue closed", "system"),
            ("Contract Signed", "📋 Contract signed: Managed Security Services — Apex Dynamics", "crm"),
            ("Certificate Warning", "⚠️  SSL certificate expiring in 14 days", "soc"),
            ("Invoice Issued", "🧾 Invoice INV-2026-004 issued — $1,999.00 pending", "erp"),
            ("Ransomware Alert", "🛡️  Ransomware containment: Workstation cluster 3 isolated", "soc"),
            ("Client Onboarded", "👤 New client onboarded: Summit Logistics", "crm"),
            ("Audit Progress", "📊 SOC 2 audit evidence collection — 72% complete", "system"),
        ]

        for i, (title, msg, ntype) in enumerate(messages):
            Notification.objects.get_or_create(
                message=msg,
                user=admin,
                title=title,
                defaults={
                    "tenant": tenant,
                    "type": ntype,
                    "is_read": i > 4,
                    "created_at": now - timedelta(hours=i * 3),
                }
            )
        self._ok(f"{len(messages)} notifications")
