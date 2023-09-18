from datetime import datetime, timedelta
from django.utils.timesince import timesince

def calculate_duration(given_time):
    current_time = datetime.now()
    time_difference = current_time - given_time

    days = time_difference.days
    seconds = time_difference.seconds
    hours, seconds = divmod(seconds, 3600)
    minutes, seconds = divmod(seconds, 60)

    formatted_days = f'{days} days' if days > 0 else ''
    formatted_hours = f'{hours:02}'
    formatted_minutes = f'{minutes:02}'
    formatted_seconds = f'{seconds:02}'

    time_part = ':'.join([formatted_hours, formatted_minutes, formatted_seconds])
    parts = [formatted_days, time_part]

    return ' '.join(filter(None, parts))

def convert_string_to_date(date_str):
    try:
        for fmt in ('%Y-%m-%dT%H:%M:%S', '%Y-%m-%dT%H:%M:%S.%f', '%Y-%m-%d %H:%M:%S'):
            try:
                return datetime.strptime(date_str, fmt)
            except ValueError:
                pass
    except:
        return None
    
def convert_date_to_string(date, format="%d/%m/%Y, %H:%M"):
    try:
        date_str = date.strftime(format)
        return date_str
    except:
        return None
    
def time_since(date):
    try:
        return timesince(date)
    except:
        return None