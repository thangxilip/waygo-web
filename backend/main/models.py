import math
from django.db import models
from django.contrib.auth.models import PermissionsMixin
from rest_framework_api_key.models import AbstractAPIKey
from django.contrib.auth.models import AbstractUser

class Company(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    pic = models.CharField(max_length=100)
    telephone = models.CharField(max_length=100)
    email = models.EmailField()
    website = models.CharField(max_length=100)
    timezone = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.id}. {self.name}"


class CompanyAPIKey(AbstractAPIKey):
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="api_keys",
    )

    class Meta(AbstractAPIKey.Meta):
        verbose_name = "Company API key"
        verbose_name_plural = "Company API keys"

class StatusReport(models.Model):
    company = models.ForeignKey(Company, on_delete=models.PROTECT)
    chamber = models.PositiveSmallIntegerField()
    time = models.DateTimeField()  # local time of the kiln's machine
    server_time = models.DateTimeField(
        auto_now_add=True
    )  # auto created when record is added
    # 0 = Idle; 1 = Operating; -1 = Issue: Modbus TCP; -2 = Issue: Sensor Unit; -3 = Halted: Cabinet Auto SW; -4 = Issue: Equipment Overload; <=-5 = Issue: Others
    status_code = models.IntegerField()  
    lot = models.ForeignKey("Lot", on_delete=models.SET_NULL, null=True) # only has value when status_code = 1
    details = models.CharField(max_length=100, null=True)


"""
Note that in production I want to be able to create new users and companies 
in Django admin
"""

class User(AbstractUser, PermissionsMixin):
    company = models.ForeignKey(Company, blank=True, null=True, on_delete=models.CASCADE)

    def get_full_name(self):
        '''
        Returns the first_name plus the last_name, with a space in between.
        '''
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()
    
    class Meta:
        db_table = 'auth_user'


"""
This is the model describing a timber drying lot. In production these new records will be created POST
"""

class Lot(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE
    )  # many_to_one relationship with Company
    chamber = models.IntegerField()
    start_time = models.DateTimeField()
    complete_time = models.DateTimeField(null=True)
    program_name = models.CharField(max_length=100, null=True)
    total_commands = models.PositiveSmallIntegerField(
        null=True
    )  # how many commands are in the drying program use to dry the lot
    species = models.CharField(
        max_length=100, default="none"
    )  # timber species. e.g. 'White Oak' 'Pine' 'Rubberwood' 'Acacia' etc.
    quantity = models.FloatField(default=0)  # cubic meters
    details = models.CharField(max_length=100, null=True)  # reserved field
    duration = models.DurationField(null=True)

    def save(self, *args, **kwargs):
        if self.complete_time is not None:
            self.duration = self.complete_time - self.start_time
        else:
            self.duration = None
        super().save(*args, **kwargs)

    def __str__(self):
        formatted_start_time = self.start_time.strftime("%Y-%m-%d %H:%M")
        return (
            f"Lot: {self.id} - Time: {formatted_start_time} - Species: {self.species}"
        )


"""
In production these LotData records will be created once an hour via POST
"""

class LotData(models.Model):
    lot = models.ForeignKey(Lot, on_delete=models.CASCADE, related_name="lot_data")
    time = models.DateTimeField()
    command_name = models.CharField(max_length=100)
    wbt1 = models.FloatField()
    wbt2 = models.FloatField(null=True)
    dbt1 = models.FloatField()
    dbt2 = models.FloatField(null=True)
    rh = models.FloatField(null=True)
    targetdbt = models.FloatField(null=True)
    targetwbt = models.FloatField(null=True)
    mc1 = models.FloatField()
    mc2 = models.FloatField()
    mc3 = models.FloatField()
    mc4 = models.FloatField()
    mc5 = models.FloatField(null=True)
    mc6 = models.FloatField(null=True)
    mc7 = models.FloatField(null=True)
    mc8 = models.FloatField(null=True)
    amc = models.FloatField()
    wood_temp1 = models.FloatField(null=True)
    wood_temp2 = models.FloatField(null=True)
    flaps = models.PositiveSmallIntegerField(
        null=True
    )  # 0 = 'ON'; 1 = 'OFF'. Displayed as 'ON' or 'OFF' in plots
    heat = models.PositiveSmallIntegerField(
        null=True
    )  # 0 = 'ON'; 1 = 'OFF'. Displayed as 'ON' or 'OFF' in plots
    spray = models.PositiveSmallIntegerField(
        null=True
    )  # 0 = 'ON'; 1 = 'OFF'. Displayed as 'ON' or 'OFF' in plots
    fan_cw = models.PositiveSmallIntegerField(
        null=True
    )  # 0 = 'ON'; 1 = 'OFF'. Displayed as 'ON' or 'OFF' in plots
    fan_ccw = models.PositiveSmallIntegerField(
        null=True
    )  # 0 = 'ON'; 1 = 'OFF'. Displayed as 'ON' or 'OFF' in plots
    reserved = models.FloatField(null=True)  # reserved field
    details = models.CharField(max_length=100, null=True)  # reserved field

    def save(self, *args, **kwargs):
        if self.dbt2 is not None and self.dbt2 > self.dbt1:
            Td = self.dbt2
            Tw = self.wbt2
        else:
            Td = self.dbt1
            Tw = self.wbt1

        self.rh = self.calculateRH(Td, Tw)
        super().save(*args, **kwargs)

    def calculateRH(self, Td, Tw):
        # formula: http://www.1728.org/relhum.htm
        try:
            powerEd = (17.502 * Td) / (240.97 + Td)
            Ed = 6.112 * math.exp(powerEd)
            powerEw = (17.502 * Tw) / (240.97 + Tw)
            Ew = 6.112 * math.exp(powerEw)
            N = 0.66875
            RH = (Ew - N * (1 + 0.00115 * Tw) * (Td - Tw)) / Ed * 100.0
            RH = float(round(RH, 2))
            return RH
        except Exception as e:
            return -1

    def __str__(self):
        formatted_time = self.time.strftime("%Y-%m-%d %H:%M")
        return f"{self.lot_id}. {self.time}"
