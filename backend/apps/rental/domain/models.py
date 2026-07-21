from django.db import models

# Legacy Rental models have been migrated into the unified SaleOrder architecture in apps.sale.
# A rental is now a standard SaleOrder where is_rental_order=True.
