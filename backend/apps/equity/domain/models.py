from django.db import models
from apps.core.domain.models import TenantAwareModel

class ShareClass(TenantAwareModel):
    name = models.CharField(max_length=100) # e.g. Common, Preferred
    total_shares = models.BigIntegerField()
    par_value = models.DecimalField(max_digits=10, decimal_places=4)

    def __str__(self):
        return self.name

class Shareholder(TenantAwareModel):
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True)
    share_class = models.ForeignKey(ShareClass, on_delete=models.CASCADE)
    shares_owned = models.BigIntegerField()
    grant_date = models.DateField()

    def __str__(self):
        return f"{self.name} ({self.shares_owned} shares)"
