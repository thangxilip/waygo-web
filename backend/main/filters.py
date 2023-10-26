from django_filters import rest_framework as django_filter

from main.models import Lot, StatusReport, Notification


class LotFilterSet(django_filter.FilterSet):

    class Meta:
        model = Lot
        fields = {
            'species': ['exact'],
            'chamber': ['exact'],
            'start_time': ['lte', 'gte', 'lt', 'gt'],
            'complete_time': ['lte', 'gte', 'lt', 'gt']
        }

class CustomStatusFilter(django_filter.Filter):

    def filter(self, qs, value):
        if value is not None:
            value = int(value)
            if self.lookup_expr == 'exact' and value <= -5:
                # Use less than or equals filter when 'exact' and value is <= -5
                return qs.filter(**{self.field_name + '__lte': value})
            else:
                # Use the default filter method for all other cases
                return super().filter(qs, value)
        return qs

class StatusReportFilterSet(django_filter.FilterSet):
    # Define a custom filter for the status_code field
    status_code = CustomStatusFilter(field_name='status_code')

    class Meta:
        model = StatusReport
        fields = {
            'status_code': ['exact'],
        }

class NotificationFilterSet(django_filter.FilterSet):

    class Meta:
        model = Notification
        fields = {
            'from_chamber': ['exact'],
            'time': ['lte', 'gte', 'exact', 'lt', 'gt'],
            'type': ['exact']
        }