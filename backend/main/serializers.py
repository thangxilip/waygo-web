from django.contrib.auth.models import User
from main.utils import convert_date_to_string, convert_string_to_date, time_since, duration_since
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from main.models import Lot, LotData, StatusReport, AppUser, Company
import datetime


class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email')


class CompanySerializer(ModelSerializer):

    class Meta:
        model = Company
        fields = '__all__'


class AppUserSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    company = CompanySerializer(read_only=True)

    class Meta:
        model = AppUser
        fields = ('user', 'company', 'fullname')


class LotSerializer(ModelSerializer):
    class Meta:
        model = Lot
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.duration:
            data['duration'] = instance.duration
        return data


class LotExcelSerializer(ModelSerializer):

    class Meta:
        model = Lot
        fields = ('chamber', 'id', 'program_name', 'total_commands', 'species', 'quantity', 'start_time', 'complete_time', 'duration')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['start_time'] = instance.start_time.strftime('%d/%m/%Y, %H:%M:%S')
        if instance.complete_time:
            data['complete_time'] = instance.complete_time.strftime('%d/%m/%Y, %H:%M:%S')
        if instance.duration:
            data['duration'] = str(instance.duration).split(".")[0]
        return data


class LotDataSerializer(ModelSerializer):

    class Meta:
        model = LotData
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        for field_name, field in self.fields.items():
            if isinstance(field, serializers.FloatField) and field_name in data:
                field_value = data[field_name]
                if field_value is not None:
                    data[field_name] = round(field_value, 2)
        return data


class LotDataExcelSerializer(ModelSerializer):

    class Meta:
        model = LotData
        fields = ('id', 'time', 'command_name', 'amc', 'rh', 'dbt1', 'dbt2', 'wbt1', 'wbt2', 'mc1', 'mc2', 'mc3', 'mc4', 'mc5', 'mc6', 'mc7', 'mc8', 'wood_temp1', 'wood_temp2', 'flaps', 'heat', 'spray', 'fan_cw', 'fan_ccw', 'reserved', 'details')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        for field_name, field in self.fields.items():
            if isinstance(field, serializers.FloatField) and field_name in data:
                field_value = data[field_name]
                if field_value is not None:
                    data[field_name] = round(field_value, 2)
        return data


class StatusReportListSerializer(ModelSerializer):
    lot = LotSerializer()
    latest_lot_data = serializers.SerializerMethodField(read_only=True)
    last_completed_lot = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = StatusReport
        fields = ('id', 'chamber', 'time', 'server_time', 'status_code', 'details', 'lot', 'last_completed_lot', 'latest_lot_data')

    def get_latest_lot_data(self, instance):
        if instance.lot and instance.lot.lot_data.exists():
            lot_data = instance.lot.lot_data.first()
            return {
                'amc': round(lot_data.amc),
                'dbt': round((lot_data.dbt1 + lot_data.dbt2) / 2.0 if (lot_data.dbt2 is not None and lot_data.dbt2 != -1) else lot_data.dbt1, 2),
                'wbt': round((lot_data.wbt1 + lot_data.wbt2) / 2.0 if (lot_data.wbt2 is not None and lot_data.wbt2 != -1) else lot_data.wbt1, 2)
            }
        return None
    
    def get_last_completed_lot(self, instance):
        lot = None
        if instance.status_code == 1: # idle
            lot_instance = Lot.objects.filter(chamber=instance.chamber, company=instance.company).order_by('-complete_time')
            lot = LotSerializer(instance=lot_instance[0], many=False).data if lot_instance.exists() else None
        return lot
    
    def to_representation(self, instance):
        data = super().to_representation(instance)

        last_completed_lot = data.get('last_completed_lot') or {}
        complete_time = convert_string_to_date(last_completed_lot.get('complete_time'))
        if complete_time:
            data["last_complete"] = convert_date_to_string(complete_time)
            data["since_last_complete"] = time_since(complete_time)

        if instance.lot:
            data["total_time"] = duration_since(instance.lot.start_time)
        
        data["last_report"] = convert_date_to_string(instance.server_time)
        data["since_last_report"] = time_since(instance.server_time)
        
        return data
    

class StatusReportSerializer(ModelSerializer):
    class Meta:
        model = StatusReport
        fields = '__all__'
