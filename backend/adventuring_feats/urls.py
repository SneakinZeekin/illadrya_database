from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdventuringFeatViewSet

router = DefaultRouter()
router.register(r'feats', AdventuringFeatViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
