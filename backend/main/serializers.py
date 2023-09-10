from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, CharField

from main.models import Lot, LotData, StatusReport, AppUser, Company


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


class LotExcelSerializer(ModelSerializer):

    class Meta:
        model = Lot
        fields = ('chamber', 'id', 'program_name', 'total_commands', 'species', 'quantity', 'start_time', 'complete_time', 'duration')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['start_time'] = instance.start_time.strftime('%d/%m/%Y, %H:%M:%S')
        if instance.complete_time:
            data['complete_time'] = instance.complete_time.strftime('%d/%m/%Y, %H:%M:%S')
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
    lot = serializers.SerializerMethodField(read_only=True)
    latest_lot_data = serializers.SerializerMethodField(read_only=True)
    last_completed_lot = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = StatusReport
        fields = '__all__'

    def get_lot(self, instance):
        lot = None
        if instance.lot_id:
            lot_instance = Lot.objects.filter(id=instance.lot_id)
            lot = LotSerializer(instance=lot_instance[0], many=False).data if lot_instance.exists() else None
        return lot

    def get_latest_lot_data(self, instance):
        lot_data = None
        if instance.lot_id:
            lot_data = LotData.objects.filter(
                lot_id=instance.lot_id, lot_id__chamber=instance.chamber
            ).order_by('-time')
            lot_data = LotDataSerializer(instance=lot_data[0], many=False).data if lot_data.exists() else None
        return lot_data

    def get_last_completed_lot(self, instance):
        lot = None
        if instance.status_code == 1:
            lot = Lot.objects.filter(chamber=instance.chamber).last()
        return lot.id if lot else None


class StatusReportSerializer(ModelSerializer):
    class Meta:
        model = StatusReport
        fields = '__all__'
