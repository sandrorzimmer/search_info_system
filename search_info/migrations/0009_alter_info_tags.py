# Generated by Django 3.2 on 2021-10-17 17:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('search_info', '0008_alter_info_tags'),
    ]

    operations = [
        migrations.AlterField(
            model_name='info',
            name='tags',
            field=models.ManyToManyField(to='search_info.Tag'),
        ),
    ]
