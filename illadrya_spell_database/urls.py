from django.contrib import admin
from django.urls import include, path
from spells.views import spell_list

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', spell_list, name='spell_list'),
    path('__debug__/', include('debug_toolbar.urls')),
]