import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.system.domain.models import InstalledModule
from apps.tenants.domain.models import Tenant

def seed_modules():
    tenants = Tenant.objects.all()
    
    modules_data = [
        {
            "technical_name": "crm",
            "name": "CRM",
            "author": "BitGuard",
            "version": "1.0",
            "category": "Sales",
            "summary": "Track leads and close opportunities",
            "description": "A comprehensive CRM module for managing your sales pipeline.",
            "icon": "Target",
            "is_installed": True,
            "application": True,
            "url": "/crm",
            "featured": True,
        },
        {
            "technical_name": "sale",
            "name": "Sales",
            "author": "BitGuard",
            "version": "1.0",
            "category": "Sales",
            "summary": "From quotations to invoices",
            "description": "Manage your sales orders, quotes, and invoicing seamlessly.",
            "icon": "DollarSign",
            "is_installed": True,
            "application": True,
            "url": "/sales",
            "featured": True,
        },
        {
            "technical_name": "accounting",
            "name": "Accounting",
            "author": "BitGuard",
            "version": "1.0",
            "category": "Finance",
            "summary": "Manage financial and analytic accounting",
            "description": "A fully featured accounting app for managing books and statements.",
            "icon": "FileText",
            "is_installed": True,
            "application": True,
            "url": "/accounting",
            "featured": True,
        },
        {
            "technical_name": "stock",
            "name": "Inventory",
            "author": "BitGuard",
            "version": "1.0",
            "category": "Operations",
            "summary": "Manage your stock and logistics activities",
            "description": "Advanced warehouse management and routing.",
            "icon": "Package",
            "is_installed": True,
            "application": True,
            "url": "/inventory",
            "featured": True,
        },
        {
            "technical_name": "helpdesk",
            "name": "Helpdesk",
            "author": "BitGuard",
            "version": "1.0",
            "category": "Services",
            "summary": "Track, prioritize, and solve customer tickets",
            "description": "Customer support and ticketing module.",
            "icon": "LifeBuoy",
            "is_installed": True,
            "application": True,
            "url": "/helpdesk",
            "featured": True,
        },
        {
            "technical_name": "project",
            "name": "Projects",
            "author": "BitGuard",
            "version": "1.0",
            "category": "Services",
            "summary": "Organize and schedule your projects",
            "description": "Task management and time tracking.",
            "icon": "Briefcase",
            "is_installed": True,
            "application": True,
            "url": "/projects",
            "featured": False,
        },
        {
            "technical_name": "hr",
            "name": "Employees",
            "author": "BitGuard",
            "version": "1.0",
            "category": "Human Resources",
            "summary": "Centralize employee information",
            "description": "Manage staff, contracts, and attendance.",
            "icon": "Users",
            "is_installed": True,
            "application": True,
            "url": "/hr",
            "featured": False,
        },
        {
            "technical_name": "documents",
            "name": "Documents",
            "author": "BitGuard",
            "version": "1.0",
            "category": "Operations",
            "summary": "Document management",
            "description": "Store and share files securely.",
            "icon": "Folder",
            "is_installed": True,
            "application": True,
            "url": "/documents",
            "featured": False,
        },
        {
            "technical_name": "board",
            "name": "Dashboards",
            "author": "BitGuard",
            "version": "1.0",
            "category": "Productivity",
            "summary": "Build your own dashboards",
            "description": "Create custom analytics and reporting views.",
            "icon": "LayoutDashboard",
            "is_installed": True,
            "application": True,
            "url": "/dashboard",
            "featured": False,
        },
    ]

    count = 0
    for tenant in tenants:
        for mod_data in modules_data:
            obj, created = InstalledModule.objects.get_or_create(
                tenant=tenant,
                technical_name=mod_data["technical_name"],
                defaults={k:v for k,v in mod_data.items() if k != "technical_name"}
            )
            if created:
                count += 1
            else:
                for k,v in mod_data.items():
                    if k != "technical_name":
                        setattr(obj, k, v)
                obj.save()
                
    print(f"Seeded {count} new ERP module entries. Updated existing ones.")

if __name__ == '__main__':
    seed_modules()
