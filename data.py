import os
import django
import sys
import random
from datetime import timedelta
from django.utils import timezone
from decimal import Decimal

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bitguard.settings')
django.setup()

from django.core.management import call_command
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile

# Import Models
from apps.crm.models import Client, Contact, Contract, Ticket, Project as CRMProject
from apps.erp.models import (
    OperationKPI, Service, InternalProject, Milestone,
    EmployeeProfile, Task, Asset, Vendor, VendorContract,
    RiskRegister, ComplianceItem, Invoice, InvoiceItem,
    Integration, TimeLog, Expense
)
from apps.store.models import Product, Plan, Subscription, Order
from apps.blog.models import Post, Category
from apps.security.models import (
    SecurityAlert as Alert, 
    SecurityIncident as Incident, 
    Asset as Endpoint, 
    EmailThreat, 
    NetworkEvent, 
    SecurityGap,
    CloudApp
)
from apps.tenants.models import (
    Workspace, 
    SystemMonitor, 
    CloudIntegration, 
    HealthMetric
)
from apps.home.models import Announcement

User = get_user_model()

# ==============================================================================
# 0. MIGRATIONS
# ==============================================================================
def run_migrations():
    print("Applying database migrations...")
    call_command('migrate')

# ==============================================================================
# 1. USER MANAGEMENT & RBAC
# ==============================================================================
def create_users():
    print("\n" + "="*50)
    print("MODULE: USERS & PERMISSIONS")
    print("="*50)
    # Admin
    admin, created = User.objects.get_or_create(
        username='admin',
        defaults={'email': 'younessb329@gmail.com', 'is_staff': True, 'is_superuser': True}
    )
    if created:
        admin.set_password('admin')
        admin.save()
        print("  - Admin created (admin/admin)")
    else:
        print("  - Admin exists")

    # Define Groups
    from django.contrib.auth.models import Group
    groups = {
        'Executives': Group.objects.get_or_create(name='Executives')[0],
        'Operations': Group.objects.get_or_create(name='Operations')[0],
        'Sales': Group.objects.get_or_create(name='Sales')[0],
        'Store': Group.objects.get_or_create(name='Store Managers')[0],
        'Engineering': Group.objects.get_or_create(name='Engineering')[0],
        'SOC': Group.objects.get_or_create(name='SOC Analysts')[0],
    }

    # Detailed Staff List with Roles and Permissions
    # Format: (username, Full Name, Job Title, Skills, is_staff_manager, is_engineer, [GroupNames])
    employees = [
        # Executive
        ('sarah.cfo', 'Sarah Conner', 'Chief Financial Officer', 'Finance, Strategy', True, False, ['Executives']),
        ('david.cto', 'David Lightman', 'Chief Technology Officer', 'Architecture, AI', True, True, ['Executives', 'Engineering']),
        
        # Operations & Management
        ('charlie.ops', 'Charlie Davis', 'Operations Director', 'ITIL, Agile', True, False, ['Operations']),
        ('pam.admin', 'Pam Beesly', 'Office Administrator', 'HR, Logistics', True, False, ['Operations']),
        
        # Sales & CRM
        ('emily.sales', 'Emily Blunt', 'Sales Director', 'CRM, Negotiation', True, False, ['Sales']),
        ('jim.sales', 'Jim Halpert', 'Account Manager', 'Sales, Client Relations', False, False, ['Sales']),
        
        # Store & Inventory
        ('kevin.store', 'Kevin Malone', 'Store Manager', 'Inventory, Logistics', True, False, ['Store']),
        
        # Security Operations Center (SOC)
        ('alice.engineer', 'Alice Chen', 'Senior Security Engineer', 'SIEM, Python, AWS', False, True, ['Engineering', 'SOC']),
        ('bob.analyst', 'Bob Miller', 'SOC Analyst', 'Wireshark, Splunk', False, True, ['SOC']),
        ('elliot.sec', 'Elliot Alderson', 'Lead Security Researcher', 'Pentesting, Reverse Engineering', False, True, ['Engineering']),
        ('trent.boyett', 'Trent Boyett', 'Junior Analyst', 'Monitoring, Triage', False, True, ['SOC']),
        
        # DevOps & Cloud
        ('dinesh.cloud', 'Dinesh Chugtai', 'DevOps Engineer', 'Kubernetes, Terraform, Azure', False, True, ['Engineering']),
        ('gilfoyle.sys', 'Bertram Gilfoyle', 'Systems Architect', 'Linux, Networking, Security', False, True, ['Engineering']),
    ]
    
    profiles = []
    for username, name, role, skills, is_manager, is_engineer, group_names in employees:
        email = f"{username}@bitguard.tech"
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': email, 
                'first_name': name.split()[0], 
                'last_name': name.split()[-1],
                'is_staff': is_manager 
            }
        )
        if created:
            user.set_password('password123')
            user.save()
            print(f"  - Created {role}: {email}")
        
        # Assign Groups
        for g_name in group_names:
            if g_name in groups:
                user.groups.add(groups[g_name])

        # Create EmployeeProfile for all staff
        seniority = 'senior' if 'Senior' in role or 'Lead' in role or 'Architect' in role or 'CTO' in role or 'Director' in role else ('junior' if 'Junior' in role else 'mid')
        EmployeeProfile.objects.get_or_create(
            user=user,
            defaults={
                'job_title': role,
                'department': next((k for k, v in groups.items() if v in user.groups.all()), 'Engineering').lower(),
                'seniority': seniority,
                'skills': skills,
                'phone': f"+1 (555) {random.randint(100, 999)}-{random.randint(1000, 9999)}",
                'location': random.choice(['New York, NY', 'San Francisco, CA', 'London, UK', 'Remote', 'Austin, TX']),
                'start_date': timezone.now().date() - timedelta(days=random.randint(30, 1000)),
                'current_load': random.randint(10, 95),
                'internal_cost_rate': Decimal(random.choice([50, 75, 100, 150, 200]))
            }
        )
        profiles.append(user)
    
    return admin, profiles

