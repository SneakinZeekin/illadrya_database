from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SpellViewSet, ClassViewSet

router = DefaultRouter()
router.register(r'spells', SpellViewSet, basename="spells")
router.register(r'classes', ClassViewSet, basename="classes")

urlpatterns = [
    path("__debug__/", include("debug_toolbar.urls")),
    path("", include(router.urls)),
]
