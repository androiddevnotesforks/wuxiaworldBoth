# Generated by Django 3.1.12 on 2021-08-04 09:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('novels', '0005_auto_20210727_1304'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chapter',
            name='nextChap',
        ),
    ]
