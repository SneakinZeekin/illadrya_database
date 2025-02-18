from rest_framework import viewsets
from .models import Spell
from .serializers import SpellSerializer
from django.db import connection
import time

class SpellViewSet(viewsets.ModelViewSet):
    queryset = Spell.objects.all().prefetch_related("classes")
    serializer_class = SpellSerializer

    def list(self, request, *args, **kwargs):
        start_time = time.time()
        response = super().list(request, *args, **kwargs)
        end_time = time.time()

        print(f"⏱️ Query Time: {end_time - start_time:.2f} seconds")
        for query in connection.queries:
            print(f"SQL: {query['sql']} - Time: {query['time']}s")

        return response
