from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('agents', '0002_initial'),
    ]
    operations = [
        migrations.AlterModelTable(
            name='AgentProfile',
            table='agents_profile',
        ),
        migrations.AlterModelTable(
            name='AgentRunLog',
            table='agents_run_log',
        ),
    ]