# ==============================================================================
# 2. CRM MODULE
# ==============================================================================
def create_crm_data(admin):
    print("\n" + "="*50)
    print("MODULE: CRM (Client Relationship Management)")
    print("="*50)
    Client.objects.all().delete()
    
    clients_data = [
        ('Massive Dynamic', 'company', 'bronze'),
        ('Cyberdyne Systems', 'company', 'platinum'),
        ('Acme Corp', 'company', 'silver'),
        ('Wayne Enterprises', 'company', 'gold'),
    ]
    
    clients = []
    for name, ctype, sla in clients_data:
        client = Client.objects.create(
            name=name,
            company_name=name,
            client_type=ctype,
            sla_level=sla,
            status='active',
            account_manager=admin,
            website=f"https://www.{name.lower().replace(' ', '')}.com"
        )
        clients.append(client)
        
        # Create Contract
        Contract.objects.create(
            client=client,
            name=f"{name} Master Services Agreement",
            start_date=timezone.now().date(),
            end_date=timezone.now().date() + timedelta(days=365),
            value=Decimal('120000.00'),
            is_active=True
        )
        
    return clients

def create_crm_tickets(clients, admin):
    print("  - Creating Support Tickets...")
    Ticket.objects.all().delete()
    
    issues = [
        ('support', 'Unable to access VPN', 'User getting timeout error on connection.', 'medium'),
        ('incident', 'Phishing Attempt Reported', 'suspicious email fromceo@bitguard.net', 'high'),
        ('access', 'Request for AWS Access', 'Developer needs read access to S3.', 'low'),
        ('billing', 'Invoice Discrepancy', 'Charge for unused seat.', 'medium'),
    ]
    
    for client in clients:
        for _ in range(random.randint(1, 3)):
            t_type, summary, desc, prio = random.choice(issues)
            Ticket.objects.create(
                client=client,
                summary=summary,
                description=desc,
                ticket_type=t_type,
                priority=prio,
                status=random.choice(['open', 'in_progress', 'resolved']),
                created_by=admin
            )
    return True

    return True

