from django.contrib import admin

from rest_framework_api_key.models import APIKey
from .models import *
from rest_framework_api_key.admin import APIKeyModelAdmin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group as DjangoGroup
from django.contrib.auth.admin import GroupAdmin as BaseGroupAdmin

admin.site.unregister(APIKey)

class Group(DjangoGroup):
    class Meta:
        verbose_name = 'group'
        verbose_name_plural = 'groups'
        proxy = True


admin.site.unregister(DjangoGroup)
@admin.register(Group)
class GroupAdmin(BaseGroupAdmin):
    pass

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    model = User
    list_display = ['username', 'email', 'is_superuser', 'company']

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Company info', {'fields': ('company',)}),  # Make sure company is part of the 'Company info' fieldset
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')})
    )

admin.site.register(Company)
admin.site.register(Lot)
admin.site.register(LotData)
admin.site.register(StatusReport)

@admin.register(CompanyAPIKey)
class CompanyAPIKeyModelAdmin(APIKeyModelAdmin):
    list_display = [*APIKeyModelAdmin.list_display, "company"]
    search_fields = [*APIKeyModelAdmin.search_fields, "company"]