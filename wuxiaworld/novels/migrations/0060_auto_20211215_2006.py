# Generated by Django 3.1.12 on 2021-12-15 20:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('novels', '0059_auto_20211212_0208'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chapter',
            name='novSlugChapSlug',
            field=models.CharField(blank=True, db_index=True, default=None, max_length=200),
        ),
    ]