def create_crm_projects(clients, admin):
    print("  - Creating CRM Projects...")
    CRMProject.objects.all().delete()
    
    crm_projects = {} # Map client -> [projects]
    
    for client in clients:
        # Create 1-2 projects per client
        c_projs = []
        for i in range(random.randint(1, 2)):
            proj = CRMProject.objects.create(
                client=client,
                name=f"{client.name} Strategic Initiative {2025+i}",
                description="High-level strategic engagement.",
                status=random.choice(['in_progress', 'not_started', 'completed']),
                progress=random.randint(0, 100),
                start_date=timezone.now().date(),
                end_date=timezone.now().date() + timedelta(days=90)
            )
            c_projs.append(proj)
        crm_projects[client.id] = c_projs
        
    return crm_projects

def create_invoices(orders):
    print("  - Generatings Invoices from Orders...")
    Invoice.objects.all().delete()
    
    count = 0
    for order in orders:
        if not hasattr(order, 'temp_client') or not order.temp_client:
            continue
            
        client = order.temp_client
        issue_date = order.created_at.date()
        
        # Logic: If order is paid, invoice is paid
        status = 'paid' if order.status == 'paid' else 'sent'

        # Try to link to a project and contract
        project = InternalProject.objects.filter(client=client).first()
        contract = Contract.objects.filter(client=client).first()
        
        inv = Invoice.objects.create(
            client=client,
            project=project, # Link to project if exists
            contract=contract, # LINK TO CONTRACT
            order=order, # LINKING THE INVOICE TO THE ORDER
            invoice_number=f"INV-{10000 + order.id}",
            status=status,
            issue_date=issue_date,
            due_date=issue_date + timedelta(days=30),
            paid_date=issue_date if status == 'paid' else None,
            notes=f"Generated from Order #{order.id}"
        )
        
        # Create Invoice Item mirroring the Order Product
        if order.product:
            InvoiceItem.objects.create(
                invoice=inv,
                product=order.product, # LINK TO PRODUCT (Inventory)
                description=order.product.name,
                quantity=1,
                unit_price=order.amount,
                amount=order.amount
            )
            
        inv.subtotal = order.amount
        inv.tax = Decimal(str(order.amount)) * Decimal('0.10')
        inv.total = Decimal(str(inv.subtotal)) + inv.tax
        inv.save()
        count += 1
            
    print(f"  - {count} Invoices generated from Orders.")
    return True

