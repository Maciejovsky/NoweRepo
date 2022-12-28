# Generated by Django 2.2.7 on 2022-12-23 16:37

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0023_meals_score'),
    ]

    operations = [
        migrations.AlterField(
            model_name='meals',
            name='score',
            field=models.IntegerField(default=0, validators=[django.core.validators.MaxLengthValidator(5), django.core.validators.MinLengthValidator(0)]),
        ),
    ]