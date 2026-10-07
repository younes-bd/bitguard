from django.db import models

# Legacy Rental models have been migrated into the unified SalesOrder architecture in apps.sales.
# A rental is now a standard SalesOrder where is_rental_order=True.
