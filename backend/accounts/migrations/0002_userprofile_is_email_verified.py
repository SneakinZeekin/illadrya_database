# Generated by Django 5.1.6 on 2025-03-02 06:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='is_email_verified',
            field=models.BooleanField(default=False),
        ),
    ]
