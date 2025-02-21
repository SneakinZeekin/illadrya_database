from rest_framework import viewsets
from django.db.models import Prefetch
from .models import AdventuringFeat, AdventuringFeatPrereq
from .serializers import AdventuringFeatSerializer

class AdventuringFeatViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AdventuringFeat.objects.all().order_by("feat_name").prefetch_related(
        Prefetch("prerequisites", queryset=AdventuringFeatPrereq.objects.all())
    )
    serializer_class = AdventuringFeatSerializer
