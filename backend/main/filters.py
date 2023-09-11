from django_filters import rest_framework as django_filter,  DateTimeFromToRangeFilter

from main.models import Lot, StatusReport


class LotFilterSet(django_filter.FilterSet):

    class Meta:
        model = Lot
        fields = {
            'species': ['exact'],
            'chamber': ['exact'],
            'start_time': ['lte', 'gte', 'lt', 'gt'],
            'complete_time': ['lte', 'gte', 'lt', 'gt']
        }

class StatusReportFilterSet(django_filter.FilterSet):

    class Meta:
        model = StatusReport
        fields = {
            'status_code': ['exact'],
        }
