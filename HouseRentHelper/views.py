# -*- coding: utf-8 -*-
from rest_framework import viewsets
from .serializer import RegionSerializer, StreetSerializer
from .models import Region, Street
from django.http import JsonResponse
from bs4 import BeautifulSoup
from urlparse import urljoin
import requests

class RegionViewSet(viewsets.ModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer

class StreetViewSet(viewsets.ModelViewSet):
    queryset = Street.objects.all()
    serializer_class = StreetSerializer

def fetchFromBJ58(request):
    if request.method == 'POST':
        region = request.POST.get('region', '')
        price = request.POST.get('price', '2000_4000')
        style = request.POST.get('style', '1')
        room = request.POST.get('room', '0')
        result, url = [], ''
	# sample url http://bj.58.com/haidian/pinpaigongyu/pn/2/?minprice=2000_3000&fangshi=1&bedroomnum=1
	# if request for entire house
    if style == '1':
        url = 'http://bj.58.com/{region}/pinpaigongyu/pn/{page}/?minprice={price}&fangshi=1&bedroomnum={room}'
    # if request for single room
    elif style == '2':
        url = 'http://bj.58.com/{region}/pinpaigongyu/pn/{page}/?minprice={price}&fangshi=2'
    page = 0
    # fetch data from website
    while True:
        page += 1
        url_add = url.format(region = region, page = page, price = price, style = style, room = room)
        print 'is fetching: ', url_add
        res = requests.get(url_add)
        html_text = BeautifulSoup(res.text, 'html.parser')
        houses_list = html_text.select('.list > li')
        # first time fetch the entire house, second time fetch the single room
        if not houses_list:
            break
        for house in houses_list:
            house_title = house.select('h2')[0].string.encode('utf8')
            house_info = house_title.split()
            if "公寓" in house_info[1] or "青年社区" in house_info[1]:
                house_location = house_info[0]
            else:
                house_location = house_info[1]
            house_price = house.select('.money')[0].select('b')[0].string.encode('utf8')
            house_url = urljoin(url, house.select('a')[0]['href'])
            # insert data into result array
            result.append({
                'house_title' : house_title,
                'house_location' : house_location,
                'house_price' : house_price,
                'house_url' : house_url
            });
    return JsonResponse({'result':result})