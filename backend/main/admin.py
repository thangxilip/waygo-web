from django.contrib import admin
from .models import *

## Register your models here
admin.site.register(Company)
admin.site.register(AppUser)
admin.site.register(Lot)
admin.site.register(LotData)
admin.site.register(StatusReport)