# ==============================================================================
# 3. ERP MODULE
# ==============================================================================
def create_erp_data(staff_users, clients, crm_projects_map):
    print("\n" + "="*50)
    print("MODULE: ERP (Enterprise Resource Planning)")
    print("="*50)
    
    # 1. KPIs
    kpis = [
        ('Global SLA Health', 'sla', '98.5%', 'healthy', 'Tracking above target'),
        ('Active Critical Incidents', 'incidents', '1', 'warning', 'Ransomware containment in progress'),
        ('SOC Utilization', 'resource', '82%', 'healthy', 'Optimal load'),
        ('Compliance Audit', 'compliance', 'ISO 27001', 'healthy', 'Preparation phase'),
    ]
    OperationKPI.objects.all().delete()
    for name, cat, val, status, det in kpis:
        OperationKPI.objects.create(name=name, category=cat, value=val, status=status, detail=det)

    # 2. Services
    services_data = [
        ('SOCaaS Gold', '24/7 Security Operations Center monitoring and response.', 'subscription', 5000.00),
        ('Penetration Testing', 'Comprehensive vulnerability assessment and exploitation.', 'project', 15000.00),
        ('Compliance Audit', 'ISO 27001 and SOC 2 readiness assessment.', 'project', 10000.00),
        ('Incident Response Retainer', 'Guaranteed response time for security incidents.', 'subscription', 2500.00),
        ('CISO as a Service', 'Fractional CISO leadership and strategy.', 'hourly', 250.00),
    ]
    Service.objects.all().delete()
    db_services = []
    for name, desc, stype, price in services_data:
        db_services.append(Service.objects.create(
            name=name,
            description=desc,
            service_type=stype,
            base_price=Decimal(price),
            is_active=True
        ))

    # 3. Projects & Milestones & Expenses
    InternalProject.objects.all().delete()
    Expense.objects.all().delete()
    
    projects = []
    for client in clients:
        client_crm_projs = crm_projects_map.get(client.id, [])
        
        for crm_proj in client_crm_projs:
            # Financials
            revenue = Decimal(random.randint(10000, 50000))
            margin = Decimal(random.uniform(0.15, 0.40))
            budget = revenue * (1 - margin)
            
            # Find Client Contract
            contract = Contract.objects.filter(client=client).first()

            proj = InternalProject.objects.create(
                client=client,
                crm_project=crm_proj, # LINK
                contract=contract, # LINK TO CONTRACT
                name=f"Execution: {crm_proj.name}",
                description=f"Technical delivery for {crm_proj.name}",
                service_type=random.choice(db_services),
                manager=random.choice(staff_users),
                status='active', # active for visibility
                start_date=crm_proj.start_date,
                deadline=crm_proj.end_date,
                revenue=revenue,
                budget_cost=budget
            )
            proj.team.set(random.sample(staff_users, 2))
            projects.append(proj)
            
            # Milestones
            Milestone.objects.create(project=proj, name="Phase 1: Deployment", due_date=timezone.now().date() + timedelta(days=10))
            
            # Expenses
            for _ in range(random.randint(1, 4)):
                Expense.objects.create(
                    project=proj,
                    submitted_by=random.choice(proj.team.all()),
                    description=random.choice(['Server Licensing', 'Travel to Onsite', 'Hardware Procurement', 'Software Tooling']),
                    category=random.choice(['software', 'hardware', 'travel']),
                    amount=Decimal(random.randint(100, 2000)),
                    date=timezone.now().date() - timedelta(days=random.randint(1, 20)),
                    status='approved'
                )

    # 4. Tasks
    Task.objects.all().delete()
    TimeLog.objects.all().delete() # Clean old logs
    titles = ["Configure Firewall Rules", "Agent Deployment", "Log Analysis", "Monthly Report", "Vulnerability Scan", "Client Meeting", "Architecture Review"]
    
    all_tasks = []
    for proj in projects:
        for _ in range(random.randint(3, 8)):
            task = Task.objects.create(
                project=proj,
                title=f"{random.choice(titles)} - {proj.client.name}",
                description="Standard operating procedure execution.",
                assigned_to=random.choice(proj.team.all()) if proj.team.exists() else proj.manager,
                priority=random.choice(['low', 'medium', 'high', 'critical']),
                status=random.choice(['todo', 'in_progress', 'done']),
                estimated_hours=Decimal(random.randint(4, 40)),
                due_date=timezone.now().date() + timedelta(days=random.randint(1, 14))
            )
            all_tasks.append(task)
            
            # Generate Time Logs for this task
            if task.status in ['in_progress', 'done']:
                for _ in range(random.randint(1, 5)):
                    log_date = timezone.now().date() - timedelta(days=random.randint(0, 10))
                    hours = Decimal(random.choice([0.5, 1.0, 2.0, 4.0, 8.0]))
                    TimeLog.objects.create(
                        task=task,
                        user=task.assigned_to,
                        date=log_date,
                        hours=hours,
                        notes=f"Worked on {task.title}"
                    )

    # 5. Assets
    Asset.objects.all().delete()
    asset_types = ['laptop', 'server', 'firewall']
    for i in range(10):
        Asset.objects.create(
            name=f"Asset-{i+100}",
            asset_tag=f"TAG-{random.randint(1000, 9999)}",
            asset_type=random.choice(['laptop', 'server', 'mobile']),
            status=random.choice(['available', 'assigned']),
            assigned_to_user=random.choice(staff_users) if random.random() > 0.5 else None
        )

    # 6. Vendors
    Vendor.objects.all().delete()
    vendors = [
        ('AWS Code', 'Cloud Provider', 'support@aws.amazon.com'),
        ('Splunk Inc', 'SIEM Solution', 'sales@splunk.com'),
        ('CrowdStrike', 'EDR Provider', 'support@crowdstrike.com'),
    ]
    for name, serv, email in vendors:
        v = Vendor.objects.create(name=name, service_provided=serv, email=email)
        VendorContract.objects.create(
            vendor=v, name=f"{name} Enterprise License", 
            start_date=timezone.now().date(), 
            value=Decimal(150000), 
            auto_renew=True
        )

    # 7. Compliance
    RiskRegister.objects.all().delete()
    risks = [
        ("Cloud Misconfiguration", "High", "Medium"),
        ("Phishing Campaign", "Medium", "High"),
        ("Insider Threat", "High", "Low"),
    ]
    for summ, imp, prob in risks:
        RiskRegister.objects.create(
            summary=summ, 
            description=f"Potential risk of {summ.lower()}.", 
            impact=imp.lower(), 
            probability=prob.lower(),
            owner=random.choice(staff_users)
        )

