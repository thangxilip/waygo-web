# Generated by Django 4.2.2 on 2023-07-07 03:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_lotdata_rh'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lotdata',
            name='rh',
            field=models.DecimalField(decimal_places=2, max_digits=6, null=True),
        ),
    ]
