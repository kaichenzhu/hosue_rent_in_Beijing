from HouseRentHelper.models import Region, Street
from bs4 import BeautifulSoup
from urlparse import urljoin
import requests
import threading

class Streets:
    def __init__(self):
        self.url = 'http://bj.58.com/{region}/pinpaigongyu/'
        self.regions = Region.objects.all()
        self.threads = []
    
    def fetch_streets_task(self, *regions):
        for region in regions:
            url_add = self.url.format(region = region.name_eng)
            print 'is fetching: ', url_add
            res = requests.get(url_add)
            html_text = BeautifulSoup(res.text, 'html.parser')
            streets_list = html_text.select('.wz-mod3 > p > a')
            for street in streets_list:
                street_utf8 = street.string.encode('utf8')
                street_eng = street['href'].split('/')[1]
                street_model = Street(region=region, name_eng=street_eng, name_chi=street_utf8)
                street_model.save()

    def fetch_streets(self, threads_num = 7):
        num = len(self.regions) / threads_num
        for i in range(threads_num):
            t = threading.Thread(target=self.fetch_streets_task, args=(self.regions[num*i:num*(i+1)]))
            t.start()
            self.threads.append(t)
        for i in range(threads_num):
            self.threads[i].join()