# ==============================================================================
# 4. STORE MODULE
# ==============================================================================
def create_store_data():
    print("\n" + "="*50)
    print("MODULE: STORE (Products & Orders)")
    print("="*50)
    Product.objects.all().delete()
    products = [
        ('BitGuard Antivirus', 'digital', 59.99),
        ('BitGuard Firewall X1', 'physical', 1299.00),
        ('Security Audit Report', 'digital', 499.00),
    ]
    
    db_products = []
    for name, ptype, price in products:
        is_physical = (ptype == 'physical')
        db_products.append(Product.objects.create(
            name=name, 
            slug=name.lower().replace(' ', '-'),
            product_type=ptype,
            price=price,
            description=f"Premium {name} for enterprise protection.",
            stock_quantity=50 if is_physical else 0,
            track_stock=is_physical
        ))

    # Orders (which differ from Subscriptions)
    orders = []
    print("  - Creating Orders linked to Clients...")
    
    # We need clients to link these orders to invoices effectively
    # Let's simple fetch all clients here since we are in a script
    all_clients = list(Client.objects.all())
    
    for p in db_products:
        for _ in range(random.randint(1, 3)):
            # Pick a client to "own" this order (conceptually)
            # In data model, Order belongs to User. Invoice belongs to Client.
            # We'll bridge this gap in the script.
            
            o = Order.objects.create(
                user=None, # Keeping user generic for now
                product=p,
                status='paid',
                amount=p.price,
                payment_method='card',
                stripe_session=f"sess_{random.randint(10000,99999)}"
            )
            # Attach a temporary attribute to use in create_invoices
            o.temp_client = random.choice(all_clients) if all_clients else None
            orders.append(o)
            
    print(f"  - {len(orders)} Orders created.")
    return orders
    
# ==============================================================================
# 5. BLOG MODULE
# ==============================================================================
def create_blog_data(admin):
    print("\n" + "="*50)
    print("MODULE: BLOG (Company News & Insights)")
    print("="*50)
    Post.objects.all().delete()
    Category.objects.all().delete()
    
    cat_security = Category.objects.create(name="Security Insights")
    cat_company = Category.objects.create(name="Company News")
    
    posts = [
        ("New SOC Capability Announced", cat_company, "We are thrilled to announce our new 24/7 SOC."),
        ("Q3 Threat Landscape Report", cat_security, "Ransomware attacks have increased by 300%..."),
        ("Zero Trust Architecture Explained", cat_security, "Why you need to move beyond VPNs."),
    ]
    
    for title, cat, content in posts:
        Post.objects.create(
            title=title,
            slug=title.lower().replace(' ', '-'),
            author=admin,
            content=content,
            category=cat,
            status='published',
            publish_date=timezone.now()
        )

