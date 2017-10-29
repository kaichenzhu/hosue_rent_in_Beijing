from django.conf.urls import url, include
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
import views

router = DefaultRouter()
router.register(r'regions', views.RegionViewSet)
router.register(r'streets', views.StreetViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^BJ58$', views.fetchFromBJ58, name='fetchFromBJ58'),
]