from django.db import models
from django.conf import settings
from apps.core.domain.models import TenantAwareModel
from apps.hr.domain.models import Employee

class Appraisal(TenantAwareModel):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='appraisals')
    manager = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='conducted_appraisals')
    date = models.DateField()
    score = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    feedback = models.TextField(blank=True)
    status = models.CharField(max_length=20, default='planned', choices=[
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('done', 'Done')
    ])

    class Meta:
        verbose_name = 'Appraisal'

    def __str__(self):
        return f"Appraisal {self.employee} ({self.date})"

class PerformanceAppraisal(TenantAwareModel):
    review_period = models.CharField(max_length=100)
    score = models.IntegerField(default=0)

class PerformanceReview(TenantAwareModel):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    review_period = models.CharField(max_length=20, help_text="e.g. Q1-2026")
    overall_rating = models.IntegerField(choices=[(1,'Poor'),(2,'Below Average'),(3,'Average'),(4,'Good'),(5,'Excellent')], null=True)
    goals = models.JSONField(default=list)  # [{ title, target, achieved, score }]
    feedback = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=[('draft','Draft'),('in_review','In Review'),('completed','Completed')], default='draft')
    due_date = models.DateField(null=True, blank=True)
