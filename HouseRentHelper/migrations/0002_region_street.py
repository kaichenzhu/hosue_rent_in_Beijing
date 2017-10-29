# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('HouseRentHelper', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Region',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name_eng', models.CharField(max_length=45, null=True, blank=True)),
                ('name_chi', models.CharField(max_length=45, null=True, blank=True)),
            ],
            options={
                'db_table': 'regions',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Street',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name_eng', models.CharField(max_length=45, null=True, blank=True)),
                ('name_chi', models.CharField(max_length=45, null=True, blank=True)),
            ],
            options={
                'db_table': 'streets',
                'managed': False,
            },
        ),
    ]
