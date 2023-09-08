import django
from django.db.models import F, Max
from datetime import datetime

import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
# Assuming you already imported the Lot model and your Django setup is working correctly

from main.models import *

def get_last_lot_complete_time_for_chamber_1():
    try:
        last_lot = Lot.objects.filter(chamber=20).order_by('-complete_time').first()
        if last_lot:
            return last_lot.complete_time
        else:
            return None
    except Lot.DoesNotExist:
        return None

# Call the function to get the complete_time of the last Lot with chamber = 1
last_lot_complete_time = get_last_lot_complete_time_for_chamber_1()

# Print the result
if last_lot_complete_time:
    formatted_complete_time = last_lot_complete_time.strftime("%Y-%m-%d %H:%M")
    print(f"The complete_time of the last Lot with chamber 1: {formatted_complete_time}")
else:
    print("No Lot found with chamber 1.")