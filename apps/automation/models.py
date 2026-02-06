from django.db import models
class Workflow(models.Model):
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='workflows', null=True, blank=True)
    name = models.CharField(max_length=200)
    steps = models.JSONField(default=list)
    status = models.CharField(max_length=50, default='inactive')
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name
