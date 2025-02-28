from rest_framework import viewsets
from django.db.models import Prefetch
from .models import AdventuringFeat, AdventuringFeatPrereq
from .serializers import AdventuringFeatSerializer
from rest_framework.permissions import IsAuthenticated

class AdventuringFeatViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AdventuringFeat.objects.all().order_by("feat_name").prefetch_related(
        Prefetch("prerequisites", queryset=AdventuringFeatPrereq.objects.all())
    )
    serializer_class = AdventuringFeatSerializer
    permission_classes = [IsAuthenticated]