def create_plans():
    print("  - Populating Plans...")
    
    # 1. Essential
    Plan.objects.get_or_create(
        slug='essential',
        defaults={
            'name': 'Essential',
            'price_monthly': 10,
            'price_yearly': 8,
            'stripe_price_id_monthly': 'price_essential_monthly',
            'stripe_price_id_yearly': 'price_essential_yearly',
            'included_modules': ['endpoint', 'email', 'reporting']
        }
    )
    
    # 2. Pro
    Plan.objects.get_or_create(
        slug='pro',
        defaults={
            'name': 'Pro',
            'price_monthly': 25,
            'price_yearly': 20,
            'stripe_price_id_monthly': 'price_pro_monthly',
            'stripe_price_id_yearly': 'price_pro_yearly',
            'included_modules': ['endpoint', 'email', 'cloud', 'network', 'advanced_reports', 'priority_support']
        }
    )
    
    # 3. Enterprise
    Plan.objects.get_or_create(
        slug='enterprise',
        defaults={
            'name': 'Enterprise',
            'price_monthly': 50,
            'price_yearly': 45,
            'stripe_price_id_monthly': 'price_ent_monthly',
            'stripe_price_id_yearly': 'price_ent_yearly',
            'included_modules': ['all_modules', 'sso', 'compliance_manager', 'dedicated_csm', '24_7_soc']
        }
    )
    print("  - Plans created successfully!")

# ==============================================================================
# 6. DASHBOARD & PLATFORM
# ==============================================================================
def create_platform_dashboard(admin):
    print("\n" + "="*50)
    print("MODULE: PLATFORM DASHBOARD")
    print("="*50)
    
    # Clean existing
    Alert.objects.all().delete()
    Endpoint.objects.all().delete()
    Incident.objects.all().delete()
    HealthMetric.objects.all().delete()
    CloudIntegration.objects.all().delete()
    Workspace.objects.all().delete()
    
    # Create Workspaces
    ws1, _ = Workspace.objects.get_or_create(name="BITGUARD")
    ws2, _ = Workspace.objects.get_or_create(name="BITGUARD1")
    
    ws1.users.add(admin)
    ws2.users.add(admin)
    
    workspaces = [ws1, ws2]

    # Create Health Metrics (Per Workspace)
    for ws in workspaces:
        HealthMetric.objects.create(workspace=ws, name='Workspace Health', score=random.randint(80, 98))
        HealthMetric.objects.create(workspace=ws, name='Tickets Management', score=random.randint(70, 95))
        HealthMetric.objects.create(workspace=ws, name='Security Gaps', score=random.randint(60, 90))
    
    # Create Endpoints
    endpoints = []
    for i in range(15):
        ws = random.choice(workspaces)
        ep = Endpoint.objects.create(
            workspace=ws,
            name=f"WORKSTATION-{i:03d}-{ws.name}",
            ip_address=f"10.0.1.{10+i}",
            os_version="Windows 11 Pro",
            status=random.choice(['secure', 'secure', 'at_risk', 'offline']),
            risk_score=random.randint(0, 80)
        )
        endpoints.append(ep)
        
    # Compromised Endpoint
    bad_ep = Endpoint.objects.create(
        workspace=ws1, # Assign to BITGUARD
        name="FINANCE-PC-01", 
        ip_address="10.0.1.99",
        os_version="Windows 10",
        status="compromised",
        risk_score=95
    )
    
    # Create Alerts
    severities = ['low', 'medium', 'high', 'critical']
    modules = ['endpoint_security', 'network_security', 'email_security', 'cloud_security']
    
    # Specific Critical Alert
    Alert.objects.create(
        workspace=ws1,
        title="Malware Detected on FINANCE-PC-01",
        description="Ransomware signature detected in C:/Users/Admin/Downloads/invoice.exe",
        severity="critical",
        status="active",
        source="endpoint_security", # Renamed from alert_source
        raw_data={"endpoint_id": bad_ep.id, "weights": {"asset_criticality": 30, "threat_intel_match": True}} # Renamed from contextual_data
    )
    
    # Specific High Alert
    Alert.objects.create(
        workspace=ws2,
        title="Suspicious Login Attempt",
        description="Multiple failed login attempts from IP 192.168.1.50",
        severity="high",
        status="investigating",
        source="identity", # Renamed from alert_source
        raw_data={"source_ip": "192.168.1.50"} # Renamed from contextual_data
    )
    
    # Random Alerts
    for i in range(12):
        ws = random.choice(workspaces)
        Alert.objects.create(
            workspace=ws,
            title=f"Routine Scan Alert {i}",
            description="Minor policy violation detected.",
            severity=random.choice(['low', 'medium']),
            status='active',
            source=random.choice(modules), # Renamed from alert_source
            raw_data={"weights": {"repeat_events": False}} # Renamed from contextual_data
        )

    # Create Incidents
    Incident.objects.create(
        workspace=ws1,
        title="Ransomware Outbreak",
        description="Containment of ransomware on Finance subnet.",
        severity="critical",
        status="containment",
        created_at=timezone.now() - timedelta(hours=2) # Renamed from started_at
    )

    # Integrations
    CloudIntegration.objects.create(workspace=ws1, name="Microsoft 365", provider="Microsoft", status="connected")
    CloudIntegration.objects.create(workspace=ws2, name="AWS Production", provider="AWS", status="connected")
    
    print("  - Data populated for dashboard.")

    print("  - Data populated for dashboard.")

