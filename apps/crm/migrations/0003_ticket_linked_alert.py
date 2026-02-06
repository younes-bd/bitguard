from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    dependencies = [
        ('crm', '0002_initial'),
        ('security', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='ticket',
            name='linked_alert',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='crm_tickets', to='security.securityalert'),
        ),
    ]
