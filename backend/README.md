## Setup

* Clone project
* Create virtualenv using python3

    `$ python3 -m virtualenv venv`

* Activate virtualenv for linux users

    `$ source venv/bin/activate`

* Now install all requirements

    `$ pip install -r requirements.txt`
 
* Create .env file using given environment file template and set the required variables.

    `$ cp .env.template .env`

* Now migrate models in db

    `$ python manage.py migrate`
    
* Create superuser to login to django admin.

    `$ python manage.py createsuperuser`
    
* All done now run following command for running your server

    `$ python manage.py runserver "port_number"`
    
