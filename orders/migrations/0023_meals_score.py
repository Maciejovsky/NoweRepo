# Generated by Django 2.2.7 on 2022-12-23 16:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0022_auto_20221218_2157'),
    ]

    operations = [
        migrations.AddField(
            model_name='meals',
            name='score',
            field=models.IntegerField(default=0),
        ),
    ]