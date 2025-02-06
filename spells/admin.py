from django.contrib import admin
from .models import Spell

@admin.register(Spell)
class SpellAdmin(admin.ModelAdmin):
    list_display = ('spell_name', 'spell_level', 'spell_school')