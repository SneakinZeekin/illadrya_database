from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/spells/', include('spells.urls')),
    path('api/adventuring-feats/', include('adventuring_feats.urls')),
    path('api/auth/', include('accounts.urls')), 
]