from datetime import datetime
from main.constants import ReportStatusCode

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
        return relative_time(date)
    except:
        return None
    
def get_chamber_status(code):
    if code <= ReportStatusCode.ISSUE_OTHERS:
        code = ReportStatusCode.ISSUE_OTHERS

    switcher = {
        ReportStatusCode.IDLE: "Idle",
        ReportStatusCode.OPERATING: "Operating",
        ReportStatusCode.ISSUE_MODBUS_TCP: "Issue: Modbus TCP",
        ReportStatusCode.ISSUE_SENSOR_UNIT: "Issue: Sensor Unit",
        ReportStatusCode.HALTED_CABINET_AUTO_SW: "Halted: Cabinet Auto SW",
        ReportStatusCode.ISSUE_EQUIPMENT_OVERLOAD: "Issue: Equipment Overload",
        ReportStatusCode.ISSUE_OTHERS: "Issue: Others",
    }

    return switcher.get(code, "Unknown")

def relative_time(time=False):
    from datetime import datetime
    now = datetime.now()
    if type(time) is int:
        diff = now - datetime.fromtimestamp(time)
    elif isinstance(time, datetime):
        diff = now - time
    elif not time:
        diff = 0

    second_diff = diff.seconds
    day_diff = diff.days

    if day_diff < 0:
        return ''

    if day_diff == 0:
        if second_diff < 45:
            return "a few seconds ago"
        if second_diff < 90:
            return "a minute ago"
        if second_diff < 45*60:
            return str(round(second_diff / 60)) + " minutes ago"
        if second_diff < 90*60:
            return "an hour ago"
        if second_diff < 22*60*60:
            return str(round(second_diff / 3600)) + " hours ago"
        if second_diff < 36*60*60:
            return "a day ago"
    if day_diff == 1:
        return "a day ago"
    if day_diff < 26:
        return str(day_diff) + " days ago"
    if day_diff < 46:
        return "a month ago"
    if day_diff < 10*30:
        return str(round(day_diff / 30)) + " months ago"
    if day_diff < 18*30:
        return "a year ago"
    return str(round(day_diff / 365)) + " years ago"

