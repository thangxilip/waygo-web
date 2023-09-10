# Generated by Django 4.2.3 on 2023-09-08 08:36

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0007_alter_lot_company_alter_lotdata_lot_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="lotdata",
            name="amc",
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name="lotdata",
            name="dbt1",
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name="lotdata",
            name="dbt2",
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name="lotdata",
            name="mc1",
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name="lotdata",
            name="mc2",
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name="lotdata",
            name="mc3",
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name="lotdata",
            name="mc4",
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name="lotdata",
            name="mc5",
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name="lotdata",
            name="mc6",
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name="lotdata",
            name="mc7",
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name="lotdata",
            name="mc8",
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name="lotdata",
            name="rh",
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name="lotdata",
            name="wbt1",
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name="lotdata",
            name="wbt2",
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name="lotdata",
            name="wood_temp1",
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name="lotdata",
            name="wood_temp2",
            field=models.FloatField(null=True),
        ),
    ]
