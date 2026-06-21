import uuid
from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('edms', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='document',
            name='is_public',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='document',
            name='share_token',
            field=models.UUIDField(blank=True, default=uuid.uuid4, editable=False, null=True, unique=True),
        ),
    ]
