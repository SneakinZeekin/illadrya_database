from django.shortcuts import render
from django.db.models import Q
from .models import Spell, Class

def spell_list(request):
    spells = Spell.objects.all().prefetch_related("classes")  # Optimized

    search_query = request.GET.get('search', '').strip()
    level = request.GET.get('level', None)
    school = request.GET.get('school', None)
    casting_time = request.GET.get('casting_time', None)
    ritual = request.GET.get('ritual', None)
    concentration = request.GET.get('concentration', None)
    class_filter = request.GET.get('class', None)  # New filter for class

    sort_by = request.GET.get("sort_by", "spell_level") 
    sort_direction = request.GET.get("sort_direction", "asc")

    if search_query:
        spells = spells.filter(Q(spell_name__icontains=search_query))

    if level and level != "All":
        spells = spells.filter(spell_level=level)

    if school and school != "All":
        spells = spells.filter(spell_school=school)

    if casting_time and casting_time != "All":
        spells = spells.filter(spell_casting_time=casting_time)

    if ritual and ritual != "All":
        spells = spells.filter(spell_ritual=(ritual == "Yes"))

    if concentration and concentration != "All":
        spells = spells.filter(spell_concentration=(concentration == "Yes"))

    if class_filter and class_filter != "All":
        spells = spells.filter(classes__class_name=class_filter)  # Filtering by class

    if sort_by in ["spell_level", "spell_name", "spell_casting_time", "spell_school", "spell_ritual", "spell_concentration"]:
        spells = spells.order_by(f"{'-' if sort_direction == 'desc' else ''}{sort_by}")

    if sort_direction == "desc":
        spells = spells.order_by(f"-{sort_by}", "spell_name")
    else:
        spells = spells.order_by(sort_by, "spell_name") 

    levels = Spell.objects.values_list("spell_level", flat=True).distinct().order_by("spell_level")
    schools = Spell.objects.values_list("spell_school", flat=True).distinct().order_by("spell_school")
    casting_times = Spell.objects.values_list("spell_casting_time", flat=True).distinct().order_by("spell_casting_time")
    classes = Class.objects.values_list("class_name", flat=True).distinct().order_by("class_name")  # Add classes for filtering

    context = {
        'spells': spells,
        'levels': levels,
        'schools': schools,
        'casting_times': casting_times,
        'classes': classes,  # Include class filter options
    }

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return render(request, 'spells/spell_table.html', {'spells': spells})

    return render(request, 'spells/spell_list.html', context)
