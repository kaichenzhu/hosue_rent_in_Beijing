# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('HouseRentHelper', '0002_region_street'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='region',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='street',
            options={'managed': True},
        ),
    ]
