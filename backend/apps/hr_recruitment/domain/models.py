from apps.core.validators import validate_document_file
from django.db import models
from apps.core.domain.models import TenantAwareModel
from apps.hr.domain.models import Employee, Department

class JobPosition(TenantAwareModel):
    name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='job_positions')
    description = models.TextField(blank=True)
    expected_employees = models.IntegerField(default=1)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Job Position'

    def __str__(self):
        return self.name

class JobApplication(TenantAwareModel):
    job_position = models.ForeignKey(JobPosition, on_delete=models.CASCADE, related_name='applications')
    applicant_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    resume = models.FileField(upload_to='resumes/%Y/%m/', null=True, blank=True, validators=[validate_document_file])
    status = models.CharField(max_length=20, default='new', choices=[
        ('new', 'New'),
        ('interview', 'Interview'),
        ('offer', 'Offer'),
        ('hired', 'Hired'),
        ('rejected', 'Rejected')
    ])
    custom_stage_name = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        verbose_name = 'Job Application'

    def __str__(self):
        return f"{self.applicant_name} for {self.job_position}"

class JobApplicant(TenantAwareModel):
    name = models.CharField(max_length=255)
    job_title = models.CharField(max_length=255)
    status = models.CharField(max_length=50, default='applied')
