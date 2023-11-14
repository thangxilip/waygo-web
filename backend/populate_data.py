'''
This script is for the developer to generate mockup data for a single company with an Id of 1.
You can create this company ('Vietnam Greenwood LTD') in the database, and create it's only user 'demo' with password 'demo'
for testing purpose.
The demo user, company and mockup data will still be kept in the production system.
'''

import os
import django
import random
import math
from datetime import datetime, timedelta
from django.utils import timezone
from django.db import transaction
# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from main.models import Company, Lot, LotData, StatusReport

def generate_lot_id(chamber, start_time):
    formatted_date = start_time.strftime("%Y-%m-%d")
    return f"{formatted_date}-{chamber}"

def generate_mc_values(chamber, amc):
    diff1 = diff2 = diff3 = diff4 = 0.0
    if amc >= 40:
        diff1 = random.uniform(-8.0, 8.0)
        diff2 = random.uniform(-8.0, 8.0)
        diff3 = random.uniform(-8.0, 8.0)
        diff4 = random.uniform(-8.0, 8.0)
    elif amc >25:
        diff1 = random.uniform(-4.0, 4.0)
        diff2 = random.uniform(-4.0, 4.0)
        diff3 = random.uniform(-4.0, 4.0)
        diff4 = random.uniform(-4.0, 4.0)
    else:
        diff1 = random.uniform(-1.5, 1.5)
        diff2 = random.uniform(-1.5, 1.5)
        diff3 = random.uniform(-1.5, 1.5)
        diff4 = random.uniform(-1.5, 1.5)

    _mc1 = amc + diff1
    _mc2 = amc - diff1
    _mc3 = amc + diff2
    _mc4 = amc - diff2
    _mc5 = amc + diff3
    _mc6 = amc - diff3
    _mc7 = amc + diff4
    _mc8 = amc - diff4

    if chamber % 2 == 0:
        _mc5 = _mc6

    return _mc1, _mc2, _mc3, _mc4, _mc5, _mc6, _mc7, _mc8

def generate_complete_lots(chamber):
    # Get the company object
    company = Company.objects.get(id=1)

    # Mock-up values
    species_list = ['Red Oak', 'White Oak', 'Acacia', 'Rubberwood', 'White Pine']
    program_list = ['fast', 'medium', 'slow']
    quantity_list = [45, 60, 70, 80, 120]
    thickness_list = ['26mm thickness', '30mm thickness', '40mm thickness', '45mm thickness', '55mm thickness']
    command_list = ['reach[x, y, z]', 'keep[x, y, z]']

    time_range_start = datetime(2022, 6, 1, 1, 0, 0)
    time_range_end = datetime(2023, 7, 25, 1, 0, 0)
    #time_range_start = datetime.strptime("2023-01-01 01:00:00", "%Y-%m-%d %H:%M:%S")
    #time_range_end = datetime.strptime("2024-02-01 01:00:00", "%Y-%m-%d %H:%M:%S")
    last_lot_time = time_range_start
    isDone = False

    while isDone is False:
        # Generate Lot object
        start_time = last_lot_time + timedelta(hours = random.randint(72, 168))
        complete_time = None
        lot_id = generate_lot_id(chamber, start_time)
        species = random.choice(species_list)
        program_name = f"{species.lower().replace(' ', '_')}_{random.choice(program_list)}"
        total_commands = random.randint(9, 12)
        quantity = random.choice(quantity_list)
        details = random.choice(thickness_list)

        lot = Lot.objects.create(
            id=lot_id,
            company=company,
            chamber=chamber,
            start_time=start_time,
            complete_time=complete_time,
            program_name=program_name,
            total_commands=total_commands,
            species=species,
            quantity=quantity,
            details=details
        )

        # Generate LotData rows
        amc = random.randint(55, 75)  # Initial average moisture content
        drying_lot_complete = False

        current_time = start_time
        with transaction.atomic():
            while not drying_lot_complete:
                #current_time = timezone.now()
                command_name = random.choice(command_list)

                dbt1, wbt1 = generate_temperature_values(species, amc)
                wt1 = dbt1 - random.uniform(-1, 1)
                
                _mc1, _mc2, _mc3, _mc4, _mc5, _mc6, _mc7, _mc8 = generate_mc_values(chamber, amc)

                LotData.objects.create(
                    lot=lot,
                    time=current_time,
                    command_name=command_name,
                    dbt1=dbt1,
                    wbt1=wbt1,              
                    rh=calculate_rh(dbt1, wbt1),
                    mc1=_mc1,
                    mc2=_mc2,
                    mc3=_mc3,
                    mc4=_mc4,
                    mc5=_mc5,
                    mc6=_mc6,
                    mc7=_mc7,
                    mc8=_mc8,
                    amc=amc,
                    wood_temp1=wt1,
                    wood_temp2=wt1 + random.uniform(-0.6, 0.6),
                    flaps=0,
                    heat=0,
                    spray=0,
                    fan_cw=1,
                    fan_ccw=0,
                    reserved=None,
                    details=None
                )

                # Check if drying lot is complete
                if amc <= random.randint(8, 12):
                    drying_lot_complete = True
                    lot.complete_time = current_time
                    last_lot_time = current_time
                    lot.save()
                    if current_time >= time_range_end:
                        isDone = True
                else:
                    # Calculate next amc based on current amc
                    amc = calculate_next_amc(amc)

                # Increment time by 1 hour
                current_time += timedelta(hours=1)