# ==============================================================================
# 7. HOME MODULE (ANNOUNCEMENTS)
# ==============================================================================
def create_home_data():
    print("\n" + "="*50)
    print("MODULE: HOME (Announcements)")
    print("="*50)
    Announcement.objects.all().delete()
    
    announcements = [
        ("BitGuard Receives ISO 27001 Certification", "We are proud to announce that BitGuard has achieved ISO 27001 certification, demonstrating our commitment to the highest standards of information security. This milestone validates our dedication to protecting client data and maintaining robust operational controls."),
        ("New AI Threat Engine Released", "Our new AI engine reduces false positives by 99% and detects zero-day threats in real-time. By leveraging advanced machine learning models trained on over 10 petabytes of threat data, BitGuard now offers the most proactive defense in the industry. Available now for all Enterprise customers."),
        ("Strategic Partnership with CloudSecure", "BitGuard has partnered with CloudSecure to provide seamless multi-cloud protection. This integration allows unified policy enforcement across AWS, Azure, and Google Cloud, simplifying compliance and security management for hybrid infrastructures."),
    ]
    
    for title, content in announcements:
        Announcement.objects.create(title=title, content=content)
    
    print("  - Announcements created.")

def create_integrations_data():
    print("\n" + "="*50)
    print("MODULE: INTEGRATIONS")
    print("="*50)
    Integration.objects.all().delete()
    
    integrations = [
        ('stripe', 'sk_test_4eC39HqLyjWDarjtT1zdp7dc', 'https://api.bitguard.tech/webhooks/stripe'),
        ('slack', 'xoxb-1234567890-1234567890123-AbCdEfGhIjKlMnOpQrStUvWx', 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX'),
        ('github', 'ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 'https://api.bitguard.tech/webhooks/github'),
    ]
    
    for name, key, url in integrations:
        Integration.objects.create(
            name=name,
            api_key=key,
            webhook_url=url,
            is_active=True,
            connected_at=timezone.now()
        )
    print("  - Integrations created.")

def main():
    run_migrations()
    admin, staff = create_users()
    create_platform_dashboard(admin)
    clients = create_crm_data(admin)
    clients = create_crm_data(admin)
    create_crm_tickets(clients, admin)
    crm_projects_map = create_crm_projects(clients, admin)
    create_erp_data(staff, clients, crm_projects_map)
    create_integrations_data()
    orders = create_store_data() # Returns orders
    create_plans()
    create_invoices(orders) # Uses orders to make invoices

    create_invoices(orders) # Uses orders to make invoices

    create_blog_data(admin)
    create_home_data()
    print("==========================================")
    print("DATA POPULATION COMPLETE")
    print("User: admin / admin")
    print("==========================================")

if __name__ == '__main__':
    main()
