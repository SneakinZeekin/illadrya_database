from rest_framework import viewsets
from .models import Spell, Class
from .serializers import SpellSerializer, ClassSerializer
from rest_framework.permissions import IsAuthenticated

class SpellViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Spell.objects.all().prefetch_related("classes")
    serializer_class = SpellSerializer
    permission_classes = [IsAuthenticated]

class ClassViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Class.objects.all().order_by("class_name")
    serializer_class = ClassSerializer
    permission_classes = [IsAuthenticated]
