from django.db import models
class AnalysisResult(models.Model):
    log_file = models.FileField(upload_to='logs/', null=True, blank=True)
    risk_score = models.DecimalField(max_digits=5, decimal_places=2)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f'Analysis {self.id} - {self.risk_score}'
