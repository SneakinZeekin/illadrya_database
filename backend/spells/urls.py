from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SpellViewSet
from django.urls import include, path

router = DefaultRouter()
router.register(r'', SpellViewSet)

urlpatterns = [
    path("__debug__/", include("debug_toolbar.urls")),
    path('', include(router.urls)),
]
