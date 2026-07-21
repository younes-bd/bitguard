from django.db import models
from apps.core.domain.models import TenantAwareModel
from apps.hr.domain.models import Employee

class Attendance(TenantAwareModel):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='hr_attendance')
    check_in = models.DateTimeField()
    check_out = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Attendance'

    def __str__(self):
        return f"{self.employee} ({self.check_in.date()})"
