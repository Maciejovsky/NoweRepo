# Generated by Django 2.2.7 on 2022-12-01 21:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0010_auto_20221126_1737'),
    ]

    operations = [
        migrations.CreateModel(
            name='SeaFood',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dish_name', models.CharField(max_length=200)),
                ('price', models.DecimalField(decimal_places=2, max_digits=6)),
            ],
            options={
                'verbose_name': 'List of Sea food',
                'verbose_name_plural': 'List of Sea food',
            },
        ),
    ]
