# Generated by Django 3.1.12 on 2022-09-01 07:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('novels', '0064_auto_20220804_2112'),
    ]

    operations = [
        migrations.AddField(
            model_name='chapter',
            name='is_eighteen',
            field=models.BooleanField(default=False),
        ),
    ]