# Generated by Django 4.2.3 on 2023-11-06 21:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0002_notification"),
    ]

    operations = [
        migrations.AddField(
            model_name="notification",
            name="company",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                to="main.company",
            ),
            preserve_default=False,
        ),
    ]