def generate_temperature_values(species, amc):
    dbt1 = wbt1 = 0.0
    if species == 'Red Oak':
        if amc > 40:
            dbt1 = 43
            wbt1 = random.uniform(39.0, 41.0)
        elif 30 < amc <= 40:
            dbt1 = 43
            wbt1 = random.uniform(38.0, 40.0)
        elif 25 < amc <= 30:
            dbt1 = 49
            wbt1 = random.uniform(31.0, 33.0)
        elif 20 < amc <= 25:
            dbt1 = 54
            wbt1 = random.uniform(31.0, 33.0)
        elif 15 < amc <= 20:
            dbt1 = 60
            wbt1 = random.uniform(31.0, 33.0)
        else:
            dbt1 = 80
            wbt1 = random.uniform(53.0, 55.0)     

    elif species == 'White Oak':
        if amc > 30:
            dbt1 = 43
            wbt1 = random.uniform(38.0, 40.0)
        elif 25 < amc <= 30:
            dbt1 = 49
            wbt1 = random.uniform(40.0, 42.0)
        elif 20 < amc <= 25:
            dbt1 = 54
            wbt1 = random.uniform(37.0, 39.0)
        elif 15 < amc <= 20:
            dbt1 = 60
            wbt1 = random.uniform(31.0, 33.0)
        else:
            dbt1 = 80
            wbt1 = random.uniform(53.0, 55.0)  

    elif species == 'Rubberwood':
        if amc > 35:
            dbt1 = 40.5
            wbt1 = random.uniform(36.0, 38.0)
        elif 25 < amc <= 35:
            dbt1 = 43.5
            wbt1 = random.uniform(35.0, 37.0)
        elif 20 < amc <= 25:
            dbt1 = 51.5
            wbt1 = random.uniform(37.0, 39.0)
        elif 15 < amc <= 20:
            dbt1 = 60
            wbt1 = random.uniform(39.5, 41.5)
        else:
            dbt1 = 65.5
            wbt1 = random.uniform(43.5, 45.5) 

    elif species == 'White Pine':
        if amc > 30:
            dbt1 = 54
            wbt1 = random.uniform(37.0, 39.0)
        elif 25 < amc <= 30:
            dbt1 = 60
            wbt1 = random.uniform(39.0, 41.0)
        elif 20 < amc <= 25:
            dbt1 = 65
            wbt1 = random.uniform(45.0, 47.0)
        elif 15 < amc <= 20:
            dbt1 = 70
            wbt1 = random.uniform(51.0, 53.0)
        else:
            dbt1 = 80
            wbt1 = random.uniform(65.0, 67.0)

    elif species == 'Acacia':        
        if amc > 40:
            dbt1 = 50
            wbt1 = random.uniform(47.0, 48.0)
        elif 30 < amc <= 40:
            dbt1 = 55
            wbt1 = random.uniform(50.0, 52.0)
        elif 25 < amc <= 30:
            dbt1 = 55
            wbt1 = random.uniform(46.0, 48.0)
        elif 20 < amc <= 25:
            dbt1 = 60
            wbt1 = random.uniform(47.0, 49.0)
        elif 15 < amc <= 20:
            dbt1 = 60
            wbt1 = random.uniform(31.0, 33.0)
        else:
            dbt1 = 60
            wbt1 = random.uniform(35.0, 37.0)             

    return dbt1, wbt1

def calculate_rh(dbt, wbt):
    power_ed = (17.502 * dbt) / (240.97 + dbt)
    ed = 6.112 * math.exp(power_ed)
    power_ew = (17.502 * wbt) / (240.97 + wbt)
    ew = 6.112 * math.exp(power_ew)
    n = 0.66875
    rh = (ew - n * (1 + 0.00115 * wbt) * (dbt - wbt)) / ed * 100.0
    rh = round(rh, 2)
    return rh

def calculate_next_amc(amc):
    if amc >= 40:
        decrease_rate = 0.33 + random.uniform(-0.042, 0.042)        
    elif amc <= 40 and amc > 25:
        decrease_rate = 0.2 + random.uniform(-0.042, 0.042)        
    else:
        decrease_rate = 0.1 + random.uniform(-0.03, 0.03)        
    amc -= decrease_rate
    amc = round(amc, 2)
    return amc

