# Generated by Django 3.1.12 on 2021-07-26 19:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('novels', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='novel',
            name='viewsNovelName',
            field=models.ForeignKey(blank=True, default=0, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='novels.novelviews'),
        ),
    ]
