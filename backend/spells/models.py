from django.db import models

class Class(models.Model):
    class_name = models.CharField(max_length=50, primary_key=True)

    class Meta:
        db_table = "classes"
        managed = False

    def __str__(self):
        return self.class_name

class Spell(models.Model):
    spell_name = models.CharField(max_length=255, primary_key=True)
    spell_level = models.IntegerField()
    spell_school = models.CharField(max_length=100)
    spell_casting_time = models.CharField(max_length=100)
    spell_reaction = models.TextField(blank=True, null=True)
    spell_ritual = models.BooleanField(default=False)
    spell_range = models.CharField(max_length=100, null=True, blank=True)
    spell_components = models.CharField(max_length=255, blank=True, null=True)
    spell_materials = models.TextField(blank=True, null=True)
    spell_duration = models.CharField(max_length=100)
    spell_concentration = models.BooleanField(default=False)
    spell_description = models.TextField(null=True, blank=True)
    
    # Many-to-Many relationship to classes
    classes = models.ManyToManyField(Class, through="ClassSpellList")

    class Meta:
        db_table = "spells"
        managed = False

    def __str__(self):
        return self.spell_name

class ClassSpellList(models.Model):
    spell = models.ForeignKey(Spell, on_delete=models.CASCADE, db_column="spell_name")
    class_name = models.ForeignKey(Class, on_delete=models.CASCADE, db_column="class_name")

    class Meta:
        db_table = "class_spell_lists"
        unique_together = ("spell", "class_name")
        managed = False