def get_last_lot_complete_time_for_chamber(i):
    try:
        last_lot = Lot.objects.filter(chamber=int(i)).order_by('-complete_time').first()
        if last_lot:
            return last_lot.complete_time
        else:
            return None
    except Lot.DoesNotExist:
        return None

def generate_ongoing_lots(i): # for odd chambers only
    if i % 2 == 0: return
    last_complete_time = get_last_lot_complete_time_for_chamber(i)        
    if last_complete_time == None: return
    start_time = last_complete_time + timedelta(days = 3)

    # Start generating data
    # Get the company object
    company = Company.objects.get(id=1)

    # Mock-up values
    species_list = ['Red Oak', 'White Oak', 'Acacia', 'Rubberwood', 'White Pine']
    program_list = ['fast', 'medium', 'slow']
    quantity_list = [45, 60, 70, 80, 120]
    thickness_list = ['26mm thickness', '30mm thickness', '40mm thickness', '45mm thickness', '55mm thickness']
    command_list = ['reach[x, y, z]', 'keep[a, b, c]']

    # Generate Lot object
    #start_time = last_lot_time + timedelta(hours = random.randint(72, 168))
    complete_time = None
    lot_id = generate_lot_id(i, start_time)
    species = random.choice(species_list)
    program_name = f"{species.lower().replace(' ', '_')}_{random.choice(program_list)}"
    total_commands = random.randint(9, 12)
    quantity = random.choice(quantity_list)
    details = random.choice(thickness_list)

    lot = Lot.objects.create(
        id=lot_id,
        company=company,
        chamber=i,
        start_time=start_time,
        complete_time=complete_time,
        program_name=program_name,
        total_commands=total_commands,
        species=species,
        quantity=quantity,
        details=details
    )

    # Generate LotData rows
    amc = random.randint(55, 75)  # Initial average moisture content
    ongoing_data_complete = False

    current_time = start_time
    with transaction.atomic():
        while not ongoing_data_complete:
            #current_time = timezone.now()
            command_name = random.choice(command_list)

            dbt1, wbt1 = generate_temperature_values(species, amc)
            wt1 = dbt1 - random.uniform(-1, 1)
            
            _mc1, _mc2, _mc3, _mc4, _mc5, _mc6, _mc7, _mc8 = generate_mc_values(i, amc)

            LotData.objects.create(
                lot=lot,
                time=current_time,
                command_name=command_name,
                dbt1=dbt1,
                wbt1=wbt1,              
                rh=calculate_rh(dbt1, wbt1),
                mc1=_mc1,
                mc2=_mc2,
                mc3=_mc3,
                mc4=_mc4,
                mc5=_mc5,
                mc6=_mc6,
                mc7=_mc7,
                mc8=_mc8,
                amc=amc,
                wood_temp1=wt1,
                wood_temp2=wt1 + random.uniform(-0.6, 0.6),
                flaps=0,
                heat=0,
                spray=0,
                fan_cw=1,
                fan_ccw=0,
                reserved=None,
                details=None
            )

            StatusReport.objects.create(
                company = company,
                chamber = i,
                time = current_time + timedelta(minutes=30),
                status_code = 0,
                lot = lot,
                details =''                
            )

            # Check if ongoing lot data is complete
            if amc <= random.randint(18, 20):
                ongoing_data_complete = True                                         
                lot.save()
            else:
                # Calculate next amc based on current amc
                amc = calculate_next_amc(amc)

            # Increment time by 1 hour
            current_time += timedelta(hours=1)        

def generate_idle_status(i):
    if i%2 == 1: return
    StatusReport.objects.create(
        company = Company.objects.get(id=1),
        chamber = i,
        time = datetime(2023, 8, 2, 1, 0, 0),
        status_code = 1,
        lot_id = None,
        details =''                
    )    

def start_generate_complete_lots():
    # Clear existing data
    LotData.objects.all().delete()
    Lot.objects.all().delete()
    for i in range(1, 21):
        generate_complete_lots(i)
        print("Mock-up data for complete lots of chamber " + str(i) + " created")

def start_generate_ongoing_lots():
    for i in range(1, 21):
        generate_ongoing_lots(i)
        print("Mock-up data for ongoing lots of chamber " + str(i) + " created") 

def start_generate_idle_statuses():
    for i in range(1, 21):
        generate_idle_status(i)
        print("Mock-up data for idle status of chamber " + str(i) + " created") 


if __name__ == "__main__":
    start_generate_complete_lots()
    start_generate_ongoing_lots()
    start_generate_idle_statuses()
    print("Mock-up data created successfully.")
