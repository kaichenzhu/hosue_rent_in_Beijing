# hosue_rent_in_Beijing

A web app help you find the house/room for rent near your work places easily

![screenshot from 2017-09-23 23-00-09](https://user-images.githubusercontent.com/19497769/30779966-63161376-a0b4-11e7-91d2-1af1bb807063.png)

## Usage

#### First choose your working place:
![screenshot from 2017-09-24 01-31-43](https://user-images.githubusercontent.com/19497769/30780839-34031416-a0c9-11e7-8052-110280770722.png)

#### Then specify region, rent prices and type of rental house which you accept in the top left corner:
![screenshot from 2017-09-24 01-33-53](https://user-images.githubusercontent.com/19497769/30780842-3404c19e-a0c9-11e7-94b1-4e23c0f709e1.png)

#### Click the search button, after that, all matching houses will be marked on the map:
![screenshot from 2017-09-23 22-59-44](https://user-images.githubusercontent.com/19497769/30779965-630b5062-a0b4-11e7-9ec3-0c67e7aa65eb.png)

#### Choose any one you are interested, and click the link above the marker, your will enter that house's website:
![screenshot from 2017-09-23 23-00-48](https://user-images.githubusercontent.com/19497769/30780841-34038356-a0c9-11e7-8b5c-eed8731e57ef.png)

## Getting Started
Download the porject: open the terminal, then type: 
```
git clone https://github.com/kaichenzhu/hosue_rent_in_Beijing.git
```

### Prerequisites
If you haven't installed virtualenv before, please follow the command bellow to install it:

#### Mac OS X or Linux
```
sudo pip install virtualenv
```

#### If you use Ubuntu
```
sudo apt-get install python-virtualenv
```

## Running
Change the current work directory to this project:
```
cd hosue_rent_in_Beijing
```

Activate the corresponding project, On OS X and Linux, do the following:
```
. venv/bin/activate or source venv/bin/activate
```

If you are a Windows user, the following command is for you:
```
venv\Scripts\activate
```

Before start the application, we need install several modules into out virtual environment, in your work directory, type the command below:
```
pip install -r requirements.txt
```

#### MySQL Configuration
We use MySQL for this project.
first step, configure MySQL in settings.py.
```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'houserent',
        'USER': 'root',
        'PASSWORD': '123',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```
Then, create a schema named 'houserent' in your database(you can use a different name, but don't forget to modify the database setting in settings.py)
Import regions information to your MySQL server from houserent_regions.sql(in root directory)

![screenshot from 2017-10-28 19-07-47](https://user-images.githubusercontent.com/19497769/32140694-1ca4485c-bc27-11e7-80ca-0b40361f2f24.png)

![screenshot from 2017-10-28 19-07-57](https://user-images.githubusercontent.com/19497769/32140695-1dec5222-bc27-11e7-92cd-b9f5ed1a52a9.png)

#### Web crawler
In the above step, we have created a Region table in the databse which include 21 main regions in Beijing.
In the next step, we could fetch all streets in Beijing using a web crawler.
I create a customized django-admin command in this project(you can find it in the 'hosue_rent_in_Beijing/HouseCrawler/management/commands/fetchstreet.py')
Start crawling the streets of Beijing by typing the following command:
```
python manage.py fetchstreet 7
```
The integer argument represents the number of threads when you fetch the data.

#### Final Step
Start the server, type the following command:
```
python manage.py runserver
```

Open your browser and type the folowing address : 
```
localhost:8000 
```

## Performance Improvement
#### single thread:
![screenshot from 2017-09-28 00-13-51](https://user-images.githubusercontent.com/19497769/30954296-7700d906-a3e4-11e7-941f-71006e08f51c.png)
![screenshot from 2017-09-28 00-14-05](https://user-images.githubusercontent.com/19497769/30954298-77193d3e-a3e4-11e7-8889-fffc8c332a33.png)
result: 30

#### multithreading:
![screenshot from 2017-09-28 00-22-37](https://user-images.githubusercontent.com/19497769/30954300-771dfd6a-a3e4-11e7-8f7a-d9f24d9087fd.png)
![screenshot from 2017-09-28 00-22-46](https://user-images.githubusercontent.com/19497769/30954302-7735672a-a3e4-11e7-9ba0-3a1c40bc16ba.png)
result: 5

## Built With
* [Django](https://www.djangoproject.com/) - A high-level Python Web framework.
* [Django Rest Framework](http://www.django-rest-framework.org/) - A powerful and flexible toolkit for building Web APIs.
* [Request](http://www.python-requests.org/en/master/) - Http library for python.
* [Virtualenv](http://www.python-requests.org/en/master/) - Http library for python.
* [jQuery](http://api.jquery.com/) - A fast, small, and feature-rich JavaScript library.
* [Gaode Map](http://lbs.amap.com/api/javascript-api/summary/) - Map API.
* [Beautiful Soup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/) - Python library for pulling data out of HTML and XML files.
