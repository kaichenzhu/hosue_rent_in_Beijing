# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('HouseRentHelper', '0003_auto_20171028_0741'),
    ]

    operations = [
        migrations.AddField(
            model_name='street',
            name='region',
            field=models.ForeignKey(related_name='streets', default=1, to='HouseRentHelper.Region'),
        ),
    ]
