from rest_framework import viewsets
from .models import Spell, Class
from .serializers import SpellSerializer, ClassSerializer

class SpellViewSet(viewsets.ModelViewSet):
    queryset = Spell.objects.all().prefetch_related("classes")
    serializer_class = SpellSerializer

class ClassViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Class.objects.all().order_by("class_name")
    serializer_class = ClassSerializer
