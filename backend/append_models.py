import os
import sys

# use relative path so wsl python works
BASE_DIR = "."

def append_to_file(filepath, content):
    if not os.path.exists(filepath):
        # Fallback to models.py if domain/models.py doesn't exist
        alt_filepath = filepath.replace("domain/models.py", "models.py")
        if os.path.exists(alt_filepath):
            filepath = alt_filepath
        else:
            print(f"File not found: {filepath} and {alt_filepath}")
            # Ensure dir exists
            os.makedirs(os.path.dirname(alt_filepath), exist_ok=True)
            filepath = alt_filepath
            with open(filepath, "w") as f:
                f.write("from django.db import models\nfrom apps.core.domain.models import BaseModel, TenantAwareModel\n\n")

    with open(filepath, "a") as f:
        f.write("\n\n" + content + "\n")
    print(f"Updated {filepath}")

# 1. Services: Planning & Appointments
services_content = """
# --- PLANNING & APPOINTMENTS (Frontend Visual Matching) ---
class ResourceShift(TenantAwareModel):
    title = models.CharField(max_length=255)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return self.title

class Appointment(TenantAwareModel):
    title = models.CharField(max_length=255)
    scheduled_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50, default='scheduled')

    def __str__(self):
        return self.title
"""
append_to_file("apps/services/domain/models.py", services_content)

# 2. Projects: Timesheets
projects_content = """
# --- TIMESHEETS (Frontend Visual Matching) ---
class TaskTimesheet(TenantAwareModel):
    description = models.CharField(max_length=255)
    hours_logged = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.description
"""
append_to_file("apps/projects/domain/models.py", projects_content)

# 3. Accounting: Expenses
accounting_content = """
# --- EXPENSES (Frontend Visual Matching) ---
class ExpenseReport(TenantAwareModel):
    title = models.CharField(max_length=255)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    status = models.CharField(max_length=50, default='draft')

    def __str__(self):
        return self.title
"""
append_to_file("apps/accounting/domain/models.py", accounting_content)

# 4. HRM: Recruitment, Time Off, Appraisals, Referrals
hrm_content = """
# --- HR SUB-DOMAINS (Frontend Visual Matching) ---
class JobApplicant(TenantAwareModel):
    name = models.CharField(max_length=255)
    job_title = models.CharField(max_length=255)
    status = models.CharField(max_length=50, default='applied')

class LeaveRequest(TenantAwareModel):
    leave_type = models.CharField(max_length=100)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=50, default='pending')

class PerformanceAppraisal(TenantAwareModel):
    review_period = models.CharField(max_length=100)
    score = models.IntegerField(default=0)

class ReferralCampaign(TenantAwareModel):
    title = models.CharField(max_length=255)
    reward_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
"""
append_to_file("apps/hrm/domain/models.py", hrm_content)

# 5. Marketing: Email, Social, SMS, Events, Surveys
marketing_content = """
# --- MARKETING SUB-DOMAINS (Frontend Visual Matching) ---
class MassMailing(TenantAwareModel):
    subject = models.CharField(max_length=255)
    sent_count = models.IntegerField(default=0)

class SocialPost(TenantAwareModel):
    platform = models.CharField(max_length=50)
    content = models.TextField()

class SMSCampaign(TenantAwareModel):
    message = models.TextField()
    recipients_count = models.IntegerField(default=0)

class Event(TenantAwareModel):
    title = models.CharField(max_length=255)
    date = models.DateTimeField(null=True, blank=True)

class Survey(TenantAwareModel):
    title = models.CharField(max_length=255)
    active = models.BooleanField(default=True)
"""
append_to_file("apps/marketing/domain/models.py", marketing_content)

# 6. CMS: eLearning
cms_content = """
# --- E-LEARNING (Frontend Visual Matching) ---
class Course(TenantAwareModel):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_published = models.BooleanField(default=False)
"""
append_to_file("apps/cms/domain/models.py", cms_content)

# 7. EDMS: Spreadsheet, Knowledge
edms_content = """
# --- SPREADSHEET & KNOWLEDGE (Frontend Visual Matching) ---
class SpreadsheetDocument(TenantAwareModel):
    title = models.CharField(max_length=255)
    data = models.JSONField(default=dict)

class KnowledgeArticle(TenantAwareModel):
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)
"""
append_to_file("apps/edms/domain/models.py", edms_content)

# 8. Discuss: Live Chat, Calendar, WhatsApp
discuss_content = """
# --- COMMUNICATIONS (Frontend Visual Matching) ---
class LiveChatSession(TenantAwareModel):
    visitor_name = models.CharField(max_length=255)
    started_at = models.DateTimeField(auto_now_add=True)

class CalendarEvent(TenantAwareModel):
    title = models.CharField(max_length=255)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)

class WhatsAppMessage(TenantAwareModel):
    phone_number = models.CharField(max_length=20)
    body = models.TextField(blank=True)
"""
append_to_file("apps/discuss/models.py", discuss_content)

print("All models mapped successfully!")
