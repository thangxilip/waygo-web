from datetime import datetime
import humanize 

def duration_since(given_time):
    try:
        return str(datetime.now() - given_time).split(".")[0]
    except:
        return None
    
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
        return humanize.naturaltime(date)
    except:
        return None