from django.db import models

class Region(models.Model):
    name_eng = models.CharField(max_length=45, blank=True, null=True)
    name_chi = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'regions'

class Street(models.Model):
    region = models.ForeignKey(Region, related_name='streets', default=1)
    name_eng = models.CharField(max_length=45, blank=True, null=True)
    name_chi = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'streets'