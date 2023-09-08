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


class LotDataSerializer(ModelSerializer):

    class Meta:
        model = LotData
        fields = '__all__'


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
