from django.dispatch import receiver

try:
    from apps.sale.infrastructure.signals import sale_order_confirmed_signal
    @receiver(sale_order_confirmed_signal)
    def create_project_tasks_on_sale(sender, instance, **kwargs):
        from apps.projects.domain.models import Project, Task
        project = None
        for line in instance.lines.all():
            if line.product and getattr(line.product, 'product_type', '') in ['service', 'subscription', 'service_bundle']:
                if not project:
                    project, _ = Project.objects.get_or_create(
                        tenant=instance.tenant,
                        name=f"{instance.order_number} - {instance.client.name}",
                        defaults={
                            'client': instance.client,
                            'project_type': 'client',
                            'status': 'planning'
                        }
                    )
                
                Task.objects.get_or_create(
                    tenant=instance.tenant,
                    project=project,
                    title=f"{line.product.name}",
                    defaults={
                        'description': getattr(line, 'name', line.product.name),
                        'status': 'todo',
                        'estimated_hours': line.product_uom_qty
                    }
                )
except ImportError:
    pass